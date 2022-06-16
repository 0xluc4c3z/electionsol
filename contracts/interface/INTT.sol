//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

/** NTT token interface **/
interface INTT{
    
    /** returns number of tokens for an address specified by parameter **/
    function balanceOf(address account) external view returns(uint256);

    /** returns a boolean value resulting from the specified operation **/
    function transfer(address recipient, uint256 amount) external returns(bool);
    
    /** returns a boolean with the result of the token burn performed**/
    function burn(uint256 amount) external returns(bool);

    /** event to be emitted when a quantity of tokens passes from a source to a destination **/
    event Transfer(address indexed from, address indexed to, uint256 amount);

    /** event to be issued when an amount of tokens is burned **/
    event Burn(address indexed burner, uint256 value);

    /** error indicating why revert the function **/
    error NTTRevert(string messege);
}
