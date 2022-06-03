import { Grid } from "@mui/material";
import React from "react";

const CustomListItem = ({ label, value }) => (
  <Grid container>
    <Grid item xs={3}>
      {label} :
    </Grid>
    <Grid item xs={3}>
      {value}
    </Grid>
  </Grid>
);

export default CustomListItem