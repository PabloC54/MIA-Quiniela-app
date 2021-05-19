import { getTeamsAPIUrl } from 'services/ApiInfo'

export async function getTeams() {
  const res = await fetch(getTeamsAPIUrl, {
    method: 'GET',
    mode: 'cors'
  })

  const res_json = await res.json()
  return { equipos: res_json }
}
