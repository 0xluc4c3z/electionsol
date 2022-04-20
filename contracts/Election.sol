//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "../contracts/NTT.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Election is NTT{

    using Counters for Counters.Counter;
    
    /** structure of a candidate **/
    struct Candidate{
        uint256 id;
        string name;
        uint256 voteCount;
    }

    /** counter used to generate id to candidates **/
    Counters.Counter s_idCandidate;
    /** time indicating the moment when the election begins **/
    uint256 s_timeStarted;
    /** address to which NTTs will be sent once the vote has been cast **/
    address public s_VotesCompleted = 0x5dfFc7193E1aa005d4d856B50a3F7da1f07d30c6;
    
    /** relationship between id and candidate structure **/
    mapping(uint256 => Candidate) s_candidate;
    /** mapping that checks if an address has already cast its vote **/
    /** this allows an address to vote only once **/
    mapping(address => bool) s_voters;

    error ElectionRevert(string message);
    event votedEvent(uint256 indexed _idCandidate);
    event createdCand(string _name);

    /** The number of NTTs to be used for voting is indicated **/
    constructor() NTT(45000000){
        s_owner = msg.sender;
    }

    /** Function that adds candidates to the election  **/
    function addCandidate(string memory _name) public onlyOwner(){
        if (block.timestamp < s_timeStarted){
            revert ElectionRevert("La votacion ah comenzado, no es posible agregar candidatos durante la misma");
        }

        s_idCandidate.increment();
        uint256 idCandidate = s_idCandidate.current();
        s_candidate[idCandidate] = Candidate(idCandidate, _name, 0);

        emit createdCand(_name);
    }

    /** Function that starts the election time  **/
    /** once started, it cannot be changed until it is completed  **/
    function timeElection() public onlyOwner(){
        if (block.timestamp < s_timeStarted){
            revert ElectionRevert("La votacion ah comenzado, no es posible cambiar el tiempo hasta su finalizacion");
        }

        s_timeStarted = block.timestamp + 1 days;
    }

    /** function for a user to make a vote  **/ 
    /** a user can only vote once, and it must contain the NTT  **/ 
    function vote(uint256 _id) public{
        if (block.timestamp > s_timeStarted){
            revert ElectionRevert("La votacion no ah comenzado/ ah terminado");
        }
        if (s_voters[msg.sender]){
            revert ElectionRevert("Solo es posible votar una vez");
        }
        if (1 > balanceOf(msg.sender)){
            revert ElectionRevert("No cuenta con el NTT para votar");
        }
        if (_id < 0 && _id > s_idCandidate.current()){
            revert ElectionRevert("El id de candidato ingresado no es correcto");
        }

        transferVotes(s_VotesCompleted, 1);

        s_voters[msg.sender] = true;

        s_candidate[_id].voteCount++;

        emit votedEvent(_id);
    }

    /** function that allows you to view information about the candidates  **/ 
    function seeVotes(uint256 _id) public view returns(Candidate memory){
        return s_candidate[_id];
    }



}