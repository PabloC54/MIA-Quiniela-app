import { seasonAPIUrl } from 'services/ApiInfo'

export async function getSeasonPositions() {
  const res = await fetch(seasonAPIUrl, {
    method: 'GET',
    mode: 'cors'
  })

  const res_json = await res.json()
  return res_json
}

//export async function getUserPredictions(user) {
//  const res = await fetch(paymentAPIUrl + user, {
//    method: 'GET',
//    mode: 'cors'
//  })

//  const res_json = await res.json()
//  return res_json
//}

//export async function getPrediction(user) {
//  const res = await fetch(paymentAPIUrl + user, {
//    method: 'GET',
//    mode: 'cors'
//  })

//  const res_json = await res.json()
//  return res_json
//}

//export async function sendPrediction(user, type) {
//  let obj = { username: user, membresia: type }
//  const res = await fetch(paymentAPIUrl, {
//    method: 'POST',
//    mode: 'cors',
//    body: JSON.stringify(obj)
//  })

//  const res_json = await res.json()
//  return res_json
//}
