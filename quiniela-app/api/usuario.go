package main

import (
	"database/sql"
	"fmt"
)

type usuario struct {
	Id               int    `json:"id"`
	Username         string `json:"username"`
	Correo           string `json:"correo"`
	Nombre           string `json:"nombre"`
	Apellido         string `json:"apellido"`
	Contraseña       string `json:"contraseña"`
	Saldo            string `json:"saldo"`
	Fecha_nacimiento string `json:"fecha_nacimiento"`
	Fecha_registro   string `json:"fecha_registro"`
	Foto             string `json:"foto"`
}

func getAllUsers(db *sql.DB, offset, limit int) ([]usuario, error) {
	rows, err := db.Query(
		"SELECT username, correo, nombre, apellido, contraseña, saldo, fecha_nacimiento, fecha_registro FROM usuario")
	if err != nil {
		return nil, err
	}

	defer rows.Close()
	usuarios := []usuario{}

	for rows.Next() {
		var u usuario
		if err := rows.Scan(&u.Username, &u.Correo, &u.Nombre, &u.Apellido, &u.Contraseña, &u.Saldo, &u.Fecha_nacimiento, &u.Fecha_registro); err != nil {
			return nil, err
		}
		usuarios = append(usuarios, u)
	}

	return usuarios, nil
}

func (u *usuario) getUser(db *sql.DB) error {
	query := fmt.Sprintf(`select correo, nombre, apellido, fecha_nacimiento, fecha_registro, saldo from usuario where username='%s'`, u.Username)
	err := db.QueryRow(query).Scan(&u.Correo, &u.Nombre, &u.Apellido, &u.Fecha_nacimiento, &u.Fecha_registro, &u.Saldo)
	return err
}

func (u *usuario) createUser(db *sql.DB) error {
	query := fmt.Sprintf(`INSERT INTO usuario VALUES(null, '%s', '%s', '%s', '%s', '%s', 0, TO_DATE('%s', 'dd/mm/yyyy'), TO_DATE('%s','dd/mm/yyyy'), utl_raw.cast_to_raw('%v'))`, u.Username, u.Correo, u.Nombre, u.Apellido, u.Contraseña, u.Fecha_nacimiento, u.Fecha_registro, u.Foto)
	err := db.QueryRow(query).Scan()
	return err
}

func (u *usuario) loginUser(db *sql.DB) error {
	query := fmt.Sprintf(`SELECT id FROM usuario WHERE username='%s' AND contraseña='%s'`, u.Username, u.Contraseña)

	//query := fmt.Sprintf(`call login('%s', '%s')`, u.Username, u.Contraseña)

	return db.QueryRow(query).Scan(&u.Id)
}

func (u *usuario) recoverUser(db *sql.DB) error {
	query := fmt.Sprintf(`SELECT contraseña FROM usuario WHERE correo='%s'`, u.Correo)
	return db.QueryRow(query).Scan(&u.Contraseña)
}

func (u *usuario) updateUser(db *sql.DB) error {
	query := `UPDATE usuario SET `
	if u.Correo != "" {
		query = fmt.Sprintf(query+` correo='%s',`, u.Correo)
	}
	if u.Nombre != "" {
		query = fmt.Sprintf(query+` nombre='%s',`, u.Nombre)
	}
	if u.Apellido != "" {
		query = fmt.Sprintf(query+` apellido='%s',`, u.Apellido)
	}
	//if u.Foto != "" {
	//	query = fmt.Sprintf(query+` foto='%s',`, u.Foto)
	//}

	query = query[:len(query)-1]

	query = fmt.Sprintf(query+` WHERE username='%s',`, u.Username)

	err := db.QueryRow(query).Scan()
	return err
}

func (u *usuario) deleteUser(db *sql.DB) error {
	query := fmt.Sprintf(`DELETE FROM Usuario WHERE username='%s'`, u.Username)
	err := db.QueryRow(query).Scan()
	return err
}
