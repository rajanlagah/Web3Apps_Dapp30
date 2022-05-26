pragma solidity ^0.8.13;

contract Escrow{
    address payable public dev;
    address public website;
    address public customer;
    uint public amount;

    constructor( address payable _dev, address _customer,uint _amount){
        dev = _dev;
        website = msg.sender;
        customer = _customer;
        amount = _amount;

    }

    function deposit() payable public{
        require(msg.sender == customer, "Only customer can add money");
        require(address(this).balance <= amount, "Money can not exceed given amount");
    }

    function sendMoney() public{
        require(msg.sender == website, "Only website can transfer money");
        require(address(this).balance == amount, "Amount not proper"); 
        dev.transfer(amount);
    }

    function getBalance() view public returns(uint){
        return address(this).balance;
    }

}