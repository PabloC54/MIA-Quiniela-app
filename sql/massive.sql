
DROP TABLE massive;

CREATE TABLE massive (
  id  VARCHAR(5),
  nombre VARCHAR(30),
  apellido VARCHAR(30),
  password VARCHAR(30),
  username VARCHAR(50),
  temporada VARCHAR(15),
  tier VARCHAR(15),
  jornada VARCHAR(15),
  deporte VARCHAR(30),
  fecha DATE,
  visitante VARCHAR(30),
  local VARCHAR(30),
  prediccion_visitante NUMBER,
  prediccion_local NUMBER,
  resultado_visitante NUMBER,
  resultado_local NUMBER
);

-- Carga hacia el modelo

INSERT INTO usuario(nombre, apellido, contraseña, username, id, correo, fecha_nacimiento, fecha_registro, foto )
SELECT DISTINCT nombre, apellido, password, username, null, username, to_date('04/04/1994','dd/mm/yyyy'),
to_date('04/04/2021','dd/mm/yyyy'), utl_raw.cast_to_raw('') FROM massive;

-- Deporte

INSERT INTO deporte(nombre, id, color, imagen)
SELECT DISTINCT deporte, null, '#010101', utl_raw.cast_to_raw('')  FROM massive;

-- Equipo

INSERT INTO equipo(nombre, id)
SELECT DISTINCT m.visitante, null FROM massive m
LEFT JOIN
(SELECT DISTINCT local FROM massive) s
ON m.visitante = s.local;

INSERT INTO equipo(nombre, id)
SELECT DISTINCT m.local, null FROM massive m
LEFT OUTER JOIN
(SELECT DISTINCT visitante, null FROM massive) s
ON m.local = s.visitante
WHERE s.visitante IS null;

-- Detalle_equipo

INSERT INTO detalle_equipo(id_equipo, id_deporte)
SELECT DISTINCT e.id, d.id FROM massive m
INNER JOIN equipo e ON e.nombre = local OR e.nombre = visitante
INNER JOIN deporte d ON d.nombre = deporte;

-- Temporada

INSERT INTO temporada(nombre, id, fecha_inicio, fecha_final, estado)
SELECT DISTINCT m.temporada, null, s.fecha_inicio, s.fecha_final, 'finalizado' FROM massive m
INNER JOIN (SELECT temporada, min(fecha) fecha_inicio, max(fecha) fecha_final FROM massive
GROUP BY temporada) s ON s.temporada = m.temporada;

-- Jornada

INSERT INTO jornada(nombre, id, id_temporada, fecha_inicio, fecha_final, estado)
SELECT DISTINCT m.jornada, null, t.id, s.fecha_inicio, s.fecha_final, 'finalizado' FROM massive m
INNER JOIN temporada t ON t.nombre = m.temporada
INNER JOIN (SELECT DISTINCT temporada, jornada, min(fecha) fecha_inicio, max(fecha) fecha_final FROM massive
GROUP BY temporada, jornada) s ON s.temporada = t.nombre AND s.jornada = m.jornada;

-- Evento

INSERT INTO evento(puntuacion_local, puntuacion_visitante, fecha, id, id_jornada, id_equipo_local, id_equipo_visitante, estado)
SELECT DISTINCT resultado_local, resultado_visitante, fecha, null, j.id, el.id, ev.id, 'finalizado' FROM massive m
INNER JOIN temporada t ON t.nombre = m.temporada
INNER JOIN jornada j ON j.nombre = m.jornada AND j.id_temporada = t.id
INNER JOIN equipo el ON el.nombre = m.local
INNER JOIN equipo ev ON ev.nombre = m.visitante;

-- Prediccion

INSERT INTO prediccion(puntuacion_local, puntuacion_visitante, id_evento, id_usuario, resultado)
SELECT DISTINCT prediccion_local, prediccion_visitante, e.id, u.id, 0 FROM massive m
INNER JOIN evento e ON e.fecha = m.fecha
INNER JOIN usuario u ON u.username = m.username;

-- Estado usuario

INSERT INTO estado_usuario(id_usuario, id_membresia, id_temporada, id_siguiente, puntos_ultimos, p10, p5, p3, p0, incremento)
SELECT DISTINCT u.id, mb.id, t.id, mb.id, 0, 0, 0, 0, 0, 0 FROM massive m
INNER JOIN usuario u ON u.username = m.username
INNER JOIN membresia mb ON mb.nombre = m.tier
INNER JOIN temporada t ON t.nombre = m.temporada;

COMMIT WORK;
