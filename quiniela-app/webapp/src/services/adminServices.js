import { paymentAPIUrl } from 'services/ApiInfo'

export async function getActiveInfo() {
  const res = await fetch(paymentAPIUrl, {
    method: 'GET',
    mode: 'cors'
  })

  const res_json = await res.json()
  return res_json
}
