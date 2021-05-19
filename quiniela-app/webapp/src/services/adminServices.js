import { adminAPIUrl } from 'services/ApiInfo'

export async function getAdminInfo() {
  const res = await fetch(adminAPIUrl, {
    method: 'GET',
    mode: 'cors'
  })

  const res_json = await res.json()
  return res_json
}
