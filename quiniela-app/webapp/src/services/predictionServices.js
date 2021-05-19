import { getPredictionsAPIUrl, predictionAPIUrl } from 'services/ApiInfo'

export async function getUserPredictions(user) {
  const res = await fetch(getPredictionsAPIUrl + user, {
    method: 'GET',
    mode: 'cors'
  })

  const res_json = await res.json()
  return res_json
}

export async function getPrediction({ id_evento, username }) {
  console.log(id_evento)
  const res = await fetch(predictionAPIUrl + '/' + id_evento + '/' + username, {
    method: 'GET',
    mode: 'cors'
  })

  const sent = res.ok

  const res_json = await res.json()
  return { sent, ...res_json }
}

export async function sendPrediction(body) {
  const res = await fetch(predictionAPIUrl, {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify(body)
  })

  const sent = res.ok

  const res_json = await res.json()
  return { sent, ...res_json }
}
