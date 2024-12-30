import React from "react";
import { Grid, GridItem } from "@chakra-ui/react";

export default function GameAction() {
  function offer_draw() {
    alert("offer_draw");
  }

  function resign() {
    alert("resign");
  }

  return (
    <Grid templateColumns="repeat(2, 1fr)">
      <GridItem
        onClick={offer_draw}
        cursor="pointer"
        bgColor="#bababa"
        height="3rem"
        alignItems="center"
        justifyContent="center"
        display="flex"
        _hover={{ bgColor: "lightgreen" }}
      >
        Draw
      </GridItem>
      <GridItem
        onClick={resign}
        cursor="pointer"
        bgColor="#bababa"
        height="3rem"
        alignItems="center"
        justifyContent="center"
        display="flex"
        _hover={{ bgColor: "lightgreen" }}
      >
        Resign
      </GridItem>
    </Grid>
  );
}
