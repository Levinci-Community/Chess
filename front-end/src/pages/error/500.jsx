import React from "react";
import { Container, Heading, Text, Stack } from "@chakra-ui/react";

export default function InternalServerErrorPage() {
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
          500 Internal Server Error
        </Heading>
        <Text>
          Something went wrong on our end. Our team has been notified, and we're
          working to fix it. Please try again later.
        </Text>
      </Stack>
    </Container>
  );
}
