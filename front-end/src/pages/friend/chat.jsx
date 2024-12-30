import { SearchIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Card,
  Container,
  Flex,
  Heading,
  Input,
  Spacer,
  Text,
  useToast,
} from "@chakra-ui/react";
import { CometChat } from "@cometchat-pro/chat";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoSend } from "react-icons/io5";
import { getUserData } from "../../lib/auth";
import axios from "../../lib/axios";
import { toast_error } from "../../lib/hooks/toast";
import appSettings from "../../settings/appSettings";

export default function FriendPage(props) {
  const { t } = useTranslation();
  const toast = useToast();
  const theme = localStorage.getItem("theme");
  const user = getUserData();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [friends, setFriends] = useState([]);
  const [renderFriends, setRenderFriends] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const loadMessage = useCallback(async (receiver) => {
    if (!receiver) return;

    const limit = 30;
    const messagesRequest = new CometChat.MessagesRequestBuilder()
      .setUID(receiver.id)
      .setLimit(limit)
      .build();

    messagesRequest.fetchPrevious().then(
      (messageList) => {
        setMessages(messageList?.filter((m) => m.type === "text") ?? []);
      },
      (error) => {
        console.log("Message fetching failed with error:", error);
      },
    );
  }, []);

  const sendMessage = async () => {
    if (text.trim() === "") return;

    let receiverType = "user";
    let message = new CometChat.TextMessage(
      selectedUser.id,
      text,
      receiverType,
    );

    try {
      const sentMessage = await CometChat.sendMessage(message);
      setMessages((prev) => [...prev, sentMessage]);
      setText("");
    } catch (error) {
      console.error("Message sending failed with error:", error);
    }
  };

  useEffect(() => {
    axios
      .get(`${appSettings.API_PROXY}/users/friends`)
      .then((resp) => {
        setFriends(resp?.data?.friends ?? []);
        setRenderFriends(resp?.data?.friends ?? []);
        setSelectedUser(resp?.data?.friends[0]);
        loadMessage(resp?.data?.friends[0]);
      })
      .catch((err) => {
        toast(toast_error(t("common.something_went_wrong")));
      });
  }, [toast, t, loadMessage]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedUser) {
        loadMessage(selectedUser);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedUser, loadMessage]);

  return (
    <Fragment>
      <Container maxW="container.2xl" py={4}>
        <Heading fontSize={"xl"} mb={4}>
          {t("chat.messages")}
        </Heading>
        <Flex direction={{ base: "column", md: "row" }}>
          <Box
            display={{ base: "none", md: "block" }}
            w={{ base: "100%", md: "25%" }}
            mb={{ base: 8, md: 0 }}
            overflowY={"auto"}
          >
            <Box position={"sticky"} mb={2} px={2}>
              <Input
                colorScheme="gray"
                placeholder={t("common.search")}
                onChange={(e) => {
                  setSearchText(e?.target?.value ?? "");
                }}
              />
              <Button
                position={"absolute"}
                top={0}
                right={2}
                zIndex={1}
                onClick={() => {
                  setRenderFriends(
                    friends.filter(
                      (value) =>
                        value?.username
                          ?.toLowerCase()
                          .includes(searchText.toLowerCase()) ||
                        value?.name
                          ?.toLowerCase()
                          .includes(searchText.toLowerCase()),
                    ),
                  );
                }}
                title="search"
              >
                <SearchIcon />
              </Button>
            </Box>
            <Box h={"60vh"}>
              {renderFriends.map((item, index) => (
                <Card
                  key={index}
                  p={2}
                  boxShadow={"xs"}
                  variant={"outline"}
                  mx={2}
                  mb={2}
                  overflow={"hidden"}
                  cursor={"pointer"}
                  onClick={async () => {
                    setSelectedUser(item);
                    loadMessage(item);
                  }}
                  bgColor={
                    item?.id === selectedUser?.id &&
                    (theme === "dark" ? "black" : "lightgray")
                  }
                  colorScheme={item?.id === selectedUser?.id ? "gray" : "black"}
                >
                  <Flex
                    overflow={"hidden"}
                    textOverflow="ellipsis"
                    alignItems={"center"}
                  >
                    <Avatar
                      alignSelf={"center"}
                      size={"md"}
                      name={item.name}
                      src={`${appSettings.API_PROXY}/images/user-${item?.id ?? ""}`}
                      mr={2}
                    />
                    <Box>
                      <Text noOfLines={1} color="gray" fontSize={"sm"}>
                        @{item.username}
                      </Text>
                      <Text fontWeight={500} noOfLines={2}>
                        {item.name}
                      </Text>
                    </Box>
                  </Flex>
                </Card>
              ))}
            </Box>
          </Box>

          <Spacer display={{ base: "none", md: "block" }} />

          <Box
            w={{ base: "100%", md: "75%" }}
            border={"1px lightgray solid"}
            borderRadius={4}
            boxShadow={2}
          >
            <Box h={"60vh"} overflowY="auto">
              {selectedUser?.id && messages?.length > 0 ? (
                <Flex
                  p={4}
                  mb={4}
                  borderRadius="md"
                  boxShadow={4}
                  scrollBehavior={"smooth"}
                  flexDir={"column"}
                  position={"relative"}
                >
                  {messages.map((message, index) => (
                    <Box
                      key={index}
                      mb={2}
                      maxW={"80%"}
                      alignSelf={
                        user?.id === message.sender?.uid
                          ? "flex-end"
                          : "flex-start"
                      }
                    >
                      <Text
                        fontSize={"x-small"}
                        color={theme === "dark" ? "white" : "gray.500"}
                        textAlign={
                          user?.id === message.sender?.uid ? "right" : "left"
                        }
                        mx={1}
                      >
                        @{message.sender?.name}
                      </Text>
                      <Text
                        bgColor={
                          user?.id === message.sender?.uid
                            ? theme === "dark"
                              ? "gray.600"
                              : "gray.200"
                            : theme === "dark"
                              ? "black"
                              : "lightgray"
                        }
                        textAlign={
                          user?.id === message.sender?.uid ? "right" : "left"
                        }
                        color={theme === "dark" ? "white" : "black"}
                        px={4}
                        py={1}
                        borderRadius={8}
                      >
                        {message.text}
                      </Text>
                    </Box>
                  ))}
                </Flex>
              ) : (
                <Flex
                  justifyContent={"center"}
                  alignItems={"center"}
                  h={"100%"}
                >
                  <Text>{t("chat.no_message")}</Text>
                </Flex>
              )}
            </Box>
            <Box position={"sticky"} p={2}>
              <Input
                colorScheme="gray"
                placeholder={t("chat.type_your_message")}
                value={text}
                onChange={(e) => {
                  setText(e?.target?.value ?? "");
                }}
              />
              <Button
                position={"absolute"}
                top={2}
                right={2}
                zIndex={1}
                onClick={async () => {
                  await sendMessage();
                }}
              >
                <IoSend />
              </Button>
            </Box>
          </Box>
        </Flex>
      </Container>
    </Fragment>
  );
}
