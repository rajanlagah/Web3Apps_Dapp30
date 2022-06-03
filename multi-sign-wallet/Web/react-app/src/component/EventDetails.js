import React, { useState, useEffect } from "react";

import { Button, Grid, List, ListItem } from "@mui/material";
import CustomListItem from "./CustomList";

const EventDetails = ({
  eventId,
  eventVoteCount,
  eventMoneySent,
  receiverAddress,
  handleSendMoney
}) => (
  <List>
    <ListItem>
      <CustomListItem label="Event id:" value={eventId} />
    </ListItem>
    <ListItem>
      <CustomListItem label="VoteCount : " value={eventVoteCount} />
    </ListItem>
    <ListItem>
      <CustomListItem
        label="Sent Id : "
        value={JSON.stringify(eventMoneySent)}
      />
    </ListItem>
    <ListItem>
      <CustomListItem label="Receiver address : " value={receiverAddress} />
    </ListItem>
    <br />
    <ListItem style={{justifyContent:"center"}} width="100%">
    <Button onClick={handleSendMoney} width="100%">Vote</Button>
    </ListItem>
  </List>
);

export default EventDetails;
