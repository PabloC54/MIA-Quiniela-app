import { getPeriodsAPIUrl, periodAPIUrl } from 'services/ApiInfo'

export async function getActualPeriod() {
  const res = await fetch(periodAPIUrl, {
    method: 'GET',
    mode: 'cors'
  })

  const res_json = await res.json()
  return res_json
}

export async function getAllPeriods() {
  const res = await fetch(getPeriodsAPIUrl, {
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
