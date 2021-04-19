import React, { useState } from 'react'

const UserContext = React.createContext({})

export function UserContextProvider({ children }) {
  const [logged, setLogged] = useState(false)
  const [user, setUser] = useState('')

  const setUserLogged = (user) => {
    setUser(user)
    setLogged(user === '' ? false : true)
  }

  return <UserContext.Provider value={{ logged, user, setUserLogged }}>{children}</UserContext.Provider>
}

export default UserContext
