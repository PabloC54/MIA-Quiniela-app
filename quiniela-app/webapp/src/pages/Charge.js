import { Button } from 'bootstrap'
import { useState, useContext, useRef } from 'react'

import NotificationContext from 'context/NotificationContext'

export default function Charge() {
  const [fileContent, setFileContent] = useState('')

  const { setNotification } = useContext(NotificationContext)
  const inputFile = useRef(null)

  let fileReader
  const handleFileUpload = (file) => {
    fileReader = new FileReader()
    fileReader.onloadend = handleFileRead
    fileReader.readAsText(file)
  }

  const handleFileRead = () => {
    const { result } = fileReader
    setFileContent(result)
  }

  const handleProcess = () => {
    if (!fileContent) return setNotification('Error al procesar el archivo', 'No se cargó ningún archivo YAML', 'danger')
  }

  return (
    <>
      <h3>Carga masiva de datos</h3>
      <p>Carga un archivo YAML para insertar los datos a la base de datos</p>
      <input
        type='file'
        accept='.yaml'
        ref={inputFile}
        onChange={(e) => handleFileUpload(e.target.files[0])}
        onClick={(e) => {
          e.target.value = null
        }}
      />
      <Button onClick={handleProcess}>Procesar archivo</Button>
    </>
  )
}
