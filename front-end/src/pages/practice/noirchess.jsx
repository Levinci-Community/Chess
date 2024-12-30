import { AspectRatio, Box, Container, Flex, Spacer } from "@chakra-ui/react";
import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
import LeftNav from "../../components/nav/leftNav";
import UpdateVipNow from "../../components/vip/updateVipNow";

export default function NoirchessPage() {
  const { t } = useTranslation();

  return (
    <Fragment>
      <Container maxW="container.2xl" py={4}>
        <Flex direction={{ base: "column", md: "row" }}>
          <Box
            w={{ base: "0%", md: "24%" }}
            display={{ base: "none", md: "block" }}
          >
            <LeftNav />
          </Box>

          <Spacer />

          <Box w={{ base: "100%", md: "48%" }} mb={{ base: 8, md: 0 }}>
            <AspectRatio
              w={"100%"}
              ratio={1}
              overflow={"hidden"}
              borderRadius={8}
            >
              <iframe
                title="iframe"
                src="http://www.noirchess.com/Game/www/index.html"
                allowFullScreen
              />
            </AspectRatio>
          </Box>

          <Spacer display={{ base: "none", md: "block" }} />

          <Box w={{ base: "100%", md: "24%" }}>
            <UpdateVipNow />
            <Box>{t("practices.toturial")}</Box>
          </Box>
        </Flex>
      </Container>
    </Fragment>
  );
}
