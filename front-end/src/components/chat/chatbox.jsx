import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";
import React, { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { IoSend } from "react-icons/io5";
import { getUserData } from "../../lib/auth";
import appSettings from "../../settings/appSettings";
import dataConfig from "./configData.json";

const ChatBox = () => {
  const user = getUserData();
  const theme = localStorage.getItem("theme");
  const { t } = useTranslation();
  const [messages, setMessages] = useState([
    {
      text: t("chat.hello"),
      username: t("chat.assistant"),
      user_id: "assistant",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [databaseData, setDatabaseData] = useState(dataConfig);
  const suggestions = useMemo(
    () => [
      t("chat.about_ute_chess_club"),
      t("chat.when_club_offline"),
      t("chat.how_to_play_chess"),
    ],
    [t]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${appSettings.API_PROXY}/get-all-database`);
        const data = await response.json();
        const combined = {
          ...data,
          ...dataConfig
        };
        setDatabaseData(combined);
      } catch (error) {
        console.error("Error fetching database data:", error);
      }
    };

    fetchData();
  }, []);

  const sendMessage = async (messageContent) => {
    const trimmedInputValue = messageContent.trim();
    if (!trimmedInputValue) {
      console.error("Message content is empty");
      return;
    }

    const userMessage = {
      text: trimmedInputValue,
      username: user?.username,
      user_id: user?.id,
    };

    setMessages((prevMessages) => [
      ...prevMessages,
      userMessage,
      { text: "#loading", username: t("chat.assistant"), user_id: "assistant" },
    ]);
    setInputValue("");
    setLoading(true);

    const model = {
      messages: [
        {
          role: "system",
          content:
            "You are a virtual assistant for the SPKT Chess Club. Answer as briefly as possible.",
        },
        ...messages.map((item) => ({
          role: item.user_id === "assistant" ? "assistant" : "user",
          content: item.text,
        })),
        {
          role: "assistant",
          content: `Additional data:  ${databaseData ? JSON.stringify(databaseData) : ''}`,
        },
        { role: "user", content: trimmedInputValue},
      ],
      model: "gpt-3.5-turbo",
      max_tokens: 300,
    };

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${appSettings.OPENAI_KEY}`,
          },
          body: JSON.stringify(model),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Received response from OpenAI API:", data);

      if (
        !data ||
        !data.choices ||
        data.choices.length === 0 ||
        !data.choices[0].message ||
        !data.choices[0].message.content
      ) {
        console.error("Invalid response from API:", data);
        return;
      }

      const botMessageContent = data.choices[0].message.content;
      const botMessage = {
        username: t("chat.assistant"),
        text: botMessageContent,
        user_id: "assistant",
      };

      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        updatedMessages[updatedMessages.length - 1] = botMessage;
        return updatedMessages;
      });
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => setInputValue(e.target.value);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage(inputValue);
    }
  };

  return (
    <Box w={"100%"} mx="auto">
      <Flex
        p={4}
        mb={4}
        borderRadius="md"
        boxShadow={4}
        h={430}
        overflowY="auto"
        scrollBehavior={"smooth"}
        border={"1px solid lightgray"}
        flexDir={"column"}
        position={"relative"}
      >
        {messages.map((message, index) => (
          <Box
            key={index}
            mb={2}
            maxW={"80%"}
            alignSelf={user?.id === message.user_id ? "flex-end" : "flex-start"}
          >
            <Text
              fontSize={"x-small"}
              color={theme === "dark" ? "white" : "gray.500"}
              textAlign={user?.id === message.user_id ? "right" : "left"}
              mx={1}
            >
              @{message.username}
            </Text>
            {message.text === "#loading" ? (
              <Spinner size="sm" />
            ) : (
              <Text
                bgColor={
                  user?.id === message.user_id
                    ? theme === "dark"
                      ? "gray.600"
                      : "black"
                    : theme === "dark"
                      ? "black"
                      : "lightgray"
                }
                textAlign={user?.id === message.user_id ? "right" : "left"}
                color={
                  user?.id === message.user_id
                    ? theme === "dark"
                      ? "black"
                      : "white"
                    : theme === "dark"
                      ? "white"
                      : "black"
                }
                px={4}
                py={1}
                borderRadius={8}
              >
                {message.text}
              </Text>
            )}
          </Box>
        ))}
        {messages?.length < 2 && user?.id && (
          <Flex
            position={"absolute"}
            flexDir={"column"}
            align={"center"}
            bottom={0}
            w={"100%"}
            px={4}
            left={0}
          >
            {suggestions.map((item, idx) => (
              <Button
                key={idx}
                variant={"outline"}
                colorScheme="gray"
                borderRadius={20}
                w={"100%"}
                mb={2}
                onClick={() => sendMessage(item)}
              >
                {item}
              </Button>
            ))}
          </Flex>
        )}
      </Flex>
      {user?.id ? (
        <HStack>
          <Input
            placeholder={t("chat.type_your_message_here")}
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            colorScheme="gray"
            variant={"outline"}
            borderColor={"lightgray"}
          />
          <Button
            colorScheme="gray"
            onClick={() => sendMessage(inputValue)}
            title={t("chat.send")}
            disabled={loading}
          >
            <IoSend fontSize={24} />
          </Button>
        </HStack>
      ) : (
        <Text color={"gray"} fontSize={"sm"} align={"center"}>
          {t("chat.please_login")}
        </Text>
      )}
    </Box>
  );
};

export default ChatBox;
