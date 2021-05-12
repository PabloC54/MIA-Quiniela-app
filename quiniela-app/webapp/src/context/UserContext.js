import React, { useState } from 'react'
import { useLocation } from 'wouter'
import { confirmAlert } from 'react-confirm-alert'

const UserContext = React.createContext({})

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(localStorage.getItem('user') || '')
  const [logged, setLogged] = useState(user !== '')

  const [, setLocation] = useLocation()

  const doLogin = (user) => {
    setUser(user)
    setLogged(true)
    localStorage.setItem('user', user)
  }

  const doLogout = () => {
    confirmAlert({
      title: 'Cerrar sesión',
      message: '',
      overlayClassName: 'custom-prompt',
      buttons: [
        {
          label: 'Sí',
          onClick: () => {
            setUser('')
            setLogged(false)
            localStorage.removeItem('user')
            setLocation('/')
          }
        },
        {
          label: 'No'
        }
      ]
    })
  }

  return <UserContext.Provider value={{ logged, user, doLogin, doLogout }}>{children}</UserContext.Provider>
}

export default UserContext
