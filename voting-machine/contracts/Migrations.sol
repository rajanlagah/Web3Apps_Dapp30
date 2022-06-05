// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract VoteMachine {
    uint256 public maxElectionId = 0;
    address public OWNER;

    struct Election {
        uint256 id;
        uint256 age;
        address[] allowedVoters;
        uint256 voteCount;
        uint256 numberOfCategories;
        uint256[] categoryVoteCount;
    }

    mapping(address => mapping(uint256 => bool)) votingRecord;
    // Election[] public ElectionHistory;
    mapping(uint256 => Election) public ElectionHistory;

    constructor() {
        OWNER = msg.sender;
    }

    modifier onlyContractCreator() {
        require(msg.sender == OWNER, "Only Owner");
        _;
    }

    function createElection(
        address[] memory _allowedVoters,
        uint256 age,
        uint256 _numberOfCategories
    ) public onlyContractCreator {
        ElectionHistory[maxElectionId].id = maxElectionId;
        ElectionHistory[maxElectionId].age = block.timestamp + age;
        ElectionHistory[maxElectionId].voteCount = 0;
        ElectionHistory[maxElectionId].numberOfCategories = _numberOfCategories;

        for (uint256 i = 0; i < _allowedVoters.length; i++) {
            ElectionHistory[maxElectionId].allowedVoters.push(
                _allowedVoters[i]
            );
        }

        for (uint256 i = 0; i < _numberOfCategories; i++) {
            ElectionHistory[maxElectionId].categoryVoteCount.push(0);
        }

        maxElectionId++;
    }

    function checkUserIfVoteExist(address voterAddress)
        public
        view
        returns (bool)
    {
        bool is_valid_user = false;

        for (
            uint256 i = 0;
            i < ElectionHistory[maxElectionId - 1].allowedVoters.length;
            i++
        ) {
            if (
                ElectionHistory[maxElectionId - 1].allowedVoters[i] ==
                voterAddress
            ) {
                is_valid_user = true;
                break;
            }
        }
        return is_valid_user;
    }

    function registerVote(uint256 _eventId, uint256 categoryId) external {
        require(_eventId < maxElectionId, "Election Does not exist");
        require(_eventId == (maxElectionId - 1), "Invalid Action");
        require(
            ElectionHistory[_eventId].age > block.timestamp,
            "Election ended"
        );
        require(
            ElectionHistory[_eventId].numberOfCategories >= categoryId,
            "Category dont exists"
        );
        require(checkUserIfVoteExist(msg.sender), "User not in voting list");
        require(
            votingRecord[msg.sender][_eventId] == false,
            "User already voted"
        );
        votingRecord[msg.sender][_eventId] = true;
        ElectionHistory[_eventId].categoryVoteCount[categoryId]++;
    }

    function getCategoryId(uint256 _eventId)
        public
        view
        onlyContractCreator
        returns (uint256[] memory)
    {
        require(_eventId < maxElectionId, "Election Does not exist");
        require(_eventId == (maxElectionId - 1), "Invalid Action");
        return ElectionHistory[_eventId].categoryVoteCount;
    }
}
