
CREATE
OR REPLACE TRIGGER validar_registro_usuario BEFORE
INSERT
  OR
UPDATE
  ON usuario FOR EACH ROW DECLARE age NUMBER := -1;

BEGIN age := (:new.fecha_registro - :new.fecha_nacimiento) / 365;

IF NOT REGEXP_LIKE(
  :new.correo,
  '[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}',
  'i'
) THEN raise_application_error(-20001, 'Formato del correo no válido');

ELSIF age < 18 THEN raise_application_error(-20003, 'El usuario es menor de edad');

END IF;

END;

CREATE
OR REPLACE TRIGGER validar_evento BEFORE
INSERT
  OR
UPDATE
  ON evento FOR EACH ROW
DECLARE 
period_ending_date DATE;
BEGIN

IF INSERTING THEN

  SELECT fecha_final INTO period_ending_date FROM jornada WHERE estado = 'activo';

  IF :new.fecha < SYSDATE THEN raise_application_error(-20001, 'Fecha no válida (pasada)');

  ELSIF :new.fecha > period_ending_date THEN raise_application_error(-20003, 'Fecha no válida (jornada terminada para entonces)');

  END IF;

ELSE 
  IF :old.estado = 'actualizado' THEN raise_application_error(-20003, 'El evento ya fue actualizado');
  END IF;

  IF :old.estado = 'finalizado' THEN
    :new.estado := 'actualizado';
  END IF;

END IF;

END;

CREATE OR REPLACE TRIGGER resultado_evento AFTER UPDATE
  ON evento FOR EACH ROW
DECLARE 
res   NUMBER;
BEGIN

  FOR p IN (SELECT * FROM prediccion WHERE id_evento = :new.id) LOOP
    res := 0;

    IF :new.puntuacion_local = p.puntuacion_local AND :new.puntuacion_visitante = p.puntuacion_visitante THEN

      res := 10;

    ELSIF (:new.puntuacion_local > :new.puntuacion_visitante AND p.puntuacion_local > p.puntuacion_visitante) THEN
    
      IF ABS(:new.puntuacion_local - p.puntuacion_local) <= 2 THEN
        res := 5;

      ELSE
        res := 3;

      END IF;

    ELSIF (:new.puntuacion_local < :new.puntuacion_visitante AND p.puntuacion_local < p.puntuacion_visitante) THEN

      IF ABS(:new.puntuacion_visitante - p.puntuacion_visitante) <= 2 THEN
        res := 5;

      ELSE
        res := 3;

      END IF;

    END IF;

    UPDATE prediccion pr SET resultado = res WHERE pr.id_usuario = p.id_usuario AND pr.id_evento = p.id_evento;

  END LOOP;

END;
