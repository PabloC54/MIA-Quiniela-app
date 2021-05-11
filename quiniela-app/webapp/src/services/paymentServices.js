import { paymentAPIUrl } from 'services/ApiInfo'

export async function getMembership(user) {
  const res = await fetch(paymentAPIUrl + user, {
    method: 'GET',
    mode: 'cors'
  })

  const res_json = await res.json()
  return { membresia: res_json.message }
}

export async function setMembership(user, type) {
  let obj = { username: user, membresia: type }
  const res = await fetch(paymentAPIUrl, {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify(obj)
  })

  const changed = res.ok
  const res_json = await res.json()
  return { ...res_json, changed }
}
