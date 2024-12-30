import { CheckIcon } from "@chakra-ui/icons";
import {
  Box,
  Card,
  Flex,
  Heading,
  List,
  ListIcon,
  ListItem,
  Text,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

export default function NoVipBanner() {
  const { t } = useTranslation();

  return (
    <Card border={"1px solid"} borderColor={"gray"} px={4} pt={12} w={"25%"}>
      <Heading
        as={"h2"}
        fontSize={"2xl"}
        textAlign={"center"}
        noOfLines={1}
        display={{ base: "none", lg: "block" }}
      >
        {t("vip.title_free")}
      </Heading>
      <Heading
        as={"h2"}
        fontSize={"2xl"}
        textAlign={"center"}
        noOfLines={1}
        display={{ base: "block", lg: "none" }}
      >
        VIP
      </Heading>
      <Text fontSize={"md"} textAlign={"center"} noOfLines={2} color={"gray"}>
        {t("vip.description_free")}
      </Text>
      <Flex
        justifyContent={"center"}
        alignItems={{ base: "center", xl: "end" }}
        flexDir={{ base: "column", xl: "row" }}
      >
        <Text fontSize={"4xl"} fontWeight={"bold"} color={"gray"}>
          {t("vip.free")}
        </Text>
      </Flex>
      <List spacing={4} px={4} mt={4}>
        <ListItem>
          <ListIcon as={CheckIcon} color="gray" />
          <Text noOfLines={1} display={"inline"}>
            {t("vip.free_puzzle")}
          </Text>
          <Text ml={6} fontSize={"sm"} color={"gray"} noOfLines={2}>
            {t("vip.free_puzzle_info")}
          </Text>
        </ListItem>
        <ListItem>
          <ListIcon as={CheckIcon} color="gray" />
          <Text noOfLines={1} display={"inline"}>
            {t("vip.basic_ai")}
          </Text>
          <Text ml={6} fontSize={"sm"} color={"gray"} noOfLines={2}>
            {t("vip.basic_ai_info")}
          </Text>
        </ListItem>
        <ListItem>
          <ListIcon as={CheckIcon} color="gray" />
          <Text noOfLines={1} display={"inline"}>
            {t("vip.normal_tag")}
          </Text>
          <Text ml={6} fontSize={"sm"} color={"gray"} noOfLines={2}>
            {t("vip.normal_tag_info")}
          </Text>
        </ListItem>
        <Box py={1} />
      </List>
    </Card>
  );
}
