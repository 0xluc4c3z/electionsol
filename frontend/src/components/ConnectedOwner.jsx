import React from 'react'
import { useState } from 'react'

export const ConnectedOwner = ({ contract }) => {

  const[ownerValue, setOwnerValue] = useState()
  const[candidateValue, setCandidateValue] = useState()
  const[addressSend, setAddressSend] = useState()
  const[amountSend, setAmountSend] = useState()

  const TransferOwner = async () =>{
    const value = await contract.transferOwnership(ownerValue)
    console.log(value);
    setOwnerValue(undefined)
  }

  const ListCandidate = async () =>{
    const value = await contract.addCandidate(candidateValue)
    console.log(value);
    setCandidateValue(undefined)
  }

  const StartElection = async () =>{
    await contract.timeElection()
  }

  const TransfetNTT = async () =>{
    await contract.transfer(addressSend, amountSend)
  }

  return (
    <div className='owner-fun'>
      <div className="transfer-owner">
        <input className='input-to' type="text" placeholder='put the new address owner...' value={ownerValue} onChange={e => setOwnerValue(e.target.value)} />
        <button className='btn-to' onClick={TransferOwner}>TransferOwnership</button>
        <p></p>
      </div>  
      <div className="container-can">
        <input className='input-can' type="text" placeholder='put a candidate name...' value={candidateValue} onChange={e => setCandidateValue(e.target.value)} />
        <button className='btn-can' onClick={ListCandidate}>Submit</button>
      </div>
      <div className="cont-se">
        <button className='btn-se' onClick={StartElection}>Start Election</button>
      </div>
      <div className="transfer-ntt">
        <input className='address-t' type="text" placeholder='put an address...' value={addressSend} onChange={e => setAddressSend(e.target.value)} />
        <input className='amount-t' type="text" placeholder='put an amount...' value={amountSend} onChange={e => setAmountSend(e.target.value)} />
        <button className='btn-t' onClick={TransfetNTT}>Transfer</button>
      </div>
    </div>
  )
}
