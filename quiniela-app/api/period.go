package main

import (
	"database/sql"
	"fmt"
)

type period struct {
	Id           string `json:"id"`
	Temporada    string `json:"temporada"`
	Nombre       string `json:"nombre"`
	Clientes     string `json:"clientes"`
	Fecha_inicio string `json:"fecha_inicio"`
	Fecha_final  string `json:"fecha_final"`
	Estado       string `json:"estado"`
}

func (p *period) getActualPeriod(db *sql.DB) error {
	var season_id string
	query := `SELECT id, id_temporada, nombre, fecha_inicio, fecha_final, estado FROM jornada WHERE estado='activo'`
	if err := db.QueryRow(query).Scan(&p.Id, &season_id, &p.Nombre, &p.Fecha_inicio, &p.Fecha_final, &p.Estado); err != nil {
		return err
	}

	query = fmt.Sprintf(`SELECT count(*) FROM estado_usuario WHERE id_temporada=%s`, season_id)
	_ = db.QueryRow(query).Scan(&p.Clientes)

	query = fmt.Sprintf(`SELECT nombre FROM temporada WHERE id=%s`, season_id)
	err := db.QueryRow(query).Scan(&p.Temporada)
	return err
}
