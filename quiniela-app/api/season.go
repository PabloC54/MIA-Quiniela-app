package main

import (
	"database/sql"
	"fmt"
)

type season struct {
	Id         string     `json:"id"`
	Nombre     string     `json:"nombre"`
	Posiciones []position `json:"posiciones"`
}

type position struct {
	Username       string `json:"username"`
	Puntos_ultimos string `json:"puntos_ultimos"`
	P10            string `json:"p10"`
	P5             string `json:"p5"`
	P3             string `json:"p3"`
	P0             string `json:"p0"`
	Incremento     string `json:"incremento"`
}

func (s *season) getActualSeason(db *sql.DB) error {
	query := "SELECT id, nombre FROM temporada WHERE estado='activo'"
	if err := db.QueryRow(query).Scan(&s.Id, &s.Nombre); err != nil {
		return err
	}

	query = fmt.Sprintf("SELECT id_usuario, puntos_ultimos, p10, p5, p3, p0, incremento FROM estado_usuario WHERE id_temporada=%s", s.Id)
	rows, err := db.Query(query)
	if err != nil {
		return err
	}

	defer rows.Close()
	ps := []position{}

	for rows.Next() {
		var id_usuario string
		var p position
		if err := rows.Scan(&id_usuario, &p.Puntos_ultimos, &p.P10, &p.P5, &p.P3, &p.P0, &p.Incremento); err != nil {
			return err
		}

		subquery := fmt.Sprintf("SELECT username FROM usuario WHERE id=%s", id_usuario)
		if err := db.QueryRow(subquery).Scan(&p.Username); err != nil {
			return err
		}

		ps = append(ps, p)
	}

	s.Posiciones = ps

	return nil
}

//func (d *deporte) getUser(db *sql.DB) error {
//	query := fmt.Sprintf(`select correo, nombre, apellido, fecha_nacimiento, fecha_registro, foto, saldo from deporte where username='%s'`, d.Username)
//	err := db.QueryRow(query).Scan(&d.Correo, &d.Nombre, &d.Apellido, &d.Fecha_nacimiento, &d.Fecha_registro, &d.Foto, &d.Saldo)
//	return err
//}

//func (d *deporte) createSport(db *sql.DB) error {
//	query := fmt.Sprintf(`INSERT INTO deporte VALUES(null, '%s', '%s', '%s')`, d.Nombre, d.Color, d.Imagen)
//	err := db.QueryRow(query).Scan()
//	return err
//}

//func (d *deporte) updateSport(db *sql.DB) error {
//	query := `UPDATE deporte SET `
//	if d.Nombre != "" {
//		query = fmt.Sprintf(query+` nombre='%s',`, d.Nombre)
//	}
//	if d.Color != "" {
//		query = fmt.Sprintf(query+` color='%s',`, d.Color)
//	}
//	if d.Imagen != "" {
//		query = fmt.Sprintf(query+` imagen='%s',`, d.Imagen)
//	}
//	query = query[:len(query)-1]

//	query = fmt.Sprintf(query+` WHERE id=%s`, d.Id)

//	err := db.QueryRow(query).Scan()
//	return err
//}

//func (d *deporte) deleteSport(db *sql.DB) error {
//	query := fmt.Sprintf(`DELETE FROM deporte WHERE id=%s`, d.Id)
//	err := db.QueryRow(query).Scan()
//	return err
//}
