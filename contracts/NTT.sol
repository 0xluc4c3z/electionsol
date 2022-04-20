//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "./interface/INTT.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NTT is INTT, Ownable{

    /** NTT data **/
    string public constant name = "NoTransferToken";
    string public constant symbol = "NTT";
    uint256 public constant decimals = 0;


    mapping (address => uint256) s_balances;
    uint256 s_totalSupply;
    address s_owner;


    constructor (uint256 initialSupply) {
        s_totalSupply = initialSupply;
        s_balances[msg.sender] = s_totalSupply;
        s_owner = msg.sender;
    }

    function totalSupply() public override view returns(uint256){
        return s_totalSupply;
    }

    function balanceOf(address account) public override view returns(uint256){
        return s_balances[account];
    }

    /** function that allows the owner to transfer the NTT  **/
    /** Others than the owner will not be able to transfer the NTT.  **/
    function transfer(address recipient, uint256 amount) public override onlyOwner() returns(bool){
        if (s_balances[msg.sender] < amount){
            revert NTTRevert("No tiene los fondos suficientes");
        }

        s_balances[msg.sender] -= amount; 
        s_balances[recipient] += amount; 
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    /** internal function that allows the user to vote with NTT token **/
    function transferVotes(address recipient, uint256 amount) internal{
        s_balances[msg.sender] -= amount; 
        s_balances[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
    }

    /** function allowing NTT burning **/
    function burn(uint256 amount) public override returns(bool){
        if (s_balances[msg.sender] < amount){
            revert NTTRevert("No tiene los fondos suficientes para quemar");
        }

        s_balances[msg.sender] -= amount;
        s_totalSupply -= amount;
        emit Burn(msg.sender, amount);
        return true;
    }
}




