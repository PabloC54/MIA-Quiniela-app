LOAD DATA INFILE 'res.csv'
TRUNCATE
INTO TABLE massive
FIELDS TERMINATED BY ","
(id, nombre, apellido, password, username, temporada, tier, jornada, deporte, fecha DATE "DD/MM/YYYY HH24:MI", visitante, local, prediccion_visitante, prediccion_local, resultado_visitante, resultado_local)
