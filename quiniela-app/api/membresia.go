package main

import (
	"database/sql"
	"fmt"
)

type membresia struct {
	Id        int    `json:"id"`
	Username  string `json:"username"`
	Nombre    string `json:"nombre"`
	Precio    string `json:"precio"`
	Alfa      string `json:"alfa"`
	Siguiente string `json:"siguiente"`
}

//func getAllUsers(db *sql.DB, offset, limit int) ([]membresia, error) {
//	rows, err := db.Query(
//		"SELECT username, correo, nombre, apellido, contraseña, saldo, fecha_nacimiento, fecha_registro, foto FROM membresia")
//	if err != nil {
//		return nil, err
//	}

//	defer rows.Close()
//	usuarios := []membresia{}

//	for rows.Next() {
//		var u membresia
//		if err := rows.Scan(&u.Username, &u.Correo, &u.Nombre, &u.Apellido, &u.Contraseña, &u.Saldo, &u.Fecha_nacimiento, &u.Fecha_registro, &u.Foto); err != nil {
//			return nil, err
//		}
//		usuarios = append(usuarios, u)
//	}

//	return usuarios, nil
//}

func (m *membresia) getMembership(db *sql.DB) error {
	query := fmt.Sprintf(`SELECT id FROM usuario WHERE username='%s'`, m.Username)
	var id_usuario string
	if err := db.QueryRow(query).Scan(&id_usuario); err != nil {
		return err
	}

	query = `SELECT id FROM temporada WHERE estado='activo'`
	var id_temporada string
	if err := db.QueryRow(query).Scan(&id_temporada); err != nil {
		return err
	}

	var id_membresia, id_siguiente string
	query = fmt.Sprintf(`SELECT id_membresia, id_siguiente FROM estado_usuario WHERE id_usuario=%s AND id_temporada=%s`, id_usuario, id_temporada)
	if err := db.QueryRow(query).Scan(&id_membresia, &id_siguiente); err != nil {
		return err
	}

	query = fmt.Sprintf(`SELECT nombre FROM membresia WHERE id=%s`, id_membresia)
	err := db.QueryRow(query).Scan(&m.Nombre)

	query = fmt.Sprintf(`SELECT nombre FROM membresia WHERE id=%s`, id_siguiente)
	err = db.QueryRow(query).Scan(&m.Siguiente)

	return err
}

func (m *membresia) setMembership(db *sql.DB) error {
	query := fmt.Sprintf(`SELECT id FROM membresia WHERE nombre='%s'`, m.Siguiente)
	var id_siguiente string
	if err := db.QueryRow(query).Scan(&id_siguiente); err != nil {
		return err
	}

	query = fmt.Sprintf(`SELECT id FROM usuario WHERE username='%s'`, m.Username)
	var id_usuario string
	if err := db.QueryRow(query).Scan(&id_usuario); err != nil {
		return err
	}

	query = `SELECT id FROM temporada WHERE estado='activo'`
	var id_temporada string
	if err := db.QueryRow(query).Scan(&id_temporada); err != nil {
		return err
	}

	query = fmt.Sprintf(`UPDATE estado_usuario SET id_siguiente=%s WHERE id_usuario=%s AND id_temporada=%s`, id_siguiente, id_usuario, id_temporada)
	err := db.QueryRow(query).Scan()
	return err
}
