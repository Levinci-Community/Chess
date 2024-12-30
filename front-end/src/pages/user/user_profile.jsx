import { Box, Container, Flex, Spacer } from "@chakra-ui/react";
import { Fragment, useEffect, useState } from "react";
import Statistics from "../../components/user_profile/statistic";
import UserInfo from "../../components/user_profile/user_info";
import { getUserData } from "../../lib/auth";
import axios from "../../lib/axios";
import { useCurrentPath } from "../../lib/hooks/route";
import appSettings from "../../settings/appSettings";

export default function UserProfile() {
  const path = useCurrentPath();
  const username = path[path.length - 1];
  const user_data = getUserData();
  const [user, setUser] = useState({});
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const getAvatarUrl = () => {
      return `${appSettings.API_PROXY}/user-${user_data.id}`;
    };

    const getUser = () => {
      if (user_data) {
        setUser({
          ...user_data,
          avatar: getAvatarUrl(),
        });
        return;
      }

      axios
        .get(`${appSettings.API_PROXY}/user/${username}`)
        .then((res) => {})
        .catch((err) => {
          console.log(err);
        });
    };
    getUser();
  }, [username, user_data]);

  useEffect(() => {
    axios
      .get(`${appSettings.API_PROXY}/player/${user_data.id}/history`)
      .then((response) => {
        setHistory(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch game history:", error);
      });
  }, [user_data.id]);

  return (
    <Fragment>
      <Container maxW="container.2xl" pt={4}>
        <Flex direction={{ base: "column", md: "row" }}>
          <Box w={{ base: "100%", md: "30%" }}>
            <UserInfo user={user} />
          </Box>
          <Spacer display={{ base: "none", md: "block" }} />
          <Box w={{ base: "100%", md: "66%" }}>
            <Statistics data={history} userId={user_data.id} />
          </Box>
        </Flex>
      </Container>
    </Fragment>
  );
}
