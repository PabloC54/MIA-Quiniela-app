import { getSportsAPIUrl, SportAPIUrl } from 'services/ApiInfo'

export async function getSports() {
  const res = await fetch(getSportsAPIUrl, {
    method: 'GET',
    mode: 'cors'
  })

  const res_json = await res.json()
  return res_json
}

export async function newSport(body) {
  const res = await fetch(SportAPIUrl, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  const inserted = res.ok
  const res_json = await res.json()
  return { ...res_json, inserted }
}

export async function updateSport(id, body) {
  const res = await fetch(SportAPIUrl + '/' + id, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  const updated = res.ok
  const res_json = await res.json()
  return { ...res_json, updated }
}

export async function deleteSport(id) {
  const res = await fetch(SportAPIUrl + '/' + id, {
    method: 'DELETE',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const deleted = res.ok
  const res_json = await res.json()
  return { ...res_json, deleted }
}
