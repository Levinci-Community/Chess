import { Flex, Heading, Spinner } from "@chakra-ui/react";
import { CometChat } from "@cometchat-pro/chat";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { clearTokens, clearUserData, getUserData } from "../../lib/auth";
const LogoutPage = ({ setUser }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    setTimeout(() => {
      CometChat.removeLoginListener(getUserData().id);
      CometChat.logout().then(
        () => {
          console.log("Logout completed successfully");
        },
        (error) => {
          console.log("Logout failed with exception:", { error });
        },
      );
      clearTokens();
      clearUserData();
      setUser(null);
      navigate("/");
    }, 1000);
  }, [navigate, setUser]);

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      flexDir="column"
      minH="80vh"
    >
      <Heading textAlign="center" mb={4}>
        {t("auth.logging_out")}
      </Heading>
      <Spinner size="xl" variant="primary" />
    </Flex>
  );
};

export default LogoutPage;
