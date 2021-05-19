package main

import (
	"database/sql"
)

type team struct {
	Id     string `json:"id"`
	Nombre string `json:"nombre"`
}

func getAllTeams(db *sql.DB) ([]team, error) {
	rows, err := db.Query(
		"SELECT id, nombre FROM equipo")
	if err != nil {
		return nil, err
	}

	defer rows.Close()
	teams := []team{}

	for rows.Next() {
		var t team
		if err := rows.Scan(&t.Id, &t.Nombre); err != nil {
			return nil, err
		}
		teams = append(teams, t)
	}

	return teams, nil
}
