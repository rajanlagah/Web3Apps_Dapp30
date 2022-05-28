const { expectRevert } = require("@openzeppelin/test-helpers");
const { web3 } = require("@openzeppelin/test-helpers/src/setup");

const MultiSign = artifacts.require("MultiSig");

const checkError = async (promis, expectedErr) => {
  try {
    await promis;
  } catch (e) {
    assert(e.message.includes(expectedErr));
    return;
  }
  assert(false);
};

contract("MultiSign", (accounts) => {
  let contract = null;
  const [admin1, admin2, admin3, user] = accounts;

  before(async () => {
    contract = await MultiSign.deployed();
  });

  it("create event", async () => {
    await contract.createEvent(user, 1000, { from: admin1 });

    const newEvent = await contract.events(0);
    const eventCount = await contract.eventCount();
    assert(
      eventCount.toNumber() == 1 &&
        newEvent.sent == false &&
        newEvent.send_to == user &&
        newEvent.amount == 1000 &&
        newEvent.voteCount == 0
    );
  });

  it("should not create event", async () => {
    // await contract.createEvent(user, 1000,{from:user})
    await expectRevert(
      contract.createEvent(user, 1000, { from: user }),
      "User not Admin"
    );
  });

  it("Dont Withdraw money", async () => {
    await contract.createEvent(user, 1000, { from: admin1 });
    const preUserBalance = web3.utils
      .toBN(await web3.eth.getBalance(user))
      .toString();
    await contract.WithdrawMoney(1, { from: admin1 });
    const postUserBalance = web3.utils
      .toBN(await web3.eth.getBalance(user))
      .toString();
    assert(postUserBalance == preUserBalance);
  });

  it("Withdraw money success", async () => {
    const preUserBalance = web3.utils.toBN(await web3.eth.getBalance(user));
    await contract.createEvent(user, 1000, { from: admin1 });

    await contract.WithdrawMoney(2, { from: admin1 });
    await contract.WithdrawMoney(2, { from: admin2 });
    const postUserBalance = web3.utils.toBN(await web3.eth.getBalance(user));
    assert(postUserBalance.sub(preUserBalance).toString() == "1000");
  });
});
