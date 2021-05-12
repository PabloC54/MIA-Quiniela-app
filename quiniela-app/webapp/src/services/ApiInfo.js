const PORT = 8000
const APIUrl = `http://localhost:${PORT}/api`

const getUserAPIUrl = APIUrl + '/user/'
const registerUserAPIUrl = APIUrl + '/registrar'
const loginUserAPIUrl = APIUrl + '/login'
const recoverUserAPIUrl = APIUrl + '/recuperar'
const updateUserAPIUrl = APIUrl + '/actualizar'

const paymentAPIUrl = APIUrl + '/membresia'

const getEventsAPIUrl = APIUrl + '/events'
const eventAPIUrl = APIUrl + '/event'

const getSportsAPIUrl = APIUrl + '/deportes'
const SportAPIUrl = APIUrl + '/deporte'

const getPeriodsAPIUrl = APIUrl + '/periods'
const periodAPIUrl = APIUrl + '/period'

const getSeasonsAPIUrl = APIUrl + '/seasons'
const seasonAPIUrl = APIUrl + '/season'

export {
  getUserAPIUrl,
  registerUserAPIUrl,
  loginUserAPIUrl,
  recoverUserAPIUrl,
  updateUserAPIUrl,
  paymentAPIUrl,
  getEventsAPIUrl,
  eventAPIUrl,
  getSportsAPIUrl,
  SportAPIUrl,
  getPeriodsAPIUrl,
  periodAPIUrl,
  getSeasonsAPIUrl,
  seasonAPIUrl
}
