import { Link } from 'wouter'

export default function Dashboard() {
  return (
    <>
      <h1>Página principal</h1>
      <p>
        <Link to='/predicciones'>Realiza predicciones</Link> sobre los eventos deportivos del momento y gana dinero acertando en
        tus predicciones
      </p>
    </>
  )
}
