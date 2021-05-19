package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"

	_ "github.com/godror/godror"
	"github.com/gorilla/mux"
)

type App struct {
	Router *mux.Router
	DB     *sql.DB
}

func respondWithMessage(w http.ResponseWriter, code int, message string) {
	response, _ := json.Marshal(map[string]string{"message": message})

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.WriteHeader(code)
	w.Write(response)
}

func respondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	response, _ := json.Marshal(payload)

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.WriteHeader(code)
	w.Write(response)
}

func (a *App) Start() {
	databaseDSN, ok := os.LookupEnv("DATABASE_DSN")
	if !ok {
		panic(fmt.Errorf("error opening db: credentials not found"))
	}

	var err error
	a.DB, err = sql.Open("godror", databaseDSN)
	if err != nil {
		panic(fmt.Errorf("error opening db: %w", err))
	}

	a.Router = mux.NewRouter()
	a.initializeRoutes()
}

func (a *App) Run(PORT string) {
	fmt.Println("Servidor corriendo en http://localhost:" + PORT)
	log.Fatal(http.ListenAndServe(":"+PORT, a.Router))
}

func (a *App) getAdminInfo(w http.ResponseWriter, r *http.Request) {
	var ai admin_info
	if err := ai.getAdminInfo(a.DB); err != nil {
		respondWithMessage(w, http.StatusInternalServerError, err.Error())
	}
	respondWithJSON(w, http.StatusOK, ai)
}

func (a *App) getUser(w http.ResponseWriter, r *http.Request) {
	username := mux.Vars(r)["username"]
	u := usuario{Username: username}
	err := u.getUser(a.DB)

	switch err {
	case nil:
		respondWithJSON(w, http.StatusOK, u)
	case sql.ErrNoRows:
		respondWithMessage(w, http.StatusNotFound, "Usuario no existente")
	default:
		respondWithMessage(w, http.StatusInternalServerError, err.Error())
	}
}

func (a *App) getAllUsers(w http.ResponseWriter, r *http.Request) {
	limit, _ := strconv.Atoi(r.FormValue("limit"))
	offset, _ := strconv.Atoi(r.FormValue("offset"))

	if limit < 1 {
		limit = 10
	}
	if offset < 1 {
		offset = 0
	}

	usuarios, err := getAllUsers(a.DB, offset, limit)
	if err != nil {
		respondWithMessage(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondWithJSON(w, http.StatusOK, usuarios)
}

func (a *App) createUser(w http.ResponseWriter, r *http.Request) {
	var u usuario
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&u); err != nil {
		respondWithMessage(w, http.StatusBadRequest, "Solicitud no válida")
		return
	}
	defer r.Body.Close()

	if err := u.createUser(a.DB); err != nil && err != sql.ErrNoRows {
		respondWithMessage(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondWithMessage(w, http.StatusCreated, "Usuario registrado")
}

func (a *App) loginUser(w http.ResponseWriter, r *http.Request) {
	var u usuario
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&u); err != nil {
		fmt.Println(err)
		respondWithMessage(w, http.StatusBadRequest, "Solicitud no válida")
		return
	}
	defer r.Body.Close()

	err := u.loginUser(a.DB)

	switch err {
	case nil:
		respondWithMessage(w, http.StatusOK, "Credenciales válidas")
	case sql.ErrNoRows:
		respondWithMessage(w, http.StatusUnauthorized, "No se encontró esta combinación de usuario y contraseña")
	default:
		respondWithMessage(w, http.StatusInternalServerError, err.Error())
	}
}

func (a *App) recoverUser(w http.ResponseWriter, r *http.Request) {
	var u usuario
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&u); err != nil {
		respondWithMessage(w, http.StatusBadRequest, "Solicitud no válida")
		return
	}
	defer r.Body.Close()

	err := u.recoverUser(a.DB)
	switch err {
	case nil:
		respondWithMessage(w, http.StatusOK, u.Contraseña)
	case sql.ErrNoRows:
		respondWithMessage(w, http.StatusUnauthorized, "No se encontró este correo")
	default:
		respondWithMessage(w, http.StatusInternalServerError, err.Error())
	}
}

func (a *App) updateUser(w http.ResponseWriter, r *http.Request) {
	var u usuario
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&u); err != nil {
		respondWithMessage(w, http.StatusBadRequest, "Solicitud no válida")
		return
	}
	defer r.Body.Close()

	if err := u.updateUser(a.DB); err != nil && err != sql.ErrNoRows {
		respondWithMessage(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondWithMessage(w, http.StatusCreated, "Usuario actualizado")
}

func (a *App) deleteUser(w http.ResponseWriter, r *http.Request) {
	username := mux.Vars(r)["username"]

	u := usuario{Username: username}
	if err := u.deleteUser(a.DB); err != nil && err != sql.ErrNoRows {
		respondWithMessage(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondWithMessage(w, http.StatusOK, "Usuario eliminado")
}

func (a *App) membershipHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		username := mux.Vars(r)["username"]
		fmt.Printf(username)
		m := membresia{Username: username}
		err := m.getMembership(a.DB)

		switch err {
		case nil:
			respondWithJSON(w, http.StatusOK, m)
		case sql.ErrNoRows:
			respondWithMessage(w, http.StatusNotFound, "Sin membresía")
		default:
			respondWithMessage(w, http.StatusInternalServerError, err.Error())
		}
	} else {
		var m membresia
		decoder := json.NewDecoder(r.Body)
		if err := decoder.Decode(&m); err != nil {
			respondWithMessage(w, http.StatusBadRequest, "Solicitud no válida")
			return
		}
		defer r.Body.Close()

		if err := m.setMembership(a.DB); err != nil && err != sql.ErrNoRows {
			respondWithMessage(w, http.StatusInternalServerError, err.Error())
			return
		}

		respondWithMessage(w, http.StatusCreated, "Membresía actualizada")
	}
}

func (a *App) getAllSports(w http.ResponseWriter, r *http.Request) {

	deportes, err := getAllSports(a.DB)
	if err != nil {
		respondWithMessage(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondWithJSON(w, http.StatusOK, deportes)
}

func (a *App) sportsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {

		var d deporte
		decoder := json.NewDecoder(r.Body)
		if err := decoder.Decode(&d); err != nil {
			respondWithMessage(w, http.StatusBadRequest, "Solicitud no válida")
			return
		}
		defer r.Body.Close()

		if err := d.createSport(a.DB); err != nil && err != sql.ErrNoRows {
			respondWithMessage(w, http.StatusInternalServerError, err.Error())
			return
		}

		respondWithMessage(w, http.StatusCreated, "Deporte creado")
	} else if r.Method == "PUT" {

		id := mux.Vars(r)["id"]
		d := deporte{Id: id}

		decoder := json.NewDecoder(r.Body)
		if err := decoder.Decode(&d); err != nil {
			respondWithMessage(w, http.StatusBadRequest, "Solicitud no válida")
			return
		}
		defer r.Body.Close()

		if err := d.updateSport(a.DB); err != nil && err != sql.ErrNoRows {
			respondWithMessage(w, http.StatusInternalServerError, err.Error())
			return
		}

		respondWithMessage(w, http.StatusCreated, "Deporte actualizado")
	} else {

		id := mux.Vars(r)["id"]
		d := deporte{Id: id}

		if err := d.deleteSport(a.DB); err != nil && err != sql.ErrNoRows {
			respondWithMessage(w, http.StatusInternalServerError, err.Error())
			return
		}

		respondWithMessage(w, http.StatusOK, "Deporte eliminado")
	}
}

func (a *App) getAllTeams(w http.ResponseWriter, r *http.Request) {

	teams, err := getAllTeams(a.DB)
	if err != nil {
		respondWithMessage(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondWithJSON(w, http.StatusOK, teams)
}

func (a *App) getAllEvents(w http.ResponseWriter, r *http.Request) {

	events, err := getAllEvents(a.DB)
	if err != nil && err != sql.ErrNoRows {
		respondWithMessage(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondWithJSON(w, http.StatusOK, events)
}

func (a *App) predictionHandler(w http.ResponseWriter, r *http.Request) {

	if r.Method == "POST" {
		defer r.Body.Close()

		var p prediction
		decoder := json.NewDecoder(r.Body)
		if err := decoder.Decode(&p); err != nil {
			respondWithMessage(w, http.StatusBadRequest, "Solicitud no válida")
			return
		}

		if err := p.createPrediction(a.DB); err != nil && err != sql.ErrNoRows {
			respondWithMessage(w, http.StatusInternalServerError, err.Error())
			return
		}

		respondWithMessage(w, http.StatusCreated, "Prediccion creada")
	} else {
		id_evento := mux.Vars(r)["id_evento"]
		username := mux.Vars(r)["username"]

		p := prediction{Id_evento: id_evento, Username: username}
		if err := p.getPrediction(a.DB); err != nil {
			respondWithMessage(w, http.StatusInternalServerError, err.Error())
			return
		}

		respondWithJSON(w, http.StatusOK, p)
	}
}

func (a *App) eventHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		var e event
		decoder := json.NewDecoder(r.Body)
		if err := decoder.Decode(&e); err != nil {
			respondWithMessage(w, http.StatusBadRequest, "Solicitud no válida")
			return
		}
		defer r.Body.Close()

		if err := e.createEvent(a.DB); err != nil && err != sql.ErrNoRows {
			respondWithMessage(w, http.StatusInternalServerError, err.Error())
			return
		}

		respondWithMessage(w, http.StatusCreated, e.Id)
	} else if r.Method == "PUT" {
		id := mux.Vars(r)["id"]
		e := event{Id: id}

		decoder := json.NewDecoder(r.Body)
		if err := decoder.Decode(&e); err != nil {
			respondWithMessage(w, http.StatusBadRequest, "Solicitud no válida")
			return
		}
		defer r.Body.Close()

		if err := e.updateEvent(a.DB); err != nil && err != sql.ErrNoRows {
			respondWithMessage(w, http.StatusInternalServerError, err.Error())
			return
		}

		respondWithMessage(w, http.StatusCreated, "Evento actualizado")
	} else {
		id := mux.Vars(r)["id"]
		e := event{Id: id}
		if err := e.deleteEvent(a.DB); err != nil && err != sql.ErrNoRows {
			respondWithMessage(w, http.StatusInternalServerError, err.Error())
			return
		}

		respondWithMessage(w, http.StatusOK, "Evento eliminado")
	}
}

func (a *App) seasonHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		var s season
		if err := s.getActualSeason(a.DB); err != nil {
			respondWithMessage(w, http.StatusInternalServerError, err.Error())
			return
		}

		respondWithJSON(w, http.StatusOK, s)
	}
}

func (a *App) periodHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		var p period

		if err := p.getActualPeriod(a.DB); err != nil {
			respondWithMessage(w, http.StatusInternalServerError, err.Error())
			return
		}

		respondWithJSON(w, http.StatusOK, p)
	}
}

func (a *App) initializeRoutes() {
	a.Router.HandleFunc("/api/admin", corsHandler(a.getAdminInfo))

	a.Router.HandleFunc("/api/users", corsHandler(a.getAllUsers))
	a.Router.HandleFunc("/api/user/{username}", corsHandler(a.getUser))
	a.Router.HandleFunc("/api/registrar", corsHandler(a.createUser))
	a.Router.HandleFunc("/api/login", corsHandler(a.loginUser))
	a.Router.HandleFunc("/api/recuperar", corsHandler(a.recoverUser))

	a.Router.HandleFunc("/api/membresia", corsHandler(a.membershipHandler))
	a.Router.HandleFunc("/api/membresia/{username}", corsHandler(a.membershipHandler))

	a.Router.HandleFunc("/api/sports", corsHandler(a.getAllSports))
	a.Router.HandleFunc("/api/sport", corsHandler(a.sportsHandler))
	a.Router.HandleFunc("/api/sport/{id}", corsHandler(a.sportsHandler))

	a.Router.HandleFunc("/api/teams", corsHandler(a.getAllTeams))

	a.Router.HandleFunc("/api/prediction", corsHandler(a.predictionHandler))
	a.Router.HandleFunc("/api/prediction/{id_evento}/{username}", corsHandler(a.predictionHandler))

	a.Router.HandleFunc("/api/events", corsHandler(a.getAllEvents))
	a.Router.HandleFunc("/api/event", corsHandler(a.eventHandler))
	a.Router.HandleFunc("/api/event/{id}", corsHandler(a.eventHandler))

	a.Router.HandleFunc("/api/period", corsHandler(a.periodHandler))

	a.Router.HandleFunc("/api/season", corsHandler(a.seasonHandler))
}

func corsHandler(handler func(w http.ResponseWriter, r *http.Request)) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "OPTIONS" {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Vary", "Origin")
			w.Header().Set("Vary", "Access-Control-Request-Method")
			w.Header().Set("Vary", "Access-Control-Request-Headers")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Origin, Accept, token")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		} else {
			handler(w, r)
		}
	}
}
