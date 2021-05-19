const PORT = 8000
const APIUrl = `http://localhost:${PORT}/api`

const adminAPIUrl = APIUrl + '/admin'

const getUserAPIUrl = APIUrl + '/user/'
const registerUserAPIUrl = APIUrl + '/registrar'
const loginUserAPIUrl = APIUrl + '/login'
const recoverUserAPIUrl = APIUrl + '/recuperar'
const updateUserAPIUrl = APIUrl + '/actualizar'

const paymentAPIUrl = APIUrl + '/membresia'

const getEventsAPIUrl = APIUrl + '/events'
const eventAPIUrl = APIUrl + '/event'

const getPredictionsAPIUrl = APIUrl + '/predictions'
const predictionAPIUrl = APIUrl + '/prediction'

const getSportsAPIUrl = APIUrl + '/sports'
const SportAPIUrl = APIUrl + '/sport'

const getTeamsAPIUrl = APIUrl + '/teams'

const getPeriodsAPIUrl = APIUrl + '/periods'
const periodAPIUrl = APIUrl + '/period'

const getSeasonsAPIUrl = APIUrl + '/seasons'
const seasonAPIUrl = APIUrl + '/season'

export {
  adminAPIUrl,
  getUserAPIUrl,
  registerUserAPIUrl,
  loginUserAPIUrl,
  recoverUserAPIUrl,
  updateUserAPIUrl,
  paymentAPIUrl,
  getPredictionsAPIUrl,
  predictionAPIUrl,
  getEventsAPIUrl,
  eventAPIUrl,
  getSportsAPIUrl,
  SportAPIUrl,
  getTeamsAPIUrl,
  getPeriodsAPIUrl,
  periodAPIUrl,
  getSeasonsAPIUrl,
  seasonAPIUrl
}
