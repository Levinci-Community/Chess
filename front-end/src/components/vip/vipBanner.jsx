import { CheckIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  List,
  ListIcon,
  ListItem,
  Text,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FaDiamond } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { formatNumber } from "../../lib/number";

export default function VipBanner() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const price = 200000;

  return (
    <Card
      border={"1px solid"}
      borderColor={"green.500"}
      px={4}
      pt={12}
      w={"25%"}
    >
      <Heading
        as={"h2"}
        fontSize={"2xl"}
        textAlign={"center"}
        noOfLines={1}
        display={{ base: "none", lg: "block" }}
      >
        {t("vip.title")}
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
        {t("vip.description")}
      </Text>
      <Flex
        justifyContent={"center"}
        alignItems={{ base: "center", xl: "end" }}
        flexDir={{ base: "column", xl: "row" }}
      >
        <Text fontSize={"4xl"} fontWeight={"bold"} color={"green.500"}>
          {formatNumber(price)}
        </Text>
        <Text
          fontSize={"sm"}
          color={"gray"}
          fontWeight={"bold"}
          mx={1}
          mb={2}
          textTransform={"lowercase"}
        >
          vnđ / {t("vip.month")}
        </Text>
      </Flex>
      <List spacing={4} px={4} mt={4}>
        <ListItem>
          <ListIcon as={CheckIcon} color="green.500" />
          <Text noOfLines={1} display={"inline"}>
            {t("vip.better_puzzle")}
          </Text>
          <Text ml={6} fontSize={"sm"} color={"gray"} noOfLines={2}>
            {t("vip.better_puzzle_info_description")}
          </Text>
        </ListItem>
        <ListItem>
          <ListIcon as={CheckIcon} color="green.500" />
          <Text noOfLines={1} display={"inline"}>
            {t("vip.powerful_ai")}
          </Text>
          <Text ml={6} fontSize={"sm"} color={"gray"} noOfLines={2}>
            {t("vip.powerful_ai_info_description")}
          </Text>
        </ListItem>
        <Box py={1} />
        <Button
          colorScheme="green"
          w={"100%"}
          mb={4}
          leftIcon={<FaDiamond />}
          rightIcon={<FaDiamond />}
          onClick={() => navigate("/billing")}
        >
          {t("vip.upgrade_your_vip")}
        </Button>
      </List>
    </Card>
  );
}
