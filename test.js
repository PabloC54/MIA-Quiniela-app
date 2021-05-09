const toDate = (date_string) => {
  let date = date_string ? new Date(date_string) : new Date()
  let dd = String(date.getDate()).padStart(2, '0')
  let mm = String(date.getMonth() + 1).padStart(2, '0')
  let yyyy = date.getFullYear()

  return `${dd}/${mm}/${yyyy}`
}

console.log(toDate('2030/13/06'))
