import { paymentAPIUrl, eventAPIUrl, getEventsAPIUrl } from 'services/ApiInfo'
import { toDateTime } from './util'

export async function getActiveEvents() {
  const res = await fetch(getEventsAPIUrl, {
    method: 'GET',
    mode: 'cors'
  })

  const res_json = await res.json()
  return { eventos: res_json }
}

export async function newEvent(body) {
  body.fecha = toDateTime(body.fecha)
  const res = await fetch(eventAPIUrl, {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify(body)
  })

  const created = res.ok

  const res_json = await res.json()
  return { ...res_json, created }
}

export async function updateEvent(body, id) {
  if (body.fecha) body.fecha = toDateTime(body.fecha)
  const res = await fetch(eventAPIUrl + '/' + id, {
    method: 'PUT',
    mode: 'cors',
    body: JSON.stringify(body)
  })

  const updated = res.ok

  const res_json = await res.json()
  return { ...res_json, updated }
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
