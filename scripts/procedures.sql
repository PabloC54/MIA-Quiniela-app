/*CREATE
 OR REPLACE FUNCTION registrar_usuario(
 username VARCHAR2,
 correo VARCHAR2,
 nombre VARCHAR2,
 apellido VARCHAR2,
 contraseña VARCHAR2,
 fecha_nacimiento DATE,
 fecha_registro DATE,
 foto BLOB
 )
 
 RETURN VARCHAR2 IS RES VARCHAR2;
 BEGIN
 INSERT INTO
 Usuario
 VALUES
 (
 username,
 correo,
 nombre,
 apellido,
 contraseña,
 0,
 TO_DATE(fecha_nacimiento, 'yyyy/mm/dd'),
 TO_DATE(fecha_registro, 'yyyy/mm/dd'),
 foto
 );
 
 EXCEPTION
 
 END;*/
