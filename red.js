/* =====================================================================
   SQLQuiz en directo · Comunicación y utilidades comunes
   ---------------------------------------------------------------------
   La pantalla de clase (profe.html) y los móviles (index.html) se hablan
   a través de un servidor MQTT público y gratuito: no hace falta cuenta.

     ?modo=local  → sin internet: comunica pestañas del MISMO navegador
                    (para probar en tu ordenador con varias pestañas).
     ?broker=emqx → usa el servidor alternativo si el principal falla.
   ===================================================================== */

const CONFIG = {
  prefijo: 'sqlquiz-safa/v1',                 // espacio de nombres de los mensajes
  brokers: {
    hivemq: 'wss://broker.hivemq.com:8884/mqtt',
    emqx:   'wss://broker.emqx.io:8084/mqtt',
  },
  libreria: [                                  // MQTT.js; si el primer CDN falla, se prueba el segundo
    'https://unpkg.com/mqtt@5.10.1/dist/mqtt.min.js',
    'https://cdn.jsdelivr.net/npm/mqtt@5.10.1/dist/mqtt.min.js',
  ],
};

const PARAMS = new URLSearchParams(location.search);
const MODO_LOCAL = PARAMS.get('modo') === 'local';
const BROKER = CONFIG.brokers[PARAMS.get('broker')] ? PARAMS.get('broker') : 'hivemq';

/* ---------- Carga de la librería MQTT ---------- */
function cargarScript(url) {
  return new Promise((ok, ko) => {
    const s = document.createElement('script');
    s.src = url; s.async = true; s.onload = ok; s.onerror = ko;
    document.head.appendChild(s);
  });
}
async function cargarMqtt() {
  if (window.mqtt) return;
  for (const url of CONFIG.libreria) {
    try { await cargarScript(url); if (window.mqtt) return; } catch (e) { /* siguiente */ }
  }
  throw new Error('No se pudo cargar la librería de conexión (¿sin internet?).');
}

/* ---------- Conexión ----------
   rol: 'profe' escucha el canal 'jug' y publica en 'profe'.
        'jug'   escucha el canal 'profe' y publica en 'jug'.
   Devuelve { enviar(obj, { retener }), cerrar() }                         */
async function conectar({ pin, rol, alRecibir, alEstado }) {
  const escucha = rol === 'profe' ? 'jug' : 'profe';
  const tema = canal => `${CONFIG.prefijo}/${pin}/${canal}`;
  const estado = e => alEstado && alEstado(e);

  if (MODO_LOCAL) {
    const bc = new BroadcastChannel('sqlquiz-' + pin);
    const claveRet = `sqlquiz-ret-${pin}`;
    bc.onmessage = ev => { if (ev.data.canal === escucha) alRecibir(ev.data.datos); };
    if (rol === 'jug') {                                   // simula el mensaje «retenido»
      try { const r = localStorage.getItem(claveRet); if (r) setTimeout(() => alRecibir(JSON.parse(r)), 30); } catch (e) {}
    }
    estado('conectado');
    return {
      enviar(datos, { retener = false } = {}) {
        bc.postMessage({ canal: rol, datos });
        if (retener && rol === 'profe') { try { localStorage.setItem(claveRet, JSON.stringify(datos)); } catch (e) {} }
      },
      borrarRetenido() { try { localStorage.removeItem(claveRet); } catch (e) {} },
      cerrar() { bc.close(); },
    };
  }

  estado('cargando');
  await cargarMqtt();
  estado('conectando');
  const cliente = window.mqtt.connect(CONFIG.brokers[BROKER], {
    clientId: 'aq_' + rol + '_' + Math.random().toString(36).slice(2, 10),
    clean: true, keepalive: 30, connectTimeout: 10000, reconnectPeriod: 2000,
  });
  cliente.on('message', (t, buf) => { try { alRecibir(JSON.parse(buf.toString())); } catch (e) {} });
  cliente.on('reconnect', () => estado('reconectando'));
  cliente.on('offline', () => estado('sin conexión'));
  cliente.on('connect', () => { cliente.subscribe(tema(escucha), { qos: 1 }); estado('conectado'); });

  await new Promise((ok, ko) => {
    const t = setTimeout(() => ko(new Error('El servidor no responde. Prueba otra red o el servidor alternativo.')), 12000);
    cliente.once('connect', () => { clearTimeout(t); ok(); });
  });

  return {
    enviar(datos, { retener = false } = {}) {
      cliente.publish(tema(rol), JSON.stringify(datos), { qos: 1, retain: retener });
    },
    borrarRetenido() { cliente.publish(tema(rol), '', { qos: 1, retain: true }); },
    cerrar() { cliente.end(true); },
  };
}

/* ---------- Utilidades ---------- */
const $ = s => document.querySelector(s);
const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const conCodigo = t => esc(t).replace(/`([^`]+)`/g, '<code>$1</code>');
const barajar = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const leer = (k, d) => { try { const v = localStorage.getItem('sqlquiz.' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } };
const guardar = (k, v) => { try { localStorage.setItem('sqlquiz.' + k, JSON.stringify(v)); } catch (e) {} };
const miles = n => Number(n).toLocaleString('es-ES');

/* Resaltado de SQL: palabras reservadas, tipos, textos, números y comentarios */
const SQL_KW = new Set(('create database table if not exists drop use primary key foreign references constraint unique default check ' +
  'auto_increment on delete update cascade restrict set null character collate alter add column modify rename to insert into values ' +
  'and or in between select from where show tables describe engine').split(' '));
const SQL_TY = new Set('int integer bigint tinyint smallint decimal varchar char text date time datetime timestamp boolean float double true false'.split(' '));
function resaltar(codigo) {
  let h = '';
  const re = /(--[^\n]*)|('[^'\n]*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)|([\s\S])/g; let m;
  while ((m = re.exec(codigo))) {
    if (m[1]) h += '<span class="c">' + esc(m[1]) + '</span>';
    else if (m[2]) h += '<span class="s">' + esc(m[2]) + '</span>';
    else if (m[3]) h += '<span class="a">' + m[3] + '</span>';
    else if (m[4]) { const w = m[4].toLowerCase();
      h += SQL_KW.has(w) ? '<span class="k">' + m[4] + '</span>' : SQL_TY.has(w) ? '<span class="t">' + m[4] + '</span>' : m[4]; }
    else h += esc(m[5]);
  }
  return h;
}

const FORMAS = [
  '<svg viewBox="0 0 24 24"><path d="M12 3 22 20H2z"/></svg>',
  '<svg viewBox="0 0 24 24"><path d="M12 2 22 12 12 22 2 12z"/></svg>',
  '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>',
  '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>',
];
// con 2 opciones (Verdadero / Falso): verde y rojo
const colorOpcion = (i, n) => n === 2 ? (i === 0 ? 3 : 0) : i;

const AVATARES = ['🦭', '🐬', '🐳', '🐙', '🦀', '🐢', '🐠', '🦈', '🦑', '🐡', '🦐', '🐧'];

/* ---------- Burbujas de fondo ---------- */
function burbujas(n = 22) {
  const o = $('#oceano'); if (!o) return;
  for (let i = 0; i < n; i++) {
    const b = document.createElement('div'); b.className = 'burbuja';
    const t = 6 + Math.random() * 22;
    b.style.cssText = `left:${Math.random() * 100}%;width:${t}px;height:${t}px;animation-duration:${9 + Math.random() * 14}s;animation-delay:${-Math.random() * 20}s;--deriva:${(Math.random() - .5) * 80}px`;
    o.appendChild(b);
  }
}

/* ---------- Sonido sin archivos ---------- */
let sonido = leer('sonido', true), audioCtx;
function tono(f, d = .12, tipo = 'sine', v = .12, r = 0) {
  if (!sonido) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const t0 = audioCtx.currentTime + r, o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = tipo; o.frequency.setValueAtTime(f, t0);
    g.gain.setValueAtTime(v, t0); g.gain.exponentialRampToValueAtTime(.0001, t0 + d);
    o.connect(g).connect(audioCtx.destination); o.start(t0); o.stop(t0 + d + .02);
  } catch (e) {}
}
const sonidos = {
  bien: () => { tono(660, .12, 'triangle'); tono(880, .12, 'triangle', .12, .1); tono(1320, .25, 'triangle', .1, .2); },
  mal: () => { tono(220, .25, 'sawtooth', .07); tono(160, .35, 'sawtooth', .07, .15); },
  tic: () => tono(1000, .05, 'square', .04),
  unir: () => { tono(784, .08, 'triangle', .08); tono(1046, .12, 'triangle', .08, .07); },
  fin: () => [523, 659, 784, 1046].forEach((f, i) => tono(f, .3, 'triangle', .1, i * .13)),
  gong: () => { tono(392, .5, 'triangle', .12); tono(523, .6, 'triangle', .1, .05); },
};
function botonSonido(sel) {
  const pinta = () => document.querySelectorAll(sel).forEach(b => b.textContent = sonido ? '🔊' : '🔇');
  document.querySelectorAll(sel).forEach(b => b.onclick = () => { sonido = !sonido; guardar('sonido', sonido); pinta(); });
  pinta();
}

/* ---------- Confeti ---------- */
let confetiHasta = 0;
function confeti(ms = 5000) {
  const cv = $('#confeti'); if (!cv) return;
  const ctx = cv.getContext('2d'); cv.width = innerWidth; cv.height = innerHeight;
  const cols = ['#4fe0f0', '#ffd36e', '#ff6b8b', '#36d69a', '#4f9bff', '#ffffff'];
  const ps = Array.from({ length: 200 }, () => ({
    x: Math.random() * cv.width, y: -20 - Math.random() * cv.height * .6, w: 6 + Math.random() * 7, h: 8 + Math.random() * 9,
    vy: 2 + Math.random() * 3.5, vx: (Math.random() - .5) * 2.5, r: Math.random() * 6, vr: (Math.random() - .5) * .25, c: cols[Math.floor(Math.random() * cols.length)],
  }));
  confetiHasta = performance.now() + ms;
  (function anim(t) {
    ctx.clearRect(0, 0, cv.width, cv.height);
    ps.forEach(p => { p.x += p.vx; p.y += p.vy; p.r += p.vr; if (p.y > cv.height + 20) p.y = -20; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore(); });
    if (t < confetiHasta) requestAnimationFrame(anim); else ctx.clearRect(0, 0, cv.width, cv.height);
  })(performance.now());
}
