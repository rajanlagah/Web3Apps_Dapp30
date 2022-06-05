const VoteMachine = artifacts.require("VoteMachine");

module.exports = function (deployer,_,accounts) {
  deployer.deploy(VoteMachine,{from:accounts[0]});
};
