import { paymentAPIUrl, eventAPIUrl } from 'services/ApiInfo'
import { toDateTime } from './util'

export async function getActiveEvents() {
  const res = await fetch(paymentAPIUrl, {
    method: 'GET',
    mode: 'cors'
  })

  const res_json = await res.json()
  return res_json
}

export async function newEvent(body) {
  const fecha = toDateTime(body.fecha)

  const res = await fetch(paymentAPIUrl, {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify({ ...body, fecha })
  })

  const created = res.ok

  const res_json = await res.json()
  return { ...res_json, created }
}

export async function getUserPredictions(user) {
  const res = await fetch(paymentAPIUrl + user, {
    method: 'GET',
    mode: 'cors'
  })

  const res_json = await res.json()
  return res_json
}

export async function getPrediction(user) {
  const res = await fetch(paymentAPIUrl + user, {
    method: 'GET',
    mode: 'cors'
  })

  const res_json = await res.json()
  return res_json
}

export async function sendPrediction(user, type) {
  let obj = { username: user, membresia: type }
  const res = await fetch(paymentAPIUrl, {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify(obj)
  })

  const res_json = await res.json()
  return res_json
}
