package main

import (
	"database/sql"
)

type season struct {
	Id         string     `json:"id"`
	Nombre     string     `json:"nombre"`
	Posiciones []position `json:"posiciones"`
}

type position struct {
	Id             string `json:"id"`
	Username       string `json:"username"`
	Puntos_totales string `json:"puntos_totales"`
}

func getActualSeason(db *sql.DB) (season, error) {
	var s season
	rows, err := db.Query(
		"SELECT id FROM temporada WHERE estado='activo'")
	if err != nil {
		return s, err
	}

	defer rows.Close()
	ps := []position{}

	for rows.Next() {
		var p position
		if err := rows.Scan(&p.Id, &p.Username, &p.Puntos_totales); err != nil {
			return s, err
		}
		ps = append(ps, p)
	}

	s.Posiciones = ps

	return s, nil
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
