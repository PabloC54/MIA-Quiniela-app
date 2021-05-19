package main

import (
	"database/sql"
	"fmt"
	"strconv"
)

type season struct {
	Id         string     `json:"id"`
	Nombre     string     `json:"nombre"`
	Posiciones []position `json:"posiciones"`
}

type position struct {
	Posicion   string `json:"posicion"`
	Username   string `json:"username"`
	Nombre     string `json:"nombre"`
	Apellido   string `json:"apellido"`
	Tier       string `json:"tier"`
	P10        string `json:"p10"`
	P5         string `json:"p5"`
	P3         string `json:"p3"`
	P0         string `json:"p0"`
	Incremento string `json:"incremento"`
}

func (s *season) getActualSeason(db *sql.DB) error {
	query := "SELECT id, nombre FROM temporada WHERE estado='activo'"
	if err := db.QueryRow(query).Scan(&s.Id, &s.Nombre); err != nil {
		return err
	}
	num, _ := strconv.Atoi(s.Id)
	past_season_id := strconv.Itoa(num - 1)

	var past_season_exists string
	query = fmt.Sprintf("SELECT id, nombre FROM temporada WHERE id=%s", past_season_id)
	_ = db.QueryRow(query).Scan(past_season_exists)

	query = fmt.Sprintf("SELECT ROW_NUMBER() OVER(ORDER BY (10 * cast(p10 as number) + 5 * cast(p5 as number) + 3 * cast(p3 as number))) posicion, id_usuario, id_membresia, p10, p5, p3, p0 FROM estado_usuario WHERE id_temporada=%s", s.Id)
	rows, err := db.Query(query)
	if err != nil {
		return err
	}

	defer rows.Close()
	ps := []position{}

	for rows.Next() {
		var id_usuario, id_membresia string
		var p position
		if err := rows.Scan(&p.Posicion, &id_usuario, &id_membresia, &p.P10, &p.P5, &p.P3, &p.P0); err != nil {
			return err
		}

		subquery := fmt.Sprintf("SELECT username, nombre, apellido FROM usuario WHERE id=%s", id_usuario)
		if err := db.QueryRow(subquery).Scan(&p.Username, &p.Nombre, &p.Apellido); err != nil {
			return err
		}

		subquery = fmt.Sprintf("SELECT nombre FROM membresia WHERE id=%s", id_membresia)
		if err := db.QueryRow(subquery).Scan(&p.Tier); err != nil {
			return err
		}

		if past_season_exists != "" {
			var past_season_position string
			subquery = fmt.Sprintf("SELECT posicion FROM (SELECT ROW_NUMBER() OVER(ORDER BY (10 * cast(p10 as number) + 5 * cast(p5 as number) + 3 * cast(p3 as number))) posicion, id_usuario FROM estado_usuario WHERE id_temporada=%s) WHERE id_usuario=%s", past_season_id, id_usuario)
			if err := db.QueryRow(subquery).Scan(&past_season_position); err != nil {
				return err
			}
			num1, _ := strconv.Atoi(p.Posicion)
			num2, _ := strconv.Atoi(past_season_position)
			p.Incremento = strconv.Itoa(num2 - num1)
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
