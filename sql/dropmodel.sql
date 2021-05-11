-- select 'drop table ', table_name, 'cascade constraints;' from user_tables;

drop table 	CHAT	        cascade constraints;
drop table 	ESTADO_USUARIO	cascade constraints;
drop table 	EVENTO	        cascade constraints;
drop table 	MEMBRESIA	    cascade constraints;
drop table 	PREDICCION	    cascade constraints;
drop table 	TEMPORADA	    cascade constraints;
drop table 	USUARIO	        cascade constraints;
drop table 	EQUIPO	        cascade constraints;
drop table 	DETALLE_EQUIPO  cascade constraints;
drop table 	JORNADA	        cascade constraints;
drop table 	MENSAJE	        cascade constraints;
drop table 	DEPORTE         cascade constraints;

COMMIT WORK;