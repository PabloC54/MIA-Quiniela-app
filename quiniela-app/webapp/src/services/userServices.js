import { getUserAPIUrl, registerUserAPIUrl, loginUserAPIUrl, recoverUserAPIUrl, updateUserAPIUrl } from 'services/ApiInfo'
import { toDate } from 'util/util'

export async function getUser(user) {
  const res = await fetch(getUserAPIUrl + user, {
    method: 'GET',
    mode: 'cors'
  })

  const res_json = await res.json()
  return res_json
}

export async function registerUser(body) {
  let fecha_registro = toDate()
  let fecha_nacimiento = toDate(body.fecha_nacimiento)
  let obj = { ...body, fecha_registro, fecha_nacimiento }

  const res = await fetch(registerUserAPIUrl, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj)
  })

  const registered = res.ok
  const res_json = await res.json()
  return { ...res_json, registered }
}

export async function loginUser(body) {
  const res = await fetch(loginUserAPIUrl, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  const logged = res.ok
  const res_json = await res.json()
  return { ...res_json, logged }
}

export async function recoverUser(body) {
  const res = await fetch(recoverUserAPIUrl, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  const recovered = res.ok
  const res_json = await res.json()
  return { ...res_json, recovered }
}

export async function updateUser(body) {
  let fecha_nacimiento = toDate(body.fecha_nacimiento)
  let obj = { ...body, fecha_nacimiento }

  const res = await fetch(updateUserAPIUrl, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj)
  })

  const updated = res.ok
  const res_json = await res.json()
  return { ...res_json, updated }
}
