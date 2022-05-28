const MultiSig = artifacts.require("MultiSig");

module.exports = function (deployer, _, accounts) {
  deployer.deploy(
    MultiSig, 
    1000, 
    2, 
    [accounts[0], accounts[1], accounts[2]], 
    {
      value: 1000
    }
  );
};
