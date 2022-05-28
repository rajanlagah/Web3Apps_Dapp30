// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MultiSig {

    uint public amount;
    uint public eventCount = 0;
    uint public minNumberOfVotes;
    address[] public adminUsers;

    mapping(address => mapping(uint => bool)) votingRecord; // for admin voting
    struct TransectionEvent {
        bool sent;
        address payable send_to;
        uint voteCount;
        uint amount;
    }
    mapping(uint => TransectionEvent) public events;
    // TransectionEvent[] events;

    constructor(uint _amount,  uint _minNumberOfVotes,address[] memory _adminUsers) payable{
        amount = _amount;
        minNumberOfVotes = _minNumberOfVotes;
        adminUsers = _adminUsers;
    }

    function createEvent(address payable _send_to,uint _amount) onlyAdmin() external {
        events[eventCount] = TransectionEvent(false,_send_to,0,_amount);
        eventCount++;
    }

    function WithdrawMoney( uint eventId) onlyAdmin() external{
        // require(votingRecord[msg.sender][eventId] == false ,"Admin already voted");
        require(events[eventId].sent == false, "Event Already Executed");
        // require(eventCount >= eventId, "Event not found");
        if(votingRecord[msg.sender][eventId] == false){
            votingRecord[msg.sender][eventId] = true;
            events[eventId].voteCount++;
        }
        if(events[eventId].voteCount >= minNumberOfVotes){
            address payable to = events[eventId].send_to;
            uint amt = events[eventId].amount;
            to.transfer(amt);
            events[eventId].sent = true;
        }
    }

    modifier onlyAdmin(){
        bool allowed = false;
        for(uint i = 0; i < adminUsers.length; i++){
            if(msg.sender == adminUsers[i]){
                allowed = true;
                // break;
            }
        }
        require(allowed == true,"User not Admin");
        _;
    }
}