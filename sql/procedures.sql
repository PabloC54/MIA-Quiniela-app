-- NUEVA PREDICCION

CREATE OR REPLACE PROCEDURE new_prediction(
  id_evento IN NUMBER,
  username IN VARCHAR2,
  puntuacion_local IN NUMBER,
  puntuacion_visitante IN NUMBER
)
IS
    id_usuario NUMBER;
BEGIN

    SELECT u.id INTO id_usuario FROM usuario u WHERE u.username = username;

    INSERT INTO prediccion VALUES(id_evento, id_usuario, puntuacion_local, puntuacion_visitante, 0);
    
END;

-- PAGO DE MEMBRESIA

CREATE OR REPLACE PROCEDURE pay_membership(username VARCHAR2, tier VARCHAR2)
IS
id_usuario NUMBER;
id_temporada NUMBER;
id_membresia NUMBER;
BEGIN
    SELECT u.id INTO id_usuario FROM usuario u WHERE u.username = username;
    
    SELECT m.id INTO id_membresia FROM membresia m WHERE m.nombre = tier;
    
    SELECT t.id INTO id_temporada FROM temporada t WHERE t.estado = 'activo';

    UPDATE estado_usuario e SET e.id_siguiente = id_membresia WHERE e.id_usuario = id_usuario AND e.id_temporada = id_temporada;
END;

-- INICIO DE SESION

CREATE OR REPLACE FUNCTION login(username IN VARCHAR2, contraseña IN VARCHAR2) RETURN NUMBER
IS user_id NUMBER;
BEGIN 

  SELECT COUNT(*) INTO user_id FROM usuario u WHERE u.username = username AND u.contraseña = contraseña;

  RETURN user_id;

END;

-- NUEVA TEMPORADA

create or replace PROCEDURE new_season
IS
año VARCHAR2(10) := trunc(sysdate, 'YEAR');
membership_id NUMBER;

num_seasons NUMBER;
actual_season NUMBER;
season_active BOOLEAN;
season_id NUMBER;
previous_season_id NUMBER := 0;

actual_period NUMBER;
period_active BOOLEAN;
 BEGIN

 SELECT COUNT(*) INTO actual_period FROM jornada WHERE estado = 'activo';

 period_active := actual_period > 0;

 IF period_active THEN
  UPDATE jornada SET estado = 'finalizado' WHERE estado = 'activo';
 END IF;

 SELECT COUNT(*) INTO actual_season FROM temporada WHERE estado = 'activo';

 season_active := actual_season > 0;

 IF season_active THEN
  UPDATE temporada SET estado = 'finalizado' WHERE estado = 'activo' RETURNING id INTO previous_season_id;
 END IF;

 SELECT COUNT(*) INTO num_seasons FROM temporada WHERE trunc(fecha_inicio, 'YYYY') = año;

 INSERT INTO temporada(nombre, fecha_inicio, fecha_final, estado)
 VALUES(TO_CHAR(año)||'-Q'||TO_CHAR(num_seasons + 1), SYSDATE, SYSDATE + 30, 'activo') RETURNING id INTO season_id;

 FOR u IN (SELECT * FROM usuario) LOOP

  IF previous_season_id > 0 THEN
    SELECT id_siguiente INTO membership_id FROM estado_usuario WHERE id_usuario = u.id AND id_temporada = previous_season_id;
  ELSE
    membership_id := 1;
  END IF;

  IF u.username != 'admin' THEN  
    INSERT INTO estado_usuario VALUES(null, u.id, membership_id, membership_id, season_id, 0, 0, 0, 0, 0, 0);
  END IF;

 END LOOP;

 new_period();

END;

-- NUEVA JORNADA

create or replace PROCEDURE new_period
IS
num_periods NUMBER;
actual_period NUMBER;
period_active BOOLEAN;
season_id NUMBER;
season_ending_date DATE;
period_ending_date DATE := SYSDATE;
 BEGIN

 SELECT id, fecha_final INTO season_id, season_ending_date FROM temporada WHERE estado = 'activo';

 SELECT COUNT(*) INTO num_periods FROM jornada WHERE id_temporada = season_id;

 SELECT COUNT(*) INTO actual_period FROM jornada WHERE estado = 'activo';

 period_active := actual_period > 0;

 IF period_active THEN
  UPDATE jornada SET estado = 'finalizado' WHERE estado = 'activo';
 END IF;

 IF SYSDATE + 7 > season_ending_date THEN
  period_ending_date := season_ending_date;
 END IF;

 INSERT INTO jornada VALUES(null, season_id, 'J'||TO_CHAR(num_periods + 1), SYSDATE, SYSDATE + 7, 'activo');

END;