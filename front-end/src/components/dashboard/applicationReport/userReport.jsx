import { Box, Card, Flex, Heading, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FaUsers } from "react-icons/fa";
import RatingChart from "./userReport/ratingChart";
import RoleChart from "./userReport/roleChart";
import VerifyChart from "./userReport/verifyChart";
import ViolentChart from "./userReport/violentChart";

export default function UserReport({ data }) {
  const { t } = useTranslation();
  const theme = localStorage.getItem("theme");
  return (
    <Card
      filter="auto"
      brightness="98%"
      p={1}
      variant={"outline"}
      overflow={"hidden"}
      borderRadius={4}
      mb={2}
      minH={120}
    >
      <Heading
        as={"h5"}
        fontSize={"md"}
        display={"flex"}
        alignItems={"center"}
        mb={1}
      >
        <FaUsers style={{ marginRight: 4 }} />
        {t("dashboard.user_report")}
      </Heading>
      <Flex w={"100%"}>
        <Box w={"50%"}>
          <Text fontSize={"sm"} fontWeight={"bold"}>
            {t("dashboard.total_users")}
          </Text>
          <Text fontSize={"4xl"} fontWeight={"bold"} textAlign={"left"}>
            {data?.count}
          </Text>
        </Box>
      </Flex>
      <Flex>
        <Box w={"50%"}>
          <VerifyChart theme={theme} data={data?.vefify} />
        </Box>
        <Box w={"50%"}>
          <ViolentChart theme={theme} data={data?.lock} />
        </Box>
      </Flex>
      <Flex>
        <Box w={"50%"}>
          <RoleChart theme={theme} data={data?.role} />
        </Box>
        <Box w={"50%"}>
          <RatingChart theme={theme} data={data?.rating} />
        </Box>
      </Flex>
    </Card>
  );
}
