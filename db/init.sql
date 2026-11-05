-- Se ejecuta SOLO la primera vez que se crea el volumen de Postgres.
-- Para volver a ejecutarlo: docker compose down -v && docker compose up -d

CREATE TABLE usuarios (
  id      SERIAL PRIMARY KEY,
  nombre  VARCHAR(50) NOT NULL UNIQUE,
  avatar  VARCHAR(10) NOT NULL
);

CREATE TABLE publicaciones (
  id          SERIAL PRIMARY KEY,
  titulo      VARCHAR(200) NOT NULL,
  comunidad   VARCHAR(50)  NOT NULL,
  usuario_id  INTEGER NOT NULL REFERENCES usuarios(id),
  contenido   TEXT NOT NULL,
  votos       INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE comentarios (
  id              SERIAL PRIMARY KEY,
  publicacion_id  INTEGER NOT NULL REFERENCES publicaciones(id) ON DELETE CASCADE,
  usuario_id      INTEGER NOT NULL REFERENCES usuarios(id),
  contenido       TEXT NOT NULL,
  votos           INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_comentarios_publicacion ON comentarios(publicacion_id);

-- ---------- Datos iniciales (los de publicaciones.js) ----------

INSERT INTO usuarios (id, nombre, avatar) VALUES
  (1, 'Dev', 'Dev'),
  (2, 'Rafa', 'RF'),
  (3, 'Juanpi', 'JP'),
  (4, 'UsuarioAnonimo', 'UA'),
  (5, 'Mati', 'Ma'),
  (6, 'Bauti', 'Ba'),
  (7, 'Max', 'Ma'),
  (8, 'Gamer123', 'Ga'),
  (9, 'CraftMaster', 'CM'),
  (10, 'Steve', 'St'),
  (11, 'Cinefilo', 'Ci'),
  (12, 'NolanFan', 'NF'),
  (13, 'MovieLover', 'ML'),
  (14, 'CodeMaster', 'CM'),
  (15, 'JavaDev', 'JD'),
  (16, 'NovatoC', 'NC'),
  (17, 'Puntero', 'Pu'),
  (18, 'Sistemas', 'Si'),
  (19, 'JavaPrincipiante', 'JP'),
  (20, 'Objeto', 'Ob'),
  (21, 'TuxFan', 'TF'),
  (22, 'ArchUser', 'AU'),
  (23, 'UbuntuFan', 'UF'),
  (24, 'DebianUser', 'DU'),
  (25, 'BugHunter', 'BH'),
  (26, 'Debug', 'De'),
  (27, 'NullPointer', 'NP'),
  (28, 'CoopPlayer', 'CP'),
  (29, 'PlayerTwo', 'PT'),
  (30, 'StudyMode', 'SM'),
  (31, 'LoFi', 'LF'),
  (32, 'Silencio', 'Si'),
  (33, 'FrontendNewbie', 'FN'),
  (34, 'CSSWizard', 'CW'),
  (35, 'IndieLover', 'IL'),
  (36, 'PixelArt', 'PA'),
  (37, 'CelesteFan', 'CF'),
  (38, 'Parcialero', 'Pa'),
  (39, 'MateYApuntes', 'MY'),
  (40, 'Pomodoro', 'Po'),
  (41, 'TypeEnjoyer', 'TE'),
  (42, 'FrontendDev', 'FD'),
  (43, 'JSFan', 'JF'),
  (44, 'SciFiFan', 'SF'),
  (45, 'FrameworkHunter', 'FH'),
  (46, 'ReactDev', 'RD'),
  (47, 'VueFan', 'VF'),
  (48, 'Ejercicios', 'Ej'),
  (49, 'Mateo', 'Ma'),
  (50, 'ProfeHelper', 'PH'),
  (51, 'DeskSetup', 'DS');

INSERT INTO publicaciones (id, titulo, comunidad, usuario_id, contenido, votos, created_at) VALUES
  (1, 'Primer post en Roddit', 'DesarrolloWeb', 1, 'Bienvenidos', 128, now() - interval '2 hours'),
  (2, '¿Qué lenguaje están aprendiendo?', 'Programacion', 5, 'Estoy empezando con JavaScript. ¿Qué consejos tienen para alguien que recién comienza?', 333, now() - interval '3 hours'),
  (3, 'Mi setup para programar', 'Hardware', 6, 'Monitor, teclado mecánico y muchas ganas de programar. ¿Qué usan ustedes?', 87, now() - interval '5 hours'),
  (4, '¿Alguien juega Minecraft?', 'Gaming', 8, 'Estoy buscando gente para jugar un survival. ¿Se suman?', 245, now() - interval '1 days'),
  (5, 'Recomendaciones de películas', 'Cine', 11, '¿Cuál es esa película que siempre recomiendan y nunca se cansan de ver?', 156, now() - interval '2 days'),
  (6, '¿Qué IDE usan para programar?', 'DesarrolloWeb', 14, 'Estoy usando VS Code, pero me gustaría probar otras alternativas. ¿Cuál recomiendan?', 92, now() - interval '6 hours'),
  (7, 'Consejos para aprender C desde cero', 'Programacion', 16, 'Estoy arrancando con C en la facultad. ¿Qué temas debería practicar más?', 184, now() - interval '7 hours'),
  (8, 'Mi primer programa en Java', 'Java', 19, 'Hoy pude hacer mi primer programa usando clases y objetos. ¡Me está gustando mucho!', 76, now() - interval '9 hours'),
  (9, '¿Linux o Windows para programar?', 'Linux', 21, 'Estoy pensando en instalar Linux como sistema principal. ¿Qué distro recomiendan?', 291, now() - interval '10 hours'),
  (10, '¿Cuál fue el bug más raro que encontraron?', 'Programacion', 25, 'Una vez pasé horas buscando un error y al final era un punto y coma. ¿Les pasó algo parecido?', 417, now() - interval '12 hours'),
  (11, 'Recomienden juegos cooperativos', 'Gaming', 28, 'Busco juegos para jugar con amigos. Preferentemente algo que no sea competitivo.', 203, now() - interval '1 days'),
  (12, '¿Qué música escuchan mientras estudian?', 'Estudiantes', 30, 'Necesito una playlist para concentrarme. ¿Escuchan música, ruido blanco o silencio?', 138, now() - interval '1 days'),
  (13, 'Mi primer proyecto con HTML y CSS', 'DesarrolloWeb', 33, 'Terminé mi primera página web. Todavía tiene muchos detalles, pero estoy orgulloso.', 112, now() - interval '1 days'),
  (14, '¿Qué opinan de los videojuegos indie?', 'Gaming', 35, 'Siento que muchos juegos indie tienen más creatividad que los AAA.', 267, now() - interval '2 days'),
  (15, '¿Cómo organizan el estudio para los parciales?', 'Estudiantes', 38, 'Se me juntaron tres parciales. ¿Cómo hacen para organizarse sin morir en el intento?', 356, now() - interval '2 days'),
  (16, '¿Vale la pena aprender TypeScript?', 'JavaScript', 41, 'Ya manejo JavaScript básico. ¿Me conviene pasar a TypeScript?', 198, now() - interval '3 days'),
  (17, '¿Cuál es su película favorita de ciencia ficción?', 'Cine', 44, 'Busco películas que te dejen pensando después de verlas.', 321, now() - interval '3 days'),
  (18, '¿Qué framework de frontend recomiendan?', 'DesarrolloWeb', 45, 'Estoy investigando React, Vue y Angular. ¿Cuál creen que conviene aprender primero?', 174, now() - interval '4 days'),
  (19, '¿Qué hacen cuando no les sale un ejercicio?', 'Estudiantes', 48, 'A veces me trabo con un ejercicio durante horas. ¿Cuándo deciden pedir ayuda?', 229, now() - interval '5 days'),
  (20, 'Compartamos nuestros escritorios', 'Hardware', 51, '¿Cómo tienen armado su espacio de trabajo? ¿Minimalista o lleno de cosas?', 143, now() - interval '6 days');

INSERT INTO comentarios (id, publicacion_id, usuario_id, contenido, votos, created_at) VALUES
  (1, 1, 2, 'Aguante MIPS', 3, now() - interval '8 minutes'),
  (2, 1, 3, 'front end > back end', 18, now() - interval '7 hours'),
  (3, 1, 4, 'papas fritas', 66, now() - interval '1 hours'),
  (4, 2, 6, 'Practicar todos los días ayuda muchísimo.', 21, now() - interval '30 minutes'),
  (5, 2, 6, 'Te recomiendo aprender primero el DOM.', 12, now() - interval '15 minutes'),
  (6, 3, 7, 'Un segundo monitor cambia todo.', 9, now() - interval '1 hours'),
  (7, 4, 9, 'Yo me sumo, ¿Java o Bedrock?', 32, now() - interval '12 hours'),
  (8, 4, 10, 'Java siempre.', 17, now() - interval '10 hours'),
  (9, 4, 6, 'Pasen el servidor.', 6, now() - interval '8 hours'),
  (10, 5, 12, 'Interestelar, sin dudas.', 44, now() - interval '1 days'),
  (11, 5, 13, 'El Señor de los Anillos.', 38, now() - interval '20 hours'),
  (12, 6, 5, 'VS Code con extensiones es una locura.', 24, now() - interval '5 hours'),
  (13, 6, 15, 'IntelliJ para Java, no hay con qué darle.', 31, now() - interval '4 hours'),
  (14, 7, 17, 'Punteros, memoria dinámica y strings. Practicá mucho.', 45, now() - interval '6 hours'),
  (15, 7, 18, 'Y entendé bien cómo funcionan los arrays.', 19, now() - interval '3 hours'),
  (16, 8, 20, 'Bien ahí, ahora metele a herencia y polimorfismo.', 22, now() - interval '8 hours'),
  (17, 9, 22, 'Arch, obviamente.', 63, now() - interval '9 hours'),
  (18, 9, 23, 'Ubuntu es ideal para empezar.', 41, now() - interval '8 hours'),
  (19, 9, 24, 'Debian si querés estabilidad.', 28, now() - interval '7 hours'),
  (20, 10, 26, 'Un espacio al final de una contraseña me arruinó la tarde.', 82, now() - interval '11 hours'),
  (21, 10, 27, 'Un null que aparecía solamente los viernes.', 56, now() - interval '10 hours'),
  (22, 11, 8, 'Deep Rock Galactic es excelente.', 37, now() - interval '20 hours'),
  (23, 11, 29, 'It Takes Two, una experiencia increíble.', 29, now() - interval '18 hours'),
  (24, 12, 31, 'Lo-fi todo el día.', 32, now() - interval '22 hours'),
  (25, 12, 32, 'Silencio absoluto, no puedo con otra cosa.', 18, now() - interval '21 hours'),
  (26, 13, 34, '¡Buenísimo! Ahora probá hacerla responsive.', 27, now() - interval '20 hours'),
  (27, 14, 36, 'Hollow Knight es una obra maestra.', 59, now() - interval '1 days'),
  (28, 14, 37, 'Celeste también merece una mención.', 42, now() - interval '1 days'),
  (29, 15, 39, 'Dividí los temas por día y practicá ejercicios.', 71, now() - interval '1 days'),
  (30, 15, 40, 'La técnica Pomodoro me sirve bastante.', 34, now() - interval '1 days'),
  (31, 16, 42, 'Sí, sobre todo cuando trabajás en proyectos grandes.', 46, now() - interval '2 days'),
  (32, 16, 43, 'Primero dominá bien JS y después metele.', 25, now() - interval '2 days'),
  (33, 17, 12, 'Arrival, sin dudas.', 62, now() - interval '2 days'),
  (34, 17, 13, 'Blade Runner 2049.', 48, now() - interval '2 days'),
  (35, 18, 46, 'React tiene un ecosistema enorme.', 38, now() - interval '3 days'),
  (36, 18, 47, 'Vue es bastante amigable para empezar.', 24, now() - interval '3 days'),
  (37, 19, 49, 'Intento dividirlo en problemas más chicos.', 52, now() - interval '4 days'),
  (38, 19, 50, 'Explicar qué intentaste suele ayudar muchísimo.', 33, now() - interval '4 days'),
  (39, 20, 6, 'Dos monitores y un buen mouse.', 29, now() - interval '5 days'),
  (40, 20, 7, 'El mate al lado del teclado es obligatorio.', 51, now() - interval '5 days');

-- Como insertamos ids a mano, hay que avanzar las secuencias
-- para que el proximo INSERT (POST de la API) no choque con un id existente.
SELECT setval('usuarios_id_seq',       (SELECT MAX(id) FROM usuarios));
SELECT setval('publicaciones_id_seq',  (SELECT MAX(id) FROM publicaciones));
SELECT setval('comentarios_id_seq',    (SELECT MAX(id) FROM comentarios));
