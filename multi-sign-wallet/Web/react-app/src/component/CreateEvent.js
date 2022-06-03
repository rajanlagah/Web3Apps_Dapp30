import React from "react";
import TextField from "@mui/material/TextField";

import { Button, Grid, Stack } from "@mui/material";
import { Container } from "@mui/system";

const CreateEventSection = ({
  eventAmount,
  setEventAmount,
  setreceiverAddress,
  createEvent,
  receiverAddress
}) => (
  <Container maxWidth="sm">
    <h1>Create Event</h1>
    <Stack spacing={2}>
      <TextField
        id="amount"
        label="Event amount"
        value={eventAmount}
        onChange={(e) => setEventAmount(e.target.value)}
        variant="standard"
      />
      <br />
      <TextField
        id="receiver address"
        label="Receiver address"
        value={receiverAddress}
        onChange={(e) => setreceiverAddress(e.target.value)}
        variant="standard"
      />
    </Stack>
    <br />
    <br />
    <Button variant="outlined" onClick={createEvent}>
      Create Event
    </Button>
  </Container>
);

export default CreateEventSection;
