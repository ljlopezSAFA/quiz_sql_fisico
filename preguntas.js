/* =====================================================================
   SQLQuiz · Banco de preguntas · UT3 Diseño físico (MariaDB + DBeaver)
   ---------------------------------------------------------------------
   Cada pregunta:
     p    → enunciado. Lo que vaya entre `acentos graves` sale como código.
     code → (opcional) bloque de código SQL que se muestra bajo el enunciado.
     o    → opciones (2 o 4). Admiten `código`.
     c    → índice de la opción correcta (empieza en 0).
     e    → explicación que se enseña al corregir.
     t    → (opcional) segundos para responder. Por defecto, 25 (35 con código).
   Las opciones de 4 se barajan solas; las de 2 (Verdadero/Falso) no.
   ===================================================================== */

const NIVELES = [
  {
    id: 'orilla',
    nombre: 'Orilla',
    titulo: 'Primeros scripts',
    descripcion: 'Diseño físico, partes de SQL, MariaDB y DBeaver, create database, use y tipos de datos.',
    icono: '🐚',
    color: '#2ec4d6',
    porPartida: 12,
    preguntas: [
      {
        p: '¿En qué orden se diseña una base de datos?',
        o: ['Conceptual (E/R) → lógico (relacional) → físico (script)', 'Físico → lógico → conceptual', 'Lógico → conceptual → físico', 'Conceptual → físico → lógico'],
        c: 0,
        e: 'Primero el E/R, después el diagrama de tablas y, por último, el script SQL que crea la base de datos en MariaDB.'
      },
      {
        p: '¿Qué obtenemos al terminar el diseño físico?',
        o: ['Un script SQL que crea la base de datos', 'Un diagrama E/R', 'Un diagrama de tablas', 'Una lista de requisitos'],
        c: 0,
        e: 'El diagrama de tablas es el plano; el script `.sql` es la obra. Se guarda, se comparte y se puede ejecutar otra vez.'
      },
      {
        p: '`create`, `alter` y `drop` pertenecen a…',
        o: ['DDL (definición de datos)', 'DML (manipulación de datos)', 'DCL (control de datos)', 'TCL (transacciones)'],
        c: 0,
        e: 'El DDL crea y cambia la estructura. Es la parte de SQL que usamos en esta unidad.'
      },
      {
        p: '`insert`, `update`, `delete` y `select` pertenecen a…',
        o: ['DML (manipulación de datos)', 'DDL (definición de datos)', 'DCL (control de datos)', 'TCL (transacciones)'],
        c: 0,
        e: 'El DML trabaja con las filas: añadir, cambiar, borrar y consultar. Lo veremos a fondo en la próxima unidad.'
      },
      {
        p: '¿Qué papel tiene cada programa?',
        o: ['MariaDB es el servidor y DBeaver el cliente', 'DBeaver es el servidor y MariaDB el cliente', 'Los dos son servidores', 'Los dos son lenguajes de programación'],
        c: 0,
        e: 'MariaDB guarda las bases de datos y ejecuta las sentencias. DBeaver es el programa desde el que las escribimos y vemos los resultados.'
      },
      {
        p: '¿En qué puerto escucha MariaDB por defecto?',
        o: ['`3306`', '`5432`', '`8080`', '`1521`'],
        c: 0,
        e: 'Es el mismo puerto que MySQL. `5432` es el de PostgreSQL y `1521` el de Oracle.'
      },
      {
        p: 'En DBeaver, ¿qué atajo ejecuta el script entero de arriba abajo?',
        o: ['`Alt + X`', '`Ctrl + Enter`', '`F5`', '`Ctrl + S`'],
        c: 0,
        e: '`Ctrl + Enter` ejecuta solo la sentencia donde está el cursor. `F5` refresca el navegador y `Ctrl + S` guarda el script.'
      },
      {
        p: 'Has ejecutado el script sin errores, pero las tablas no aparecen en el navegador de DBeaver. ¿Qué haces?',
        o: ['Refrescar con `F5`', 'Volver a crear la conexión', 'Reinstalar MariaDB', 'Borrar la base de datos'],
        c: 0,
        e: 'Las tablas ya existen: el navegador no se actualiza solo. Selecciona la base de datos y pulsa `F5`.'
      },
      {
        p: '¿Qué hace esta sentencia?',
        code: 'use biblioteca;',
        o: ['Selecciona la base de datos sobre la que trabajan las sentencias siguientes', 'Crea la base de datos', 'Borra la base de datos', 'Muestra sus tablas'],
        c: 0,
        e: 'Sin `use`, MariaDB no sabe en qué base de datos crear las tablas y da el error 1046 «No database selected».'
      },
      {
        p: '¿Para qué ponemos `character set utf8mb4` al crear la base de datos?',
        o: ['Para guardar bien tildes, ñ y emojis', 'Para que ocupe menos', 'Para que vaya más rápido', 'Para que no distinga mayúsculas'],
        c: 0,
        e: 'Es el juego de caracteres completo de Unicode. La `collate` decide cómo se comparan y ordenan los textos.'
      },
      {
        p: '¿Qué aporta `if not exists`?',
        code: 'create database if not exists biblioteca\ncharacter set utf8mb4\ncollate utf8mb4_unicode_ci;',
        o: ['Si la base de datos ya existe, no da error', 'Borra la base de datos antes de crearla', 'Crea la base de datos vacía aunque exista', 'Solo la crea si tiene tablas'],
        c: 0,
        e: 'Así el script se puede ejecutar dos veces seguidas. Lo mismo hace `drop table if exists` con las tablas.'
      },
      {
        p: 'Verdadero o falso: cada sentencia SQL del script termina en punto y coma.',
        o: ['Verdadero', 'Falso'],
        c: 0,
        e: 'El `;` marca dónde acaba una sentencia y empieza la siguiente. Olvidarlo es uno de los errores más típicos.'
      },
      {
        p: '¿Cómo se escribe un comentario de una línea en un script SQL?',
        o: ['`-- comentario`', '`// comentario`', '`<!-- comentario -->`', '`\' comentario`'],
        c: 0,
        e: 'Para varias líneas se usa `/* … */`, como en la cabecera de nuestros scripts.'
      },
      {
        p: '¿Qué tipo usamos para el precio de un producto?',
        o: ['`decimal(6,2)`', '`float`', '`int`', '`varchar(6)`'],
        c: 0,
        e: 'El dinero va siempre en `decimal`: guarda la cifra exacta. `float` y `double` son aproximados y pueden perder céntimos.'
      },
      {
        p: '¿Cuál es el valor más alto que cabe en `decimal(6,2)`?',
        o: ['`9999.99`', '`999999.99`', '`6.2`', '`999.99`'],
        c: 0,
        e: '6 dígitos en total, de los que 2 son decimales: quedan 4 para la parte entera.'
      },
      {
        p: '¿Qué tipo usamos para un número de teléfono?',
        o: ['`varchar(15)`', '`int`', '`decimal(9,0)`', '`bigint`'],
        c: 0,
        e: 'No se hacen cuentas con un teléfono, puede empezar por 0 o llevar «+34». Por eso es texto.'
      },
      {
        p: 'El DNI siempre tiene 9 caracteres. ¿Qué tipo es el más adecuado?',
        o: ['`char(9)`', '`int`', '`date`', '`boolean`'],
        c: 0,
        e: '`char(n)` es texto de longitud fija. También se usa para el código postal: `char(5)`.'
      },
      {
        p: '¿Qué tipo usamos para guardar fecha y hora juntas, como el momento de un pedido?',
        o: ['`datetime`', '`date`', '`time`', '`varchar(20)`'],
        c: 0,
        e: '`date` guarda solo la fecha (\'AAAA-MM-DD\') y `time` solo la hora (\'HH:MM:SS\').'
      },
      {
        p: 'En MariaDB, una columna `boolean` se guarda en realidad como…',
        o: ['`tinyint(1)`: 1 es verdadero y 0 falso', 'Texto \'true\' o \'false\'', '`char(1)`', '`bit(8)`'],
        c: 0,
        e: '`boolean` es un sinónimo de `tinyint(1)`. Por eso, al consultar, verás 1 y 0.'
      },
    ]
  },

  {
    id: 'mar-abierto',
    nombre: 'Mar abierto',
    titulo: 'Restricciones',
    descripcion: 'Clave primaria, auto_increment, not null, unique, default, check, claves foráneas y on delete.',
    icono: '🐬',
    color: '#ffb547',
    porPartida: 12,
    preguntas: [
      {
        p: '¿Cómo escribimos en clase la clave primaria de una entidad?',
        o: ['`id int auto_increment primary key`', '`id int not null`', '`id varchar(10) primary key`', '`primary key id int`'],
        c: 0,
        e: 'Siempre se llama `id`, es entero y MariaDB lo numera solo.'
      },
      {
        p: '¿Qué hace `auto_increment`?',
        o: ['MariaDB numera sola la columna: 1, 2, 3…', 'Suma 1 a todos los valores al insertar', 'Hace la columna obligatoria', 'Ordena la tabla por esa columna'],
        c: 0,
        e: 'Al insertar no damos el `id`: lo calcula MariaDB.'
      },
      {
        p: 'Una tabla tiene filas con id 1, 2 y 3. Borras la 3 e insertas una fila nueva. ¿Qué id recibe?',
        o: ['4', '3', '1', 'Da error'],
        c: 0,
        e: 'Con `auto_increment` los números no se reutilizan, aunque se borre la fila.'
      },
      {
        p: '`primary key` implica, a la vez…',
        o: ['`not null` y `unique`', 'Solo `not null`', 'Solo `unique`', '`default` y `check`'],
        c: 0,
        e: 'La clave primaria identifica cada fila: no puede faltar ni repetirse.'
      },
      {
        p: 'Verdadero o falso: una tabla puede tener dos claves primarias.',
        o: ['Verdadero', 'Falso'],
        c: 1,
        e: 'Tiene una sola clave primaria, aunque esté formada por varias columnas: `primary key (id_autor, id_libro)`.'
      },
      {
        p: 'En el E/R, el DNI era el identificador del monitor. ¿Cómo queda en el script?',
        o: ['`dni char(9) not null unique`', '`dni char(9) primary key`', '`dni char(9) foreign key`', '`dni char(9) check`'],
        c: 0,
        e: 'La clave primaria es siempre `id`. El DNI no se puede repetir ni faltar: `not null unique`.'
      },
      {
        p: '¿Qué garantiza `not null`?',
        o: ['Que el dato es obligatorio', 'Que no se repite', 'Que tiene un valor por defecto', 'Que es un número'],
        c: 0,
        e: 'Si en un insert falta ese dato, MariaDB da el error 1048: «Column cannot be null».'
      },
      {
        p: 'Haces un insert en `clase` sin indicar las plazas. ¿Qué se guarda?',
        code: 'plazas int not null default 20',
        o: ['20', 'NULL', 'Da error porque es `not null`', '0'],
        c: 0,
        e: '`default` pone ese valor cuando no se indica ninguno, así que la columna no queda vacía.'
      },
      {
        p: '¿Qué pasa si intentas guardar un precio de -5?',
        code: 'precio decimal(6,2) not null\ncheck (precio >= 0)',
        o: ['Da error y la fila no se guarda', 'Se guarda 0', 'Se guarda 5', 'Se guarda -5 con un aviso'],
        c: 0,
        e: 'Si no se cumple el `check`, MariaDB rechaza la fila: error 4025 «CONSTRAINT failed».'
      },
      {
        p: '¿Qué garantiza esta restricción?',
        code: 'constraint fk_socio_tarifa\nforeign key (id_tarifa)\nreferences tarifa(id)',
        o: ['Que el `id_tarifa` del socio existe en la tabla `tarifa`', 'Que cada socio tiene una tarifa distinta', 'Que la tarifa no se puede repetir', 'Que `id_tarifa` es la clave primaria de socio'],
        c: 0,
        e: 'Es la integridad referencial: no se puede apuntar a una tarifa que no existe.'
      },
      {
        p: '¿De qué tipo es la columna `id_tarifa` de la tabla `socio`?',
        o: ['`int`, igual que el `id` al que apunta', '`varchar(10)`', '`decimal(6,2)`', 'Da igual el tipo'],
        c: 0,
        e: 'La FK y la clave a la que apunta deben ser del mismo tipo. Si no, la tabla no se crea.'
      },
      {
        p: '¿Por qué todas nuestras claves foráneas llevan `not null`?',
        o: ['Por la regla de oro: ninguna FK puede quedar vacía', 'Porque MariaDB lo exige siempre', 'Para que no se repitan', 'Porque son claves primarias'],
        c: 0,
        e: 'Si una FK pudiera quedar a NULL, en el diagrama ya habríamos creado una tabla aparte para esa relación.'
      },
      {
        p: '`socio` tiene una FK a `tarifa`. ¿Qué tabla se crea primero?',
        o: ['`tarifa`', '`socio`', 'Da igual', 'Las dos a la vez'],
        c: 0,
        e: 'El padre siempre antes que la hija: cuando se crea `socio`, `tarifa` ya tiene que existir.'
      },
      {
        p: 'Al principio del script borramos las tablas con `drop table if exists`. ¿En qué orden?',
        o: ['Primero las hijas y después las padre', 'Primero las padre', 'En orden alfabético', 'Da igual el orden'],
        c: 0,
        e: 'No se puede borrar una tabla a la que apuntan otras. Es el orden inverso al de creación.'
      },
      {
        p: '¿Qué hace `on delete cascade` en la FK `id_sala` de la tabla `enigma`?',
        o: ['Si se borra la sala, se borran también sus enigmas', 'No deja borrar la sala', 'Pone `id_sala` a NULL', 'Borra la sala si se borran sus enigmas'],
        c: 0,
        e: 'Tiene sentido cuando los hijos no significan nada sin su padre, como los teléfonos de un cliente.'
      },
      {
        p: 'Si la FK no lleva `on delete`, ¿qué pasa al borrar un padre que tiene hijos?',
        o: ['No deja borrarlo (restrict)', 'Se borran los hijos', 'Los hijos quedan a NULL', 'Se borra solo el padre'],
        c: 0,
        e: 'Es el comportamiento por defecto. MariaDB da el error 1451: «Cannot delete or update a parent row».'
      },
      {
        p: '¿Por qué no usamos `on delete set null`?',
        o: ['Porque nuestras FK son `not null`', 'Porque no existe en MariaDB', 'Porque borra los hijos', 'Porque es más lento'],
        c: 0,
        e: '`set null` pone la FK de los hijos a NULL, y eso choca con la regla de oro.'
      },
      {
        p: 'Según nuestro convenio, la restricción de la FK `id_editorial` de la tabla `libro` se llama…',
        o: ['`fk_libro_editorial`', '`fk_editorial_libro`', '`libro_fk`', '`id_editorial_fk`'],
        c: 0,
        e: 'fk + tabla hija + tabla padre. Con un nombre claro, los errores dicen qué FK ha fallado.'
      },
    ]
  },

  {
    id: 'profundidades',
    nombre: 'Profundidades',
    titulo: 'Del diagrama al script',
    descripcion: 'Cada caso del modelo relacional en SQL, errores de MariaDB, alter table y scripts que se repiten.',
    icono: '🦭',
    color: '#ff6b9a',
    porPartida: 12,
    preguntas: [
      {
        p: '`autor_libro` es una N:M sin atributos. ¿Cuál es su clave primaria?',
        code: 'create table if not exists autor_libro(\n\tid_autor int not null,\n\tid_libro int not null,\n\t??? ,\n\t...\n);',
        o: ['`primary key (id_autor, id_libro)`', '`id int auto_increment primary key`', 'Dos `primary key`, una en cada columna', 'No lleva clave primaria'],
        c: 0,
        e: 'Una sola clave primaria formada por las dos FK. Se escribe al final, después de las columnas.'
      },
      {
        p: 'En clase, ¿cómo creamos una N:M que tiene atributos propios, como `alumno_libro` con las fechas del préstamo?',
        o: ['Con su propio `id` y las dos FK `not null`', 'Con clave primaria compuesta por las dos FK', 'Sin clave primaria', 'Metiendo las fechas en `libro`'],
        c: 0,
        e: 'Así la tabla funciona como una entidad más, igual que la crearéis después como clase Java.'
      },
      {
        p: 'Relación 1:1 con (1,1)-(0,1): la FK va en `sala`. ¿Cómo se escribe?',
        o: ['`id_empleado int not null unique`', '`id_empleado int not null`', '`id_empleado int primary key`', '`id_empleado int unique default 0`'],
        c: 0,
        e: 'Sin `unique` sería una 1:N: el mismo empleado podría ser responsable de varias salas.'
      },
      {
        p: 'Atributo multivaluado: los teléfonos de un cliente. ¿Cuál es la clave primaria de `cliente_telefono`?',
        o: ['`primary key (id_cliente, telefono)`', '`primary key (id_cliente)`', '`primary key (telefono)`', '`id int auto_increment primary key`'],
        c: 0,
        e: 'Un cliente tiene varios teléfonos, pero no puede repetir el mismo. Por eso la clave son las dos columnas.'
      },
      {
        p: '1:N con (0,1) en el lado 1: hay jugadores sin equipo. ¿Cuál es la clave primaria de `equipo_jugador`?',
        code: 'create table if not exists equipo_jugador(\n\tid_jugador int not null,\n\tid_equipo int not null,\n\t...\n);',
        o: ['Solo `id_jugador`', 'Solo `id_equipo`', '`(id_jugador, id_equipo)`', 'Un `id` nuevo'],
        c: 0,
        e: 'La PK es la clave del lado N: cada jugador aparece una vez como mucho, porque solo puede tener un equipo.'
      },
      {
        p: 'Reflexiva 1:N con (0,1): `empleado_coordinador`. ¿A qué tabla apuntan sus dos FK?',
        code: 'id_empleado int not null primary key,\nid_coordinador int not null,',
        o: ['Las dos a `empleado(id)`, con restricciones de nombre distinto', '`id_coordinador` a una tabla `coordinador`', 'Solo `id_empleado` es FK', 'A ninguna: son columnas normales'],
        c: 0,
        e: 'El coordinador también es un empleado. La segunda FK se nombra por su rol: `id_coordinador`.'
      },
      {
        p: '¿Por qué falla este `create table`?',
        code: 'create table if not exists autor(\n\tid int auto_increment primary key,\n\tnombre varchar(60) not null,\n\tnacionalidad varchar(40) not null,\n);',
        o: ['Sobra la coma después de la última columna', 'Falta `if exists`', '`varchar` no admite 60', 'Falta la clave foránea'],
        c: 0,
        e: 'Es el error de sintaxis más típico (1064): cada columna lleva coma menos la última.'
      },
      {
        p: 'MariaDB dice «Foreign key constraint is incorrectly formed» (errno 150). ¿Cuál es la causa?',
        code: 'create table if not exists libro(\n\tid int auto_increment primary key,\n\tid_editorial varchar(10) not null,\n\tconstraint fk_libro_editorial\n\tforeign key (id_editorial)\n\treferences editorial(id)\n);',
        o: ['`id_editorial` no es del mismo tipo que `editorial.id`', 'Falta `on delete cascade`', 'El nombre de la restricción es incorrecto', 'Falta `unique`'],
        c: 0,
        e: 'La FK debe ser `int` como el `id`. El mismo error sale si la tabla padre todavía no existe.'
      },
      {
        p: 'Al insertar un socio sale el error 1452 «Cannot add or update a child row». ¿Qué ha pasado?',
        code: "insert into socio (dni, nombre, id_tarifa)\nvalues ('28765432K', 'Lucía', 99);",
        o: ['No existe ninguna tarifa con id 99', 'El DNI está repetido', 'Falta el id del socio', 'La tabla tarifa está vacía de columnas'],
        c: 0,
        e: '¡La FK funciona! No deja apuntar a un padre que no existe.'
      },
      {
        p: 'Error 1062 «Duplicate entry \'28765432K\' for key \'dni\'». ¿Qué significa?',
        o: ['Ya hay otra fila con ese DNI y la columna es `unique`', 'El DNI tiene más de 9 caracteres', 'Falta el DNI', 'El DNI no existe en otra tabla'],
        c: 0,
        e: 'Una columna `unique` o una clave primaria no admiten valores repetidos.'
      },
      {
        p: 'Ejecutas `create table socio (...)` y sale «No database selected» (1046). ¿Qué falta?',
        o: ['`use gimnasio;` antes de crear las tablas', 'La clave primaria', 'El `drop table if exists`', 'Un punto y coma en la tabla'],
        c: 0,
        e: 'Sin `use`, MariaDB no sabe en qué base de datos crear la tabla.'
      },
      {
        p: '¿Qué sentencia añade la columna `fecha_nac` a una tabla que ya tiene datos?',
        o: ['`alter table socio add column fecha_nac date;`', '`create table socio add fecha_nac date;`', '`update socio add fecha_nac date;`', '`insert into socio column fecha_nac date;`'],
        c: 0,
        e: '`alter table` cambia la estructura sin perder las filas. `update` e `insert` trabajan con datos, no con columnas.'
      },
      {
        p: 'La columna era `telefono varchar(15) not null`. ¿Cómo queda después de esto?',
        code: 'alter table socio modify column telefono varchar(20);',
        o: ['`varchar(20)` y ya admite NULL', '`varchar(20) not null`', 'Sigue igual', 'Se borra la columna'],
        c: 0,
        e: '`modify` reescribe la definición entera: si no repites el `not null`, se pierde.'
      },
      {
        p: '¿Qué necesitas para quitar una clave foránea con `alter table`?',
        code: 'alter table clase drop foreign key ???;',
        o: ['El nombre de la restricción: `fk_clase_monitor`', 'El nombre de la columna: `id_monitor`', 'El nombre de la tabla padre', 'Nada más'],
        c: 0,
        e: 'Otra razón para ponerles nombre con `constraint`. Si no, MariaDB inventa uno y hay que buscarlo.'
      },
      {
        p: '¿Qué pasa al guardar un préstamo del 10/11 con devolución el 05/11?',
        code: 'fecha_prestamo date not null,\nfecha_devolucion date not null,\nconstraint chk_alumno_libro_fechas\ncheck (fecha_prestamo < fecha_devolucion)',
        o: ['Da error: no se cumple el `check` y la fila no se guarda', 'Se guarda y MariaDB cambia las fechas', 'Se guarda con un aviso', 'Se guarda la devolución a NULL'],
        c: 0,
        e: 'Un `check` puede comparar varias columnas de la misma fila. Con nombre, el error dice qué restricción ha fallado.'
      },
      {
        p: '`hotel` tiene una FK a `empleado` (su director) y `empleado` una FK a `hotel`. ¿Cómo se crean?',
        o: ['Se crean las dos tablas y una de las FK se añade al final con `alter table`', 'Es imposible: hay que cambiar el diagrama', 'Se crean las dos a la vez en una sola sentencia', 'Se quitan las dos FK'],
        c: 0,
        e: 'Es una referencia circular: cuando se crea la primera tabla, la otra todavía no existe.'
      },
      {
        p: '¿Qué muestra `describe socio;`?',
        o: ['Sus columnas, tipos, si admiten NULL, claves y valores por defecto', 'Todas sus filas', 'El script con el que se creó', 'Las tablas de la base de datos'],
        c: 0,
        e: 'Para ver la lista de tablas se usa `show tables;`. En DBeaver, la pestaña DDL muestra el `create table` completo.'
      },
      {
        p: 'Verdadero o falso: un buen script se puede ejecutar dos veces seguidas con `Alt + X` sin errores.',
        o: ['Verdadero', 'Falso'],
        c: 0,
        e: 'Por eso empieza con `if not exists` y borra las tablas con `drop table if exists`, de hijas a padres.'
      },
    ]
  },
];
