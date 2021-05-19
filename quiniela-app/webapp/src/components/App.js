import { Route, Switch, Redirect } from 'wouter'
import { useContext } from 'react'

import Header from 'components/Header'
import Footer from 'components/Footer'
import Notification from 'components/Notification'
import NestedRoutes from 'components/NestedRoutes'

import { Container } from 'react-bootstrap'

import { NotificationContextProvider } from 'context/NotificationContext'
import UserContext from 'context/UserContext'

import Main from 'pages/Main'
import Dashboard from 'pages/Dashboard'
import Login from 'pages/Login'
import Register from 'pages/Register'
import PasswordRecovery from 'pages/PasswordRecovery'
import Profile from 'pages/Profile'
import Payment from 'pages/Payment'
import Predictions from 'pages/Predictions'
import Results from 'pages/Results'
import Ranking from 'pages/Ranking'
import Prizes from 'pages/Prizes'
import Admin from 'pages/Admin'
import Charge from 'pages/Charge'
import Periods from 'pages/Periods'
import Seasons from 'pages/Season'
import Sports from 'pages/Sports'
import Reports from 'pages/Reports'
import Chat from 'pages/Chat'
import NotFound from 'pages/NotFound'

export default function App() {
  const { logged, user } = useContext(UserContext)
  return (
    <NotificationContextProvider>
      <Header />
      <Notification />
      <Container>
        <Switch>
          <Route component={Ranking} path='/ranking' />
          {logged ? (
            <>
              <Route component={Profile} path='/perfil' />
              <Route component={Chat} path='/chat' />
              <Route component={Payment} path='/membresia' />
              {user === 'admin' ? (
                <>
                  <NestedRoutes base='/admin'>
                    <Route component={Admin} path='/' />
                    <Route component={Charge} path='/carga' />
                    <Route component={Periods} path='/jornadas' />
                    <Route component={Seasons} path='/temporadas' />
                    <Route component={Sports} path='/deportes' />
                    <Route component={Prizes} path='/recompensas' />
                    <Route component={Reports} path='/reportes' />
                  </NestedRoutes>
                  <Redirect from='*' to='/admin' />
                </>
              ) : (
                <>
                  <Route component={Dashboard} path='/' />
                  <Route component={Predictions} path='/predicciones' />
                  <Route component={Results} path='/resultados' />
                  <Route component={Prizes} path='/recompensas' />
                </>
              )}
            </>
          ) : (
            <>
              <Route component={Main} path='/' />
              <Route component={Register} path='/registro' />
              <Route component={Login} path='/login' />
              <Route component={PasswordRecovery} path='/recuperacion' />
            </>
          )}
          <Route path='/404' component={NotFound} />
          <Redirect from='*' to='/404' />
        </Switch>
      </Container>
      <Footer />
    </NotificationContextProvider>
  )
}
