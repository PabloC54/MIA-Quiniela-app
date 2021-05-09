import React, { useState } from 'react'

const UserContext = React.createContext({})

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(localStorage.getItem('user') || '')
  const [logged, setLogged] = useState(user !== '')

  const doLogin = (user) => {
    setUser(user)
    setLogged(true)
    localStorage.setItem('user', user)
  }

  const doLogout = () => {
    setUser('')
    setLogged(false)
    localStorage.removeItem('user')
  }

  return <UserContext.Provider value={{ logged, user, doLogin, doLogout }}>{children}</UserContext.Provider>
}

export default UserContext
