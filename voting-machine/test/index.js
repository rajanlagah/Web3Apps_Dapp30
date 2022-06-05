const VoteMachine = artifacts.require("VoteMachine");

const checkError = async (promis, expectedErr) => {
  try {
    await promis;
  } catch (e) {
    assert(e.message.includes(expectedErr));
    return;
  }
  assert(false);
};

contract("VoteMachine", (accounts) => {
  let voteMachine = null;
  const [Owner, voter1, voter2, voter3] = accounts;
  before(async () => {
    voteMachine = await VoteMachine.deployed();
  });

  it("Should have correct owner", async () => {
    const contractOwner = await voteMachine.OWNER();
    expect(contractOwner == accounts[0]);
  });

  it("Should check create election", async () => {
    const contractOwner = await voteMachine.createElection(
      [voter1, voter2, voter3],
      1000,
      2,
      {
        from: Owner
      }
    );
    const ElectionDetails = await voteMachine.ElectionHistory(0);
    expect(
      ElectionDetails.id == 0 &&
        ElectionDetails.age >= Date.now() &&
        ElectionDetails.voteCount == 0 &&
        ElectionDetails.numberOfCategories == 2
    );
  });
  it("Should fail create election", async () => {
    checkError(
      voteMachine.createElection([voter1, voter2, voter3], 1000, 2, {
        from: voter1
      }),
      "Only Owner"
    );
  });

  it("Should check if given voter is in voter list", async () => {
    const resp = await voteMachine.checkUserIfVoteExist(voter1);
    expect(resp == true);
  });

  it("Should check if given non voter is not in voter list", async () => {
    const resp = await voteMachine.checkUserIfVoteExist(Owner);
    expect(resp == false);
  });
  it("Should vote cast by voter", async () => {
    const contractOwner = await voteMachine.registerVote(0, 0, {
      from: voter1
    });
    const ElectionDetails = await voteMachine.getCategoryId(0);
    expect(ElectionDetails[0] == 1);
  });

  it("Should vote cast by non voter", async () => {
    checkError(
      voteMachine.registerVote(0, 0, {
        from: Owner
      }),
      "User not in voting list"
    );
  });
});
