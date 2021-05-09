-- select 'drop trigger ' || trigger_name || ';' stmt from user_triggers;

CREATE
OR REPLACE TRIGGER validar_registro_usuario BEFORE
INSERT
  OR
UPDATE
  ON usuario
  FOR EACH ROW
  DECLARE
  age NUMBER := -1;
  BEGIN
   
   
:new.fecha_registro := SYSDATE;
:new.fecha_nacimiento := TO_DATE(:new.fecha_nacimiento, 'DD/MM/YYYY');
   
age := (:new.fecha_registro - :new.fecha_nacimiento)/365;
:new.saldo := age;

IF NOT REGEXP_LIKE(:new.correo, '[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}', 'i') THEN raise_application_error(-20001, 'Formato del correo no válido');

ELSIF age < 18 THEN raise_application_error(-20003, 'El usuario es menor de edad');

END IF;

END;

