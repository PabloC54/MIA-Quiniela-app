package main

import (
	"database/sql"
	"fmt"
)

type event struct {
	Id                   string `json:"id"`
	Equipo_local         string `json:"equipo_local"`
	Equipo_visitante     string `json:"equipo_visitante"`
	Puntuacion_local     string `json:"puntuacion_local"`
	Puntuacion_visitante string `json:"puntuacion_visitante"`
	Fecha                string `json:"fecha"`
	Deporte              string `json:"deporte"`
	Estado               string `json:"estado"`
}

func getAllEvents(db *sql.DB) ([]event, error) {
	var period_id string
	err := db.QueryRow(`SELECT id FROM jornada WHERE estado='activo'`).Scan(&period_id)

	query := fmt.Sprintf(`SELECT id, id_equipo_local, id_equipo_visitante, id_deporte, puntuacion_local, puntuacion_visitante, fecha, estado FROM evento WHERE id_jornada=%s ORDER BY fecha`, period_id)
	rows, err := db.Query(query)

	events := []event{}
	if err != nil {
		return events, err
	}

	defer rows.Close()

	for rows.Next() {
		var e event
		var id_local, id_visitante, id_deporte string
		if err := rows.Scan(&e.Id, &id_local, &id_visitante, &id_deporte, &e.Puntuacion_local, &e.Puntuacion_visitante, &e.Fecha, &e.Estado); err != nil {
			return nil, err
		}

		subquery := fmt.Sprintf(`SELECT nombre FROM equipo WHERE id=%s`, id_local)
		_ = db.QueryRow(subquery).Scan(&e.Equipo_local)

		subquery = fmt.Sprintf(`SELECT nombre FROM equipo WHERE id=%s`, id_visitante)
		_ = db.QueryRow(subquery).Scan(&e.Equipo_visitante)

		subquery = fmt.Sprintf(`SELECT nombre FROM deporte WHERE id=%s`, id_deporte)
		_ = db.QueryRow(subquery).Scan(&e.Deporte)

		events = append(events, e)
	}

	return events, nil
}

func (e *event) createEvent(db *sql.DB) error {
	var id_jornada, id_local, id_visitante, id_deporte string
	err := db.QueryRow(`SELECT id FROM jornada WHERE estado='activo'`).Scan(&id_jornada)
	query := fmt.Sprintf(`SELECT id FROM equipo WHERE nombre='%s'`, e.Equipo_local)
	if err = db.QueryRow(query).Scan(&id_local); err != nil {
		return fmt.Errorf("No existe el equipo local")
	}
	query = fmt.Sprintf(`SELECT id FROM equipo WHERE nombre='%s'`, e.Equipo_visitante)
	if err = db.QueryRow(query).Scan(&id_visitante); err != nil {
		return fmt.Errorf("No existe el equipo visitante")
	}

	query = fmt.Sprintf(`SELECT id FROM deporte WHERE nombre='%s'`, e.Deporte)
	if err = db.QueryRow(query).Scan(&id_deporte); err != nil {
		fmt.Println(e.Deporte, err.Error())
		return fmt.Errorf("No existe el deporte")
	}

	query = fmt.Sprintf(`INSERT INTO evento VALUES(null, %s, %s, %s, %s, 0, 0, TO_DATE('%s', 'dd/mm/yyyy hh24:mi'), 'activo')`, id_jornada, id_local, id_visitante, id_deporte, e.Fecha)
	err = db.QueryRow(query).Scan()

	query = fmt.Sprintf(`SELECT id FROM evento WHERE id_jornada=%s AND id_equipo_local=%s AND id_equipo_visitante=%s AND id_deporte=%s AND fecha=TO_DATE('%s', 'dd/mm/yyyy hh24:mi')`, id_jornada, id_local, id_visitante, id_deporte, e.Fecha)
	err = db.QueryRow(query).Scan(&e.Id)
	return err
}

func (e *event) updateEvent(db *sql.DB) error {

	var query string
	if e.Fecha == "" {
		query = fmt.Sprintf(`UPDATE event SET puntuacion_local=%s, puntuacion_visitante=%s, estado='finalizado' WHERE id=%v`, e.Puntuacion_local, e.Puntuacion_visitante, e.Id)
	} else {
		query = fmt.Sprintf(`UPDATE event SET fecha=TO_DATE('%s','dd/mm/yyyy hh24:mi') WHERE id=%v`, e.Fecha, e.Id)
	}

	return db.QueryRow(query).Scan()
}
