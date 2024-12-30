import {
  Container,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import React, { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import FindFriend from "../../components/friends/findFriend";
import FriendRequests from "../../components/friends/friend_requests";
import FriendsList from "../../components/friends/friends_list";

const FriendsPage = () => {
  const { t } = useTranslation();

  const [tabIndex, setTabIndex] = useState(0);
  const handleTabChange = (index) => {
    setTabIndex(index);
  };

  return (
    <Fragment>
      <Container maxW="container.2xl" py={4}>
        <Heading fontSize={"xl"} mb={4}>
          {t("friends.heading")}
        </Heading>
        <Tabs onChange={handleTabChange} index={tabIndex} colorScheme="teal">
          <TabList>
            <Tab>{t("friends.friends_list")}</Tab>
            <Tab>{t("friends.friends_request")}</Tab>
            <Tab>{t("friends.find_friends")}</Tab>
          </TabList>

          <TabPanels minH={400}>
            <TabPanel>
              <FriendsList />
            </TabPanel>
            <TabPanel>
              <FriendRequests />
            </TabPanel>
            <TabPanel>
              <FindFriend />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </Fragment>
  );
};

export default FriendsPage;
