const Escrow = artifacts.require("Escrow");

const checkError = async (promis, expectedErr) => {
  try {
    await promis;
  } catch (e) {
    assert(e.message.includes(expectedErr));
    return;
  }
  assert(false);
};

contract("Escrow", (accounts) => {
  let escrow = null;
  const [website, dev, customer] = accounts;
  before(async () => {
    escrow = await Escrow.deployed();
  });

  it("Will test deposite success", async () => {
    await escrow.deposit({ from: customer, value: 1000 });
    const balanceInContract = await web3.eth.getBalance(escrow.address);
    console.log("balanceInContract ",balanceInContract)
    assert(balanceInContract == 1000);
  });

  it("Will check deposite exceed amount", async () => {
    checkError(
      escrow.deposit({ from: customer, value: 2000 }),
      "Money can not exceed given amount"
    );
  });

  it("Will check non customer amount deposite", async () => {
    checkError(
      escrow.deposit({ from: customer, value: 2000 }),
      "Only customer can add money"
    );
  });
 

  it("Check money send", async ()=>{
    try{
      const prevDevBalance = web3.utils.toBN(await web3.eth.getBalance(dev))
      await escrow.deposit({ from: customer, value: 1000 });
      await escrow.sendMoney({from:accounts[0]})
      console.log("SOMETHING 1",website)
      const newDevBalance = web3.utils.toBN(await web3.eth.getBalance(dev))
      assert("1000" == newDevBalance.sub(prevDevBalance).toString())
      return
    }catch(e){
      assert(false)
      console.log("ERRORR",e)
    }
  })

  it("Check money send for non website owner", async ()=>{
    checkError (
      escrow.sendMoney({from:dev}) ,
      "Only website can transfer money"
    )
  })


  it("Check money send when contract balance not equal to amount", async ()=>{
    checkError (
      escrow.sendMoney({from:website, value:20000}) ,
      "Amount not proper"
    )
  })

});
