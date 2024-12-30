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
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "../../lib/axios";
import { toast_error, toast_success } from "../../lib/hooks/toast";
import appSettings from "../../settings/appSettings";

export default function FriendsPage() {
  const { t } = useTranslation();
  const toast = useToast();
  const [data, setData] = useState([]);
  const [renderData, setRenderData] = useState([]);
  const [searchText, setSearchText] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get(`${appSettings.API_PROXY}/users/friends`)
      .then((resp) => {
        setData(resp?.data?.friends ?? []);
        setRenderData(resp?.data?.friends ?? []);
      })
      .catch((err) => {
        toast(toast_error(t("common.something_went_wrong")));
      });
  }, [toast, t]);

  const handleSearch = async () => {
    setRenderData(
      data.filter(
        (value) =>
          value?.username?.toLowerCase().includes(searchText.toLowerCase()) ||
          value?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
          value?.email?.toLowerCase().includes(searchText.toLowerCase()),
      ),
    );
  };

  const handleUnFriend = (friend) => {
    setLoading(true);
    axios
      .delete(`${appSettings.API_PROXY}/users/unfriend/${friend?.id}`)
      .then((resp) => {
        toast(toast_success(t("friends.accept_success")));
        setData(data.filter((x) => x.id !== friend?.id));
        setRenderData(renderData.filter((x) => x.id !== friend?.id));
      })
      .catch((err) => {
        toast(toast_error(t("common.something_went_wrong")));
      })
      .finally(() => {
        setLoading(false);
      });
  };

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
      {renderData?.length ? (
        <Flex justifyContent={"start"} my={4} mx={-2}>
          {renderData.map((item, index) => (
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
                    handleUnFriend(item);
                  }}
                  colorScheme="gray"
                  mt={2}
                >
                  {t("friends.unfriend")}
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
