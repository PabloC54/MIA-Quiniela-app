const yaml = require('js-yaml')
const fs = require('fs')

const toCSV = (content) => {
  let str =
    'id,nombre,apellido,password,username,temporada,tier,jornada,deporte,fecha,visitante,local,prediccion_visitante,prediccion_local,resultado_visitante,resultado_local\n'
  for (let [user_id, user_content] of Object.entries(content)) {
    const { nombre, apellido, password, username, resultados } = user_content

    for (let resultado of resultados) {
      const { temporada, tier, jornadas } = resultado

      for (let _jornada of jornadas) {
        const { jornada, predicciones } = _jornada

        for (let _prediccion of predicciones) {
          const { deporte, fecha, visitante, local, prediccion, resultado } = _prediccion
          const { visitante: prediccion_visitante, local: prediccion_local } = prediccion
          const { visitante: resultado_visitante, local: resultado_local } = resultado

          str += `${user_id},${nombre},${apellido},${password},${username},${temporada},${tier},${jornada},${deporte},${fecha},${visitante},${local},${prediccion_visitante},${prediccion_local},${resultado_visitante},${resultado_local}\n`
        }
      }
    }
  }
  return str
}

//try {
//  const doc = yaml.load(fs.readFileSync('/home/pablo/Documentos/src/Universidad/-MIA-Proyecto-2/test/quinielas.yaml', 'utf8'))
//  fs.writeFileSync('/home/pablo/Documentos/src/Universidad/-MIA-Proyecto-2/test/res.csv', toCSV(doc))
//} catch (e) {
//  console.log(e)
//}


export function toDateTime(date_string) {
  let date = date_string ? new Date(date_string) : new Date()
  let dd = String(date.getDate()).padStart(2, '0')
  let mm = String(date.getMonth() + 1).padStart(2, '0')
  let yyyy = date.getFullYear()
  let hh = date.getHours()
  let mi = date.getMinutes()

  return `${dd}/${mm}/${yyyy} ${hh}:${mi}`
}
