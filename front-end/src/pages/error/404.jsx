import React from "react";
import { Container, Heading, Text, Stack, Link } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

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
          404 Not Found
        </Heading>
        <Text>
          The page you are looking for might be in another castle.{" "}
          <Link color="darkcyan" onClick={() => navigate("/")}>
            Go back home
          </Link>
        </Text>
      </Stack>
    </Container>
  );
}
