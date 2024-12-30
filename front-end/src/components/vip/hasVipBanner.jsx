import { CheckIcon } from "@chakra-ui/icons";
import {
  Box,
  Card,
  Heading,
  List,
  ListIcon,
  ListItem,
  Text,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

export default function HasVipBanner() {
  const { t } = useTranslation();

  return (
    <Card border={"1px solid"} borderColor={"green.500"} px={4} pt={12}>
      <Heading
        as={"h2"}
        fontSize={"2xl"}
        textAlign={"center"}
        noOfLines={1}
        display={{ base: "none", lg: "block" }}
      >
        {t("vip.title")}
      </Heading>

      <Text
        fontSize={"2xl"}
        fontWeight={"bold"}
        color={"green.500"}
        align={"center"}
        py={4}
      >
        {t("vip.your_vip_is_active")}
      </Text>
      <List spacing={4} px={4} mt={4}>
        <ListItem>
          <ListIcon as={CheckIcon} color="green.500" />
          <Text noOfLines={1} display={"inline"}>
            {t("vip.better_puzzle")}
          </Text>
          <Text ml={6} fontSize={"sm"} color={"gray"} noOfLines={2}>
            {t("vip.better_puzzle_info")}
          </Text>
        </ListItem>
        <ListItem>
          <ListIcon as={CheckIcon} color="green.500" />
          <Text noOfLines={1} display={"inline"}>
            {t("vip.powerful_ai")}
          </Text>
          <Text ml={6} fontSize={"sm"} color={"gray"} noOfLines={2}>
            {t("vip.powerful_ai_info")}
          </Text>
        </ListItem>
        <Box py={1} />
      </List>
    </Card>
  );
}
