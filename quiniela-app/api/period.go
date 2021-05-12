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
	var no_membership_id string
	query = `SELECT id FROM membresia WHERE nombre='ninguna'`
	_ = db.QueryRow(query).Scan(&p.Id, &season_id, &p.Nombre, &p.Fecha_inicio, &p.Fecha_final, &p.Estado)

	query = fmt.Sprintf(`SELECT count(*) FROM estado_usuario WHERE id_temporada=%s AND id_membresia!=%s`, season_id, no_membership_id)
	_ = db.QueryRow(query).Scan(&p.Clientes)

	query = fmt.Sprintf(`SELECT nombre FROM temporada WHERE id=%s`, season_id)
	err := db.QueryRow(query).Scan(&p.Temporada)
	return err
}

//func (p *period) createSport(db *sql.DB) error {
//	query := fmt.Sprintf(`INSERT INTO period VALUES(null, '%p', '%p', '%p')`, p.Nombre, p.Color, p.Imagen)
//	err := db.QueryRow(query).Scan()
//	return err
//}

//func (p *period) updateSport(db *sql.DB) error {
//	query := `UPDATE period SET `
//	if p.Nombre != "" {
//		query = fmt.Sprintf(query+` nombre='%p',`, p.Nombre)
//	}
//	if p.Color != "" {
//		query = fmt.Sprintf(query+` color='%p',`, p.Color)
//	}
//	if p.Imagen != "" {
//		query = fmt.Sprintf(query+` imagen='%p',`, p.Imagen)
//	}
//	query = query[:len(query)-1]

//	query = fmt.Sprintf(query+` WHERE id=%p`, p.Id)

//	err := db.QueryRow(query).Scan()
//	return err
//}

//func (p *period) deleteSport(db *sql.DB) error {
//	query := fmt.Sprintf(`DELETE FROM period WHERE id=%p`, p.Id)
//	err := db.QueryRow(query).Scan()
//	return err
//}
