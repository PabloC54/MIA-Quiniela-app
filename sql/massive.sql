
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

INSERT INTO usuario(nombre, apellido, contraseña, username, id, correo, fecha_nacimiento, fecha_registro, saldo, foto )
SELECT DISTINCT nombre, apellido, password, username, null, username, to_date('04/04/1994','dd/mm/yyyy'),
to_date('04/04/2021','dd/mm/yyyy'), 0, utl_raw.cast_to_raw('') FROM massive;

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

INSERT INTO evento(puntuacion_local, puntuacion_visitante, fecha, id, id_jornada, id_equipo_local, id_equipo_visitante, id_deporte, estado)
SELECT DISTINCT resultado_local, resultado_visitante, fecha, null, j.id, el.id, ev.id, d.id, 'activo' FROM massive m
INNER JOIN temporada t ON t.nombre = m.temporada
INNER JOIN jornada j ON j.nombre = m.jornada AND j.id_temporada = t.id
INNER JOIN equipo el ON el.nombre = m.local
INNER JOIN equipo ev ON ev.nombre = m.visitante
INNER JOIN deporte d ON d.nombre = m.deporte;

-- Prediccion

INSERT INTO prediccion(puntuacion_local, puntuacion_visitante, id_evento, id_usuario, resultado)
SELECT DISTINCT prediccion_local, prediccion_visitante, e.id, u.id, 0 FROM massive m
INNER JOIN evento e ON e.fecha = m.fecha
INNER JOIN usuario u ON u.username = m.username;

-- activar trigger y rellenar predicciones

UPDATE evento e SET estado='finalizado';

-- Estado usuario

INSERT INTO estado_usuario(id_usuario, id_membresia, id_temporada, id_siguiente, puntos_ultimos, p10, p5, p3, p0, incremento)
SELECT DISTINCT u.id, mb.id, t.id, mb.id, 0, 0, 0, 0, 0, 0 FROM massive m
INNER JOIN usuario u ON u.username = m.username
INNER JOIN membresia mb ON mb.nombre = m.tier
INNER JOIN temporada t ON t.nombre = m.temporada;

-- rellenar estado_usuario
DECLARE
  num_state NUMBER;
  no_membership_id NUMBER;
BEGIN
    for e in (SELECT * FROM
    (SELECT DISTINCT COUNT(*) cuenta, MIN(e.id) id, e.id_usuario, e.id_temporada FROM estado_usuario e
    GROUP BY e.id_usuario, e.id_temporada)
    WHERE cuenta > 1) LOOP
        DELETE FROM estado_usuario WHERE id = e.id;
    END LOOP;

    SELECT id INTO no_membership_id FROM membresia WHERE nombre='ninguna';

    for u in (SELECT * FROM usuario) LOOP
    
        for t in (SELECT * FROM temporada) LOOP
        
            SELECT COUNT(*) INTO num_state FROM estado_usuario WHERE id_usuario=u.id AND id_temporada=t.id;
            
            IF num_state = 0 THEN
                INSERT INTO estado_usuario VALUES(null, u.id, no_membership_id, no_membership_id, t.id, 0, 0, 0, 0, 0, 0);
            END IF;
            
        END LOOP;
    
    END LOOP;

END;

-- calculando resultados para estado_usuario
DECLARE
  p10_t NUMBER;
  p5_t NUMBER;
  p3_t NUMBER;
  p0_t NUMBER;

  p10_j NUMBER;
  p5_j NUMBER;
  p3_j NUMBER;
  p0_j NUMBER;

  p10_e NUMBER;
  p5_e NUMBER;
  p3_e NUMBER;
  p0_e NUMBER;

  num_predictions NUMBER;
  res NUMBER;
BEGIN

  for u in (SELECT * FROM usuario) LOOP

    for t in (SELECT * FROM temporada) LOOP
    
      p10_t := 0;
      p5_t := 0;
      p3_t := 0;
      p0_t := 0;

      for j in (SELECT * FROM jornada WHERE id_temporada=t.id) LOOP

        p10_j := 0;
        p5_j := 0;
        p3_j := 0;
        p0_j := 0;

        for e in (SELECT * FROM evento WHERE id_jornada=j.id) LOOP

          p10_e := 0;
          p5_e := 0;
          p3_e := 0;
          p0_e := 0;


          SELECT count(*) INTO num_predictions FROM prediccion p WHERE p.id_evento=e.id AND p.id_usuario=u.id;

          IF num_predictions = 1 THEN
          
              SELECT p.resultado INTO res FROM prediccion p WHERE p.id_evento=e.id AND p.id_usuario=u.id;
            
              IF res = 10 THEN
                p10_e := 1;
              ELSIF res = 5 THEN
                p5_e := 1;
              ELSIF res = 3 THEN
                p3_e := 1;
              ELSE
                p0_e := 1;
              END IF;
                            
          END IF;

          p10_j := p10_j + p10_e;
          p5_j := p5_j + p5_e;
          p3_j := p3_j + p3_e;
          p0_j := p0_j + p0_e;

        END LOOP;

        p10_t := p10_t + p10_j;
        p5_t := p5_t + p5_j;
        p3_t := p3_t + p3_j;
        p0_t := p0_t + p0_j;

      END LOOP;

      UPDATE estado_usuario eu SET eu.p10=p10_t, eu.p5=p5_t, eu.p3=p3_t, eu.p0=p0_t WHERE eu.id_usuario = u.id AND eu.id_temporada = t.id;

    END LOOP;

  END LOOP;
  
END;

COMMIT WORK;
