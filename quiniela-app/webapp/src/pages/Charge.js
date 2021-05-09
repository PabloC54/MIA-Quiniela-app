import { useRef } from 'react'

export default function Charge() {
  const inputFile = useRef(null)

  let fileReader
  const handleFileUpload = (file) => {
    fileReader = new FileReader()
    fileReader.onloadend = handleFileRead
    fileReader.readAsText(file)
  }

  const handleFileRead = () => {
    const { result } = fileReader
    console.log(result)
  }

  return (
    <>
      <h3>Carga masiva de datos</h3>
      <p>Carga un archivo YAML para insertar los datos a la base de datos</p>
      <input
        style={{ display: 'none' }}
        type='file'
        accept='.ty'
        ref={inputFile}
        onChange={(e) => handleFileUpload(e.target.files[0])}
        onClick={(e) => {
          e.target.value = null
        }}
      />
    </>
  )
}
