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
    mapping (address => bool) s_users;
    uint256 public s_totalSupply;
    address public s_owner;


    constructor (uint256 initialSupply) {
        s_totalSupply = initialSupply;
        s_balances[address(this)] = initialSupply;
        s_owner = msg.sender;
    }

    function mintNTT() public {
        require(s_users[msg.sender] == false, "");
        s_balances[address(this)] -= 1;
        s_balances[msg.sender] += 1;
        s_users[msg.sender] = true;
    }
    
    function balanceOf(address account) public override view returns(uint256){
        return s_balances[account];
    }

    /** function that allows the owner to transfer the NTT  **/
    /** Others than the owner will not be able to transfer the NTT.  **/
    function transfer(address recipient, uint256 amount) public override onlyOwner() returns(bool){
        if (s_balances[msg.sender] < amount){
            revert NTTRevert("Insufficient funds");
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
            revert NTTRevert("Does not have sufficient funds to burn");
        }

        s_balances[msg.sender] -= amount;
        s_totalSupply -= amount;
        emit Burn(msg.sender, amount);
        return true;
    }
}




