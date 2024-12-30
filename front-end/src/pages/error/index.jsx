import React from "react";
import { Container, Heading, Text, Stack } from "@chakra-ui/react";

export default function ErrorPage() {
  return (
    <Container
      maxW="lg"
      py={{
        base: "12",
        md: "24",
      }}
      px={{
        base: "0",
        sm: "8",
      }}
    >
      <Stack spacing="8" textAlign="center">
        <Heading size="xl" color="red.500">
          Oops! Something went wrong.
        </Heading>
        <Text>
          We're sorry, but there was an error processing your request. Please
          try again later.
        </Text>
      </Stack>
    </Container>
  );
}
