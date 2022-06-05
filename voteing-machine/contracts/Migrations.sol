pragma solidity ^0.8.0;

contract VoteMachine {
    uint public maxElectionId = 0;
    address public OWNER;

    struct Election {
        uint id;
        uint age;
        address[] allowedVoters;
        uint voteCount;
        uint numberOfCategories;
        uint[] categoryVoteCount;
    }

    mapping(address => mapping( uint => bool)) votingRecord;
    // Election[] public ElectionHistory;
    mapping( uint => Election) public ElectionHistory;
    constructor(){
        OWNER = msg.sender;
    }

    modifier onlyContractCreator(){
        require(msg.sender == OWNER, "Only Owner");
        _;
    }

    function createElection(
            address[] memory _allowedVoters,
            uint age, 
            uint _numberOfCategories
        ) 
        public 
        onlyContractCreator(){
        ElectionHistory[maxElectionId].id = maxElectionId;
        ElectionHistory[maxElectionId].age = block.timestamp + age;
        ElectionHistory[maxElectionId].voteCount = 0;
        ElectionHistory[maxElectionId].numberOfCategories = _numberOfCategories;

        for(uint i =0; i < _allowedVoters.length ; i++){
            ElectionHistory[maxElectionId].allowedVoters.push(_allowedVoters[i]);
        }

         for(uint i =0; i < _numberOfCategories ; i++){
            ElectionHistory[maxElectionId].categoryVoteCount.push(0);
        }

        maxElectionId++;
    }

    function checkUserIfVoteExist(address voterAddress) view private returns(bool){
        bool is_valid_user = false;

        for(uint i =0; i < ElectionHistory[maxElectionId - 1].allowedVoters.length ; i++){
            if(ElectionHistory[maxElectionId - 1].allowedVoters[i] == voterAddress){
                is_valid_user = true;
                break;
            }
        }
        return is_valid_user;
    }

    function registerVote(uint _eventId, uint categoryId) external {
        require(_eventId < maxElectionId, "Election Does not exist");
        require(_eventId == (maxElectionId - 1), "Invalid Action");
        require(ElectionHistory[_eventId].age > block.timestamp, "Election ended");
        require(ElectionHistory[_eventId].numberOfCategories >= categoryId, "Category dont exists");
        require(checkUserIfVoteExist(msg.sender), "User not in voting list");
        require(votingRecord[msg.sender][_eventId] == false, "User already voted");
        votingRecord[msg.sender][_eventId] = true;
        ElectionHistory[_eventId].categoryVoteCount[categoryId]++;
    }
    
    function getCategoryId(uint _eventId) view public onlyContractCreator() returns(uint[] memory){
        require(_eventId < maxElectionId, "Election Does not exist");
        require(_eventId == (maxElectionId - 1), "Invalid Action");
        return ElectionHistory[_eventId].categoryVoteCount;
    }
}