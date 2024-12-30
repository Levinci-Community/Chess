import { AspectRatio, Box, Container, Flex, Spacer } from "@chakra-ui/react";
import React, { Fragment } from "react";
import LeftNav from "../../components/nav/leftNav";
import ToturialBox from "../../components/toturial/toturialBox";
import UpdateVipNow from "../../components/vip/updateVipNow";
import { getUserData } from "../../lib/auth";
import appSettings from "../../settings/appSettings";

export default function InfinityPage() {
  const user = getUserData();
  const token = btoa(user?.id ?? "");

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

          <Box w={{ base: "100%", md: "50%" }} mb={{ base: 8, md: 0 }}>
            <AspectRatio
              w={"100%"}
              ratio={1}
              overflow={"hidden"}
              borderRadius={8}
            >
              <iframe
                title="iframe"
                src={`${appSettings.API_PROXY}/blitz-tactics/infinity?token=${token}`}
                allowFullScreen
              />
            </AspectRatio>
          </Box>

          <Spacer display={{ base: "none", md: "block" }} />

          <Box w={{ base: "100%", md: "24%" }}>
            <UpdateVipNow />
            <Box>
              <ToturialBox name={"infinity"} />
            </Box>
          </Box>
        </Flex>
      </Container>
    </Fragment>
  );
}
