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

const FILE_NAME = 'qui2.yaml'

try {
  const obj = yaml.load(fs.readFileSync(FILE_NAME))
  fs.writeFileSync('res.csv', toCSV(obj))
  console.log('convertido')
} catch (e) {
  console.log(e)
}
