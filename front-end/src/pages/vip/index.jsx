import { Box, Container, Flex, Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import NoVipBanner from "../../components/vip/noVipBanner";
import VipBanner from "../../components/vip/vipBanner";

export default function VipPage() {
  const { t } = useTranslation();
  return (
    <Container maxW="container.2xl" py={4}>
      <Heading textAlign={"center"} my={8} fontSize={"3xl"}>
        {t("vip.compare_your_plan")}
      </Heading>
      <Flex justifyContent={"center"} pb={8}>
        <NoVipBanner />
        <Box w={"6%"} />
        <VipBanner />
      </Flex>
    </Container>
  );
}
