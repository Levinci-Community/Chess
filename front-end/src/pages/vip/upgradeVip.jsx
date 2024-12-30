import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  Heading,
  List,
  ListIcon,
  ListItem,
  Text,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import axios from "axios";
import appSettings from "../../settings/appSettings";
import { useTranslation } from "react-i18next";
import { formatNumber } from "../../lib/number";
import UpdateVipNow from "../../components/vip/updateVipNow";

export default function UpgradeVipPage() {
  const { t } = useTranslation();
  const [payUrl, setPayUrl] = useState("");
  const price = "200000";

  const handlePayment = async () => {
    try {
      const response = await axios.post(
        `${appSettings.API_PROXY}/momo_payment`,
        {
          amount: price,
        },
      );
      setPayUrl(response.data.payUrl);
      console.log(response.data);
      if (response.data.payUrl) {
        window.location.href = response.data.payUrl;
      } else {
        alert("Payment failed");
      }
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  return (
    <Container maxW="md" centerContent py={6}>
      <Card
        border="1px solid"
        borderColor="green.500"
        px={4}
        pt={12}
        boxShadow="lg"
        w="100%"
      >
        <Heading as="h1" size="lg" textAlign="center" mb={4}>
          {t("vip.title")}
        </Heading>
        <Text fontSize="md" textAlign="center" noOfLines={2} color="gray">
          {t("vip.description")}
        </Text>
        <Flex
          justifyContent="center"
          alignItems={{ base: "center", xl: "end" }}
          flexDir={{ base: "column", xl: "row" }}
          mb={4}
        >
          <Text fontSize="4xl" fontWeight="bold" color="green.500">
            {formatNumber(price)}
          </Text>
          <Text
            fontSize="sm"
            color="gray"
            fontWeight="bold"
            mx={1}
            mb={2}
            textTransform="lowercase"
          >
            vnđ / {t("vip.month")}
          </Text>
        </Flex>
        <List spacing={4} px={4} mt={4}>
          <ListItem>
            <ListIcon as={CheckIcon} color="green.500" />
            <Text noOfLines={1} display="inline">
              {t("vip.better_puzzle")}
            </Text>
            <Text ml={6} fontSize="sm" color="gray" noOfLines={2}>
              {t("vip.better_puzzle_info")}
            </Text>
          </ListItem>
          <ListItem>
            <ListIcon as={CheckIcon} color="green.500" />
            <Text noOfLines={1} display="inline">
              {t("vip.powerful_ai")}
            </Text>
            <Text ml={6} fontSize="sm" color="gray" noOfLines={2}>
              {t("vip.powerful_ai_info")}
            </Text>
          </ListItem>
          <ListItem>
            <ListIcon as={CheckIcon} color="green.500" />
            <Text noOfLines={1} display="inline">
              {t("vip.special_tag")}
            </Text>
            <Text ml={6} fontSize="sm" color="gray" noOfLines={2}>
              {t("vip.special_tag_info")}
            </Text>
          </ListItem>
        </List>
        <Button
          colorScheme="green"
          w="100%"
          mb={4}
          marginTop={5}
          onClick={handlePayment}
        >
          {t("vip.upgrade_your_vip")}
        </Button>
      </Card>
    </Container>
  );
}
