import { SearchIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Card,
  Flex,
  Input,
  Link,
  Spacer,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "../../lib/axios";
import { toast_error, toast_success } from "../../lib/hooks/toast";
import appSettings from "../../settings/appSettings";

export default function FindFriend() {
  const { t } = useTranslation();
  const toast = useToast();
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState();
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    axios
      .get(`${appSettings.API_PROXY}/users/search?q=${searchText}`)
      .then((resp) => {
        setData(resp?.data?.users ?? []);
      })
      .catch((err) => {
        toast(toast_error(t("common.something_went_wrong")));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSendFriendRequest = async (user) => {
    setLoading(true);
    axios
      .post(`${appSettings.API_PROXY}/users/send-friend-request/${user?.id}`)
      .then((resp) => {
        toast(toast_success(t("friends.request_success")));
        setData(data.filter((x) => x.id !== user?.id));
      })
      .catch((err) => {
        toast(toast_error(t("common.something_went_wrong")));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const pageSize = 20;
  return (
    <Box>
      <Box position={"absolute"} right={0} top={-0.5}>
        <Input
          colorScheme="gray"
          placeholder={t("friends.find_username_email_name")}
          w={300}
          onChange={(e) => {
            setSearchText(e?.target?.value ?? "");
          }}
          fontSize={"sm"}
        />
        <Button
          isLoading={loading}
          position={"absolute"}
          top={0}
          right={0}
          zIndex={1}
          onClick={() => {
            handleSearch();
          }}
        >
          <SearchIcon />
        </Button>
      </Box>
      {data?.length ? (
        <Flex justifyContent={"start"} my={4} mx={-2}>
          {data.slice(0, pageSize).map((item, index) => (
            <Card
              key={index}
              p={4}
              boxShadow={"xs"}
              variant={"outline"}
              borderRadius={8}
              mx={2}
              overflow={"hidden"}
            >
              <Flex
                w={36}
                flexDirection={"column"}
                overflow={"hidden"}
                textOverflow="ellipsis"
                h={"100%"}
              >
                <Avatar
                  alignSelf={"center"}
                  size={"2xl"}
                  mb={2}
                  name={item.name}
                  src={`${appSettings.API_PROXY}/images/user-${item?.id ?? ""}`}
                />
                <Text
                  noOfLines={1}
                  color="gray"
                  fontSize={"sm"}
                  textAlign={"center"}
                >
                  @{item.username}
                </Text>
                <Link href={`/profile/${item.username}`}>
                  <Text fontWeight={500} noOfLines={2} textAlign={"center"}>
                    {item.name}
                  </Text>
                </Link>
                <Spacer />
                <Button
                  isLoading={loading}
                  onClick={() => {
                    handleSendFriendRequest(item);
                  }}
                  colorScheme="blue"
                >
                  {t("friends.add_friends_request")}
                </Button>
              </Flex>
            </Card>
          ))}
        </Flex>
      ) : (
        <Flex>
          <Text>{t("friends.no_users")}</Text>
        </Flex>
      )}
    </Box>
  );
}
