const PORT = 8000
const APIUrl = `http://localhost:${PORT}/api`

const getUserAPIUrl = APIUrl + '/user/'
const registerUserAPIUrl = APIUrl + '/registrar'
const loginUserAPIUrl = APIUrl + '/login'
const recoverUserAPIUrl = APIUrl + '/recuperar'
const updateUserAPIUrl = APIUrl + '/actualizar'
const paymentAPIUrl = APIUrl + '/pago'

export { getUserAPIUrl, registerUserAPIUrl, loginUserAPIUrl, recoverUserAPIUrl, updateUserAPIUrl, paymentAPIUrl }
