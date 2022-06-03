import React, { useState, useEffect } from "react";

import "./App.css";
import { getWeb3 } from "./Utility";
import Multisig from "./contracts/MultiSig.json";
import CreateEventSection from "./component/CreateEvent";
import { Button, Grid, List, ListItem, Stack } from "@mui/material";
import CustomListItem from "./component/CustomList";
import EventDetails from "./component/EventDetails";

function App() {
  const [contract, setContract] = useState();
  const [eventAmount, setEventAmount] = useState();
  const [web3, setweb3] = useState();
  const [accounts, setAccounts] = useState([]);
  const [contractBalance, setcontractBalance] = useState([]);
  const [receiverAddress, setreceiverAddress] = useState([]);

  const [eventId, seteventId] = useState(0);
  const [eventVoteCount, seteventVoteCount] = useState();
  const [eventMoneySent, seteventMoneySent] = useState(false);
  const [eventAmountReceiver, seteventAmountReceiver] = useState([]);

  const getSetContract = async () => {
    const _web3 = await getWeb3();
    const _accounts = await _web3.eth.getAccounts();
    const networkId = await _web3.eth.net.getId();
    const deployedNetwork = Multisig.networks[networkId];
    const _contract = new _web3.eth.Contract(
      Multisig.abi,
      deployedNetwork && deployedNetwork.address
    );
    setweb3(_web3);
    setContract(_contract);
    setAccounts(_accounts);
    window.ethereum.on("accountsChanged", (acc) => {
      setAccounts(acc);
    });
  };

  useEffect(() => {
    getSetContract();
  }, []);

  useEffect(() => {
    if (!contract || !web3) {
      return;
    }
    const fn = async () => {
      console.log(contract.options);
      console.log(contract.options.address);
      const balance = await web3.eth.getBalance(contract.options.address);
      setcontractBalance(balance);
    };
    fn();
  }, [contract, web3]);

  const createEvent = () => {
    console.log("CLICKED createEvent");
    contract.methods
      .createEvent(receiverAddress, eventAmount)
      .send({ from: accounts[0] })
      .then(() => {
        console.log("Event Created Success");
        getSetEvent();
      })
      .catch((e) => console.log("GETTING ERROR", e));
  };

  const getSetEvent = async () => {
    if (contract) {
      const currentEventIndex =
        (await contract.methods.eventCount().call()) - 1;
      const event = await contract.methods.events(currentEventIndex).call();
      console.log(event);
      const { send_to, amount, voteCount, sent } = event;
      seteventAmountReceiver(amount);
      seteventId(currentEventIndex);
      seteventVoteCount(voteCount);
      seteventMoneySent(sent);
    }
  };

  const handleSendMoney = () => {
    console.log("CLICKED handleSendMoney");
    if (contract) {
      contract.methods
        .WithdrawMoney(eventId)
        .send({ from: accounts[0] })
        .then((res) => getSetEvent())
        .catch((e) => console.log("ERROR IN send money", e));
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div>{accounts && accounts[0]}</div>
      </header>
      <section>
        <span>{contractBalance && contractBalance}</span>
        <Grid container alignItems={'center'} justifyContent="center" height={"80vh"}>
          <Grid item sm={8} md={6}>
            {eventId > 0 && (
              <EventDetails
                eventId={eventId}
                eventVoteCount={eventVoteCount}
                eventMoneySent={eventMoneySent}
                receiverAddress={receiverAddress}
                handleSendMoney={handleSendMoney}
              />
            )}
            {eventId == 0 && <span> No Event Found</span>}
          </Grid>
          <Grid item sm={12} md={6} >
            <CreateEventSection
              eventAmount={eventAmount}
              setEventAmount={setEventAmount}
              setreceiverAddress={setreceiverAddress}
              createEvent={createEvent}
              receiverAddress={receiverAddress}
            />
          </Grid>
        </Grid>
      </section>
      <br />
    </div>
  );
}

export default App;
