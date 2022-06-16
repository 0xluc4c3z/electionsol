import React from 'react'


export const NotConnected = ({ setAccounts }) => {
  
  async function connectAcount(){
    if(window.ethereum){
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })
      setAccounts(accounts)
    }
  }
  
  return (
    <div>
      <p>You must connected to vote in this election.</p>
      <button onClick={connectAcount}>Connect</button>
    </div>
  )
}
