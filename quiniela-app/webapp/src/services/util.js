export function toDate(date_string) {
  let date = date_string ? new Date(date_string) : new Date()
  let dd = String(date.getDate()).padStart(2, '0')
  let mm = String(date.getMonth() + 1).padStart(2, '0')
  let yyyy = date.getFullYear()

  return `${dd}/${mm}/${yyyy}`
}

export function toDateTime(date_string) {
  let date = date_string ? new Date(date_string) : new Date()
  let dd = String(date.getDate()).padStart(2, '0')
  let mm = String(date.getMonth() + 1).padStart(2, '0')
  let yyyy = date.getFullYear()
  let hh = date.getHours()
  let mi = date.getMinutes()

  return `${dd}/${mm}/${yyyy} ${hh}:${mi}`
}

export function pastDate(date_string) {
  let date = new Date(date_string)
  return date.setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0) < 0
}

export function copyObject(obj) {
  return JSON.parse(JSON.stringify(obj))
}
