package main

import (
	"database/sql"
	"fmt"
)

type deporte struct {
	Id     string `json:"id"`
	Nombre string `json:"nombre"`
	Color  string `json:"color"`
	Imagen string `json:"imagen"`
}

func getAllSports(db *sql.DB) ([]deporte, error) {
	rows, err := db.Query(
		"SELECT id, nombre, color FROM deporte")
	if err != nil {
		return nil, err
	}

	defer rows.Close()
	deportes := []deporte{}

	for rows.Next() {
		var d deporte
		if err := rows.Scan(&d.Id, &d.Nombre, &d.Color); err != nil {
			return nil, err
		}
		deportes = append(deportes, d)
	}

	return deportes, nil
}

func (d *deporte) createSport(db *sql.DB) error {
	query := fmt.Sprintf(`INSERT INTO deporte VALUES(null, '%s', '%s', utl_raw.cast_to_raw('%s'))`, d.Nombre, d.Color, d.Imagen)
	err := db.QueryRow(query).Scan()
	return err
}

func (d *deporte) updateSport(db *sql.DB) error {
	query := `UPDATE deporte SET`
	if d.Nombre != "" {
		query = fmt.Sprintf(query+` nombre='%s',`, d.Nombre)
	}
	if d.Color != "" {
		query = fmt.Sprintf(query+` color='%s',`, d.Color)
	}
	if d.Imagen != "" {
		query = fmt.Sprintf(query+` imagen='%s',`, d.Imagen)
	}
	query = query[:len(query)-1]

	query = fmt.Sprintf(query+`WHERE id=%s`, d.Id)

	err := db.QueryRow(query).Scan()
	return err
}

func (d *deporte) deleteSport(db *sql.DB) error {
	query := fmt.Sprintf(`DELETE FROM deporte WHERE id=%s`, d.Id)
	err := db.QueryRow(query).Scan()
	return err
}
