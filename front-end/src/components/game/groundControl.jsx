import React from "react";
import { Grid, GridItem } from "@chakra-ui/react";
import {
  RepeatIcon,
  ArrowBackIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowForwardIcon,
} from "@chakra-ui/icons";

export default function GroundControl() {
  function flip() {
    alert("flip");
  }

  function fast_backward() {
    alert("fast_backward");
  }

  function step_backward() {
    alert("step_backward");
  }

  function step_forward() {
    alert("step_toward");
  }

  function fast_forward() {
    alert("fast_forward");
  }

  return (
    <Grid
      templateColumns="repeat(5, 3rem)"
      justifyContent="space-between"
      bgColor={"lightgray"}
      overflow={"hidden"}
      borderRadius={4}
      w={"100%"}
    >
      <GridItem
        onClick={fast_backward}
        cursor="pointer"
        bgColor="lightgray"
        height="3rem"
        width="3rem"
        alignItems="center"
        justifyContent="center"
        display="flex"
        _hover={{ bgColor: "lightgreen" }}
      >
        <ArrowBackIcon />
      </GridItem>
      <GridItem
        onClick={step_backward}
        cursor="pointer"
        bgColor="lightgray"
        height="3rem"
        width="3rem"
        alignItems="center"
        justifyContent="center"
        display="flex"
        _hover={{ bgColor: "lightgreen" }}
      >
        <ChevronLeftIcon boxSize="1.2rem" />
      </GridItem>
      <GridItem
        onClick={flip}
        cursor="pointer"
        bgColor="lightgray"
        height="3rem"
        width={"3rem"}
        alignItems="center"
        justifyContent="center"
        display="flex"
        _hover={{ bgColor: "lightgreen" }}
      >
        <RepeatIcon />
      </GridItem>
      <GridItem
        onClick={fast_forward}
        cursor="pointer"
        bgColor="lightgray"
        height="3rem"
        width="3rem"
        alignItems="center"
        justifyContent="center"
        display="flex"
        _hover={{ bgColor: "lightgreen" }}
      >
        <ChevronRightIcon boxSize="1.2rem" />
      </GridItem>
      <GridItem
        onClick={step_forward}
        cursor="pointer"
        bgColor="lightgray"
        height="3rem"
        width="3rem"
        alignItems="center"
        justifyContent="center"
        display="flex"
        _hover={{ bgColor: "lightgreen" }}
      >
        <ArrowForwardIcon />
      </GridItem>
    </Grid>
  );
}
