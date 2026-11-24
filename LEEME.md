# SQLQuiz en directo · UT3 Diseño físico (MariaDB + DBeaver)

Concurso tipo Kahoot para clase, con 55 preguntas de la UT3 (scripts SQL en MariaDB): **la pantalla digital** enseña las preguntas, el
tiempo y el ranking, y **cada alumno responde desde su móvil** a la vez.

| Archivo | Para qué |
|---|---|
| `profe.html` | **Pantalla de clase** (la abres tú en el ordenador del aula) |
| `index.html` | **Móvil del alumno** (a donde lleva el QR) |
| `preguntas.js` | Las preguntas de los 3 niveles (Orilla, Mar abierto y Profundidades): aquí añades o cambias |
| `red.js`, `estilos.css` | Conexión y estilos comunes (no hace falta tocarlos) |

## 1. Subirlo a GitHub Pages

1. GitHub → **New repository** → nombre `sqlquiz` → **Public** → *Create*.
2. **Add file → Upload files** → arrastra los 5 archivos → *Commit changes*.
3. **Settings → Pages** → *Source*: **Deploy from a branch** · *Branch*: **main** · **/ (root)** → *Save*.
4. En un par de minutos tendrás:
   - Pantalla de clase: `https://TU-USUARIO.github.io/sqlquiz/profe.html`
   - Alumnos: `https://TU-USUARIO.github.io/sqlquiz/` (aunque lo normal es que entren con el QR)

## 2. Jugar en clase

1. En el ordenador del aula abre **`profe.html`** a pantalla completa (F11).
2. Elige el **nivel**, el **número de preguntas** y el **tiempo** → **Crear partida**.
3. Sale un **QR** y un **PIN**. Los alumnos escanean el QR (o entran en la dirección y escriben el PIN),
   ponen su apodo, eligen un avatar y aparecen en la pantalla.
   - Pulsa sobre un nombre para **expulsarlo** (por ejemplo, si el apodo no es adecuado).
   - Se puede entrar con la partida empezada; si un móvil recarga, recupera sus puntos.
4. **¡Empezar!** Cada pregunta:
   - Primero se muestra solo el enunciado unos segundos para leerlo.
   - Luego aparecen las opciones y en los móviles los botones de colores.
   - Cuando responden todos o se acaba el tiempo, se corrige: gráfico de respuestas,
     respuesta correcta y explicación. Cada móvil ve si ha acertado, los puntos y su puesto.
   - **Ver clasificación** → top 5 con subidas y bajadas → **Siguiente pregunta**.
5. Al final: **podio** animado, tabla completa y botón para **descargar los resultados en CSV**
   (se abre en Excel). **Revancha** juega otra ronda con los mismos alumnos.

Atajo: en la pantalla de clase, **Enter** o **barra espaciadora** pulsan el botón principal de cada momento.

**Puntos:** como en Kahoot, entre 1000 y 500 por acierto según la rapidez, más +100 por
cada acierto seguido (máximo +500).

## 3. Antes del primer día: prueba de 2 minutos

La conexión usa un **servidor MQTT público y gratuito** (HiveMQ): no hay que crear cuentas
ni configurar nada. Aun así, pruébalo una vez **con la wifi del centro**:

1. Abre `profe.html` en el ordenador y crea una partida.
2. Únete con tu móvil escaneando el QR.
3. Si aparece tu nombre en la pantalla, todo funciona. ✔

Si no conecta:
- En la configuración de `profe.html`, cambia **Servidor** a **Alternativo (EMQX)** y vuelve a probar.
  El QR ya lleva el servidor elegido, así que los móviles se conectan al mismo.
- Algunas redes de centros bloquean estas conexiones. En ese caso, que los alumnos usen
  los **datos del móvil**, o comparte datos desde tu móvil al ordenador del aula.

**Modo local (sin internet):** elige *Servidor → Local*. Sirve para ensayar en tu
ordenador. Abre `profe.html` en una pestaña y `index.html` en otras del mismo navegador.
En este modo no se pueden unir móviles.

## Añadir o cambiar preguntas

Todo está en `preguntas.js`. Cada pregunta tiene este formato:

```js
{
  p: 'Enunciado. Lo que vaya entre `acentos graves` sale como código.',
  code: 'create table tarifa(\n\tid int auto_increment primary key\n);',  // opcional
  o: ['Respuesta correcta', 'Otra', 'Otra', 'Otra'],             // 4 opciones, o 2 para Verdadero/Falso
  c: 0,                                                           // índice de la correcta
  e: 'Explicación que se verá al corregir.',
  t: 30                                                           // opcional: segundos
},
```

Puedes poner siempre la correcta la primera (`c: 0`): el juego baraja el orden.
Después, vuelve a subir `preguntas.js` a GitHub.

## Bueno saber

- No recargues `profe.html` en mitad de una partida: la partida vive en esa pestaña (el
  navegador te avisará si lo intentas).
- El servidor es público: los mensajes no llevan datos personales (solo apodo, avatar y
  respuestas) y la respuesta correcta no se envía a los móviles hasta la corrección.
