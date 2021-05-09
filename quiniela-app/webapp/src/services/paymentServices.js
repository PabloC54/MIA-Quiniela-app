import { paymentAPIUrl } from 'services/ApiInfo'

export async function getMembership(user) {
  const res = await fetch(paymentAPIUrl + user, {
    method: 'GET',
    mode: 'cors'
  })

  const res_json = await res.json()
  return res_json
}

export async function setMembership(user, type) {
  let obj = { username: user, membresia: type }
  const res = await fetch(paymentAPIUrl, {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify(obj)
  })

  const res_json = await res.json()
  return res_json
}
