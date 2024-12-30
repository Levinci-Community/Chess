import React from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Image,
  VStack,
  Divider,
  Spacer,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function Item({ item }) {
  const navigate = useNavigate();
  const { title, slug, description, publisher, date, image_url } = item;

  return (
    <Flex
      p={4}
      mb={4}
      cursor="pointer"
      boxShadow="md"
      borderRadius="md"
      borderWidth="1px"
      onClick={() => navigate(`/club/blog/${slug}`)}
      _hover={{ bg: "lightgray", transition: "background-color 1s ease" }}
    >
      <Flex w="20%" justifyContent="center" alignItems="center">
        <Image src={image_url} alt={title} width="100%" objectFit="cover" />
      </Flex>
      <Spacer />
      <Flex w="75%" justifyContent="center" alignItems="center">
        <Box>
          <Heading as="h3" fontSize="xl" mb={2}>
            {title}
          </Heading>
          <Text fontSize="sm" color="gray.500" mb={2}>
            {description}
          </Text>
          <Divider my={2} />
          <Flex justify="space-between" align="center">
            <VStack align="flex-start">
              <Text fontSize="sm" color="gray.500">
                Published by {publisher} on {date}
              </Text>
            </VStack>
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
}
