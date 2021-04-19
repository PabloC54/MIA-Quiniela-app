import './App.css'
import { Route, Router, useRouter, useLocation } from 'wouter'
import { useContext } from 'react'

import Header from './components/Header'
import Notification from './components/Notification'

import { NotificationContextProvider } from './context/NotificationContext'
import UserContext from './context/UserContext'

import Main from './pages/Main'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import PasswordRecovery from './pages/PasswordRecovery'
import Profile from './pages/Profile'
import Payment from './pages/Payment'
import Predictions from './pages/Predictions'
import Results from './pages/Results'
import Ranking from './pages/Ranking'
import Prizes from './pages/Prizes'
import Admin from './pages/Admin'
import Charge from './pages/Charge'
import Periods from './pages/Periods'
import Seasons from './pages/Seasons'
import Sports from './pages/Sports'
import Reports from './pages/Reports'
import Chat from './pages/Chat'

function App() {
  const { logged, user } = useContext(UserContext)
  return (
    <NotificationContextProvider>
      <Header />
      <Notification />
      <Route path='/ranking'>
        <Ranking />
      </Route>
      {logged ? (
        <>
          <Route path='/perfil'>
            <Profile />
          </Route>
          <Route path='/chat'>
            <Chat />
          </Route>
          {user === 'admin' ? (
            <>
              <NestedRoutes base='/admin'>
                <Route path='/'>
                  <Admin />
                </Route>
                <Route path='/carga'>
                  <Charge />
                </Route>
                <Route path='/jornadas'>
                  <Periods />
                </Route>
                <Route path='/temporadas'>
                  <Seasons />
                </Route>
                <Route path='/deportes'>
                  <Sports />
                </Route>
                <Route path='/recompensas'>
                  <Prizes />
                </Route>
                <Route path='/reportes'>
                  <Reports />
                </Route>
              </NestedRoutes>
            </>
          ) : (
            <>
              <Route path='/' component={Dashboard} />
              <Route path='/membresia'>
                <Payment />
              </Route>
              <Route path='/predicciones'>
                <Predictions />
              </Route>
              <Route path='/resultados'>
                <Results />
              </Route>
              <Route path='/recompensas'>
                <Prizes />
              </Route>
            </>
          )}
        </>
      ) : (
        <>
          <Route path='/' component={Main} />
          <Route path='/registro'>
            <Register />
          </Route>
          <Route path='/login'>
            <Login />
          </Route>
          <Route path='/recuperacion'>
            <PasswordRecovery />
          </Route>
        </>
      )}
    </NotificationContextProvider>
  )
}

const NestedRoutes = (props) => {
  const router = useRouter()
  const [parentLocation] = useLocation()
  const nestedBase = `${router.base}${props.base}`

  if (!parentLocation.startsWith(nestedBase)) return null

  return (
    <Router base={nestedBase} key={nestedBase}>
      {props.children}
    </Router>
  )
}

export default App
