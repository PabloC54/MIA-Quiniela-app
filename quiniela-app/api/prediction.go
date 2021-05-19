package main

import (
	"database/sql"
	"fmt"
)

type prediction struct {
	Id_evento            string `json:"id_evento"`
	Username             string `json:"username"`
	Puntuacion_local     string `json:"puntuacion_local"`
	Puntuacion_visitante string `json:"puntuacion_visitante"`
}

func (p *prediction) createPrediction(db *sql.DB) error {

	query := fmt.Sprintf(`SELECT id FROM usuario WHERE username='%s'`, p.Username)

	var id_usuario string
	if err := db.QueryRow(query).Scan(&id_usuario); err != nil {
		return fmt.Errorf("No existe el usuario")
	}

	query = fmt.Sprintf(`INSERT INTO prediccion VALUES(%s, %s, %s, %s, 0)`, p.Id_evento, id_usuario, p.Puntuacion_local, p.Puntuacion_visitante)
	return db.QueryRow(query).Scan()
}

func (p *prediction) getPrediction(db *sql.DB) error {

	query := fmt.Sprintf(`SELECT id FROM usuario WHERE username='%s'`, p.Username)

	var id_usuario string
	if err := db.QueryRow(query).Scan(&id_usuario); err != nil {
		return fmt.Errorf("No existe el usuario")
	}

	query = fmt.Sprintf(`SELECT puntuacion_local, puntuacion_visitante FROM prediccion WHERE id_evento=%s AND id_usuario=%s`, p.Id_evento, id_usuario)
	return db.QueryRow(query).Scan(&p.Puntuacion_local, &p.Puntuacion_visitante)
}
