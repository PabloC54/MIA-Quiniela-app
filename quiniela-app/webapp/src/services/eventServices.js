import { eventAPIUrl, getEventsAPIUrl } from 'services/ApiInfo'
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
  const fecha = toDateTime(body.fecha)
  const res = await fetch(eventAPIUrl, {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify({ ...body, fecha })
  })

  const created = res.ok

  const res_json = await res.json()
  return { ...res_json, created }
}

export async function updateEvent(body, id) {
  const fecha = toDateTime(body.fecha)
  const res = await fetch(eventAPIUrl + '/' + id, {
    method: 'PUT',
    mode: 'cors',
    body: JSON.stringify({ ...body, fecha })
  })

  const updated = res.ok

  const res_json = await res.json()
  return { ...res_json, updated }
}

export async function deleteEvent(id) {
  const res = await fetch(eventAPIUrl + '/' + id, {
    method: 'DELETE',
    mode: 'cors'
  })

  const deleted = res.ok

  const res_json = await res.json()
  return { ...res_json, deleted }
}
