const PORT = 8000
const APIUrl = `http://localhost:${PORT}/api`

const getUserAPIUrl = APIUrl + '/user/'
const registerUserAPIUrl = APIUrl + '/registrar'
const loginUserAPIUrl = APIUrl + '/login'
const recoverUserAPIUrl = APIUrl + '/recuperar'
const updateUserAPIUrl = APIUrl + '/actualizar'

const paymentAPIUrl = APIUrl + '/membresia'

const eventAPIUrl = APIUrl + '/event'

const getSportsAPIUrl = APIUrl + '/deportes'
const SportAPIUrl = APIUrl + '/deporte'

const getSeasonsAPIUrl = APIUrl + '/temporadas'
const seasonAPIUrl = APIUrl + '/temporada'

const getPeriodsAPIUrl = APIUrl + '/jornadas'
const periodAPIUrl = APIUrl + '/jornada'

export {
  getUserAPIUrl,
  registerUserAPIUrl,
  loginUserAPIUrl,
  recoverUserAPIUrl,
  updateUserAPIUrl,
  paymentAPIUrl,
  eventAPIUrl,
  getSportsAPIUrl,
  SportAPIUrl,
  getSeasonsAPIUrl,
  seasonAPIUrl,
  getPeriodsAPIUrl,
  periodAPIUrl
}
