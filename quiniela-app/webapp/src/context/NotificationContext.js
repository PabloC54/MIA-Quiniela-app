import React, { useState } from 'react'

const NotificationContext = React.createContext({})

export function NotificationContextProvider({ children }) {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [variant, setVariant] = useState('')
  const [visible, setVisible] = useState('')

  const setNotification = (title, message, variant) => {
    setTitle(title)
    setMessage(message)
    setVariant(variant)
    setVisible(true)
  }

  return (
    <NotificationContext.Provider value={{ title, message, variant, visible, setNotification, setVisible }}>
      {children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext
