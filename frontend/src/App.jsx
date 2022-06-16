import { useState } from 'react'
import './App.css'
import { ConnectedUser } from './components/ConnectedUser'
import { NotConnected } from './components/NotConnected'

function App() {
  
  const [accounts, setAccounts] = useState([])
  const isConnected = Boolean(accounts[0])

  return (
    <div className="App">
      <div className="container">
        <h1>Election Results</h1>
        <p className='y-address'>Your address</p>
        <p className=''>{accounts}</p>
        <hr />
        {isConnected ?
          (<ConnectedUser accounts={accounts}/>):
          (<NotConnected setAccounts={setAccounts} />)}
      </div>
    </div>
  )
}

export default App
