import { Link } from 'wouter'

export default function Main() {
  return (
    <p>
      <h1>¡Bienvenido a Quiniela APP!</h1>
      <h5>
        <Link to='/registro'>Regístrate</Link> en Quiniela App para empezar a predecir partidos
      </h5>
      <h6>
        ... o también <Link to='/login'>inicia sesión</Link>
      </h6>
    </p>
  )
}
