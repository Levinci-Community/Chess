import {
  Divider,
  Flex,
  HStack,
  Link,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";

export default function NavList({ list, heading, icon }) {
  return (
    <>
      <HStack>
        <Flex mb={2} alignItems="center">
          {icon}
          <Text fontSize="lg" fontWeight={"bold"} noOfLines={1}>
            {heading}
          </Text>
        </Flex>
        <Divider borderColor="black" flex={1} />
      </HStack>
      <UnorderedList mb={4}>
        {list.map((item) => (
          <ListItem key={item._id} item={item} w="100%">
            <Link
              display="block"
              w="100%"
              href={item.href}
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              fontSize={"md"}
            >
              {item.text}
            </Link>
          </ListItem>
        ))}
      </UnorderedList>
    </>
  );
}
