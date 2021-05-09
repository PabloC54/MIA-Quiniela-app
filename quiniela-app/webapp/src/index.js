import React from 'react'
import ReactDOM from 'react-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import App from 'components/App'
import { UserContextProvider } from 'context/UserContext'
//import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <UserContextProvider>
    <App />
  </UserContextProvider>,
  document.getElementById('root')
)

//reportWebVitals();
