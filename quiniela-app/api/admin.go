package main

import (
	"database/sql"
	"fmt"
	"strconv"
)

type admin_info struct {
	Temporada       string `json:"temporada"`
	Final_temporada string `json:"final_temporada"`
	Jornada         string `json:"jornada"`
	Final_jornada   string `json:"final_jornada"`
	Capital         string `json:"capital"`
	Sin_membresia   string `json:"sin_membresia"`
	Bronze          string `json:"bronze"`
	Silver          string `json:"silver"`
	Gold            string `json:"gold"`
}

func (a *admin_info) getAdminInfo(db *sql.DB) error {
	var id_temporada string
	query := "SELECT id, nombre, fecha_final FROM temporada WHERE estado='activo'"
	if err := db.QueryRow(query).Scan(&id_temporada, &a.Temporada, &a.Final_temporada); err != nil {
		return err
	}
	query = "SELECT nombre, fecha_final FROM jornada WHERE estado='activo'"
	if err := db.QueryRow(query).Scan(&a.Jornada, &a.Final_jornada); err != nil {
		return err
	}

	query = fmt.Sprintf("SELECT count(*) FROM estado_usuario WHERE id_temporada=%s AND id_membresia=(SELECT id FROM membresia WHERE nombre='ninguna')", id_temporada)
	if err := db.QueryRow(query).Scan(&a.Sin_membresia); err != nil {
		return err
	}
	query = fmt.Sprintf("SELECT count(*) FROM estado_usuario WHERE id_temporada=%s AND id_membresia=(SELECT id FROM membresia WHERE nombre='bronze')", id_temporada)
	if err := db.QueryRow(query).Scan(&a.Bronze); err != nil {
		return err
	}
	query = fmt.Sprintf("SELECT count(*) FROM estado_usuario WHERE id_temporada=%s AND id_membresia=(SELECT id FROM membresia WHERE nombre='silver')", id_temporada)
	if err := db.QueryRow(query).Scan(&a.Silver); err != nil {
		return err
	}
	query = fmt.Sprintf("SELECT count(*) FROM estado_usuario WHERE id_temporada=%s AND id_membresia=(SELECT id FROM membresia WHERE nombre='gold')", id_temporada)
	if err := db.QueryRow(query).Scan(&a.Gold); err != nil {
		return err
	}

	num1, _ := strconv.Atoi(a.Bronze)
	num2, _ := strconv.Atoi(a.Silver)
	num3, _ := strconv.Atoi(a.Gold)

	a.Capital = strconv.Itoa(num1 + num2 + num3)
	return nil
}
