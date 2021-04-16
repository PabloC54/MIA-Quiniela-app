create table EMPLOYEES (
  empno number,
  name varchar2(50) not null,
  job varchar2(50),
  manager number,
  hiredate date,
  salary number(7, 2),
  commission number(7, 2),
  deptno umber,
  constraint pk_employees primary key (empno),
  constraint fk_employees_deptno foreign key (deptno) references DEPARTMENTS (deptno)
);
