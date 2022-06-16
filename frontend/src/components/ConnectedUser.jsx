import React from 'react'
import { ethers } from 'ethers'
import ElectionABI from '../../../artifacts/contracts/Election.sol/Election.json'
import { useState, useEffect } from 'react'
import { ConnectedOwner } from './ConnectedOwner'

export const ConnectedUser = ({ accounts }) => {

  const ElectionAddress = '0xb3D7d80bb0a62378Ac5e12f8Bc3E0b2312107862'

  const[inputValue, setInputValue] = useState('')
	const[optionCandidate, setOptionCandidate] = useState()
	const[inputBurn, setInputBurn] = useState()

  const[contract, setContract] = useState(undefined)
  const[balanceOf, setBalanceOf] = useState()
  const[candidates, setCandidates] = useState([])
  const[totalSupply, setTotalSupply] = useState()
  const[owner, setOwner] = useState()

  let isOwner = Boolean(accounts[0] === owner)

  useEffect(() =>{
    connectContrac()
  }, [])

  async function connectContrac(){
    if(window.ethereum){
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(
        ElectionAddress,
        ElectionABI.abi,
        signer
      )
			setContract(contract)
			
			const owner = await contract.owner()
			setOwner(owner.toLowerCase())

			const totalsupply = await contract.balanceOf(ElectionAddress)
			setTotalSupply(Number(totalsupply))
			
			const len = await contract.s_idCandidate()
			let array = []
			for (let i = 1; i <= Number(len); i++) {
				const listings = await contract.s_candidate(i).then(await function(can){
					let id = can[0]
					let name = can[1]
					let voteCount = can[2]

					let newCandidate = {
						id,
						name,
						voteCount
					}
					array.push(newCandidate)
				})
			}

			setCandidates(array)
    }
  }

  const BalanceOf = async () =>{
    const value = await contract.balanceOf(inputValue)
    setBalanceOf(Number(value._hex))
  }

	const handleChange = (e) =>{
		setOptionCandidate(e.target.value)
	}

	const VoteCandidate = async () =>{
		await contract.vote(optionCandidate)
	}

	const MintNTT = async () =>{
		await contract.mintNTT()
	}

	const BurnNTT = async () =>{
		await contract.burn(inputBurn)
	}

  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th scope='col'>#</th>
            <th scope='col'>Name</th>
            <th scope='col'>Votes</th>
          </tr>
        </thead>
      </table>
      <hr />
      {candidates.map((item) =>(
        <table className="table">
          <thead>
            <tr>
              <td scope='col'>{Number(item.id)}</td>
              <td scope='col'>{item.name}</td>
              <td scope='col'>{Number(item.voteCount)}</td>
            </tr>
          </thead>
        </table>
      ))}
      <hr />
      <div className="container-user">
        <div className="container-addr">
          <input className='input-addr' type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder='put an address...' />
          <button onClick={BalanceOf} className='btn-addr'>Balance of NTT</button>
          <p className="">{balanceOf}</p>
        </div>
        <div className='container-mint'>
          <button className='btn-mint' onClick={MintNTT}>Mint NTT</button>
					<p>See your NTT in Metamask with the address of contract</p>
        </div>
        <div className="container-vote">
          <p className="candidatesSelect">Select Candidate</p>
          <select className="form-control" id="candidatesSelect" onChange={handleChange}>
						<option disabled selected>Select a candidate</option>
						{candidates.map((item)=>(
							<option value={item.id} key={item.id}>{item.name}</option>
						))}
					</select>
          <button type="submit" className="btn btn-primary" onClick={VoteCandidate}>Vote</button>
        </div>
        <div className="container-burn">
          <input type="text" placeholder='put a number of burn...' className='input-burn' value={inputBurn} onChange={e => setInputBurn(e.target.value)} />
          <button className='btn-burn' onClick={BurnNTT}>Burn your NTT</button>
        </div>
      </div>
      <div className=''>
        <div className="details">
          <p>Address of Contract</p>
          <p>{ElectionAddress}</p>
          <p className='ntt-remaining'>NTTs available for voting</p>
          <p>{totalSupply}</p>
        </div>
      </div>
      <hr />
      {isOwner ? 
        (<ConnectedOwner contract={contract}/>) : ('')}
    </div>
  )
}
