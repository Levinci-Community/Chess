import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
} from "@chakra-ui/react";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../../lib/auth";

const AdminHeader = () => {
  const navigate = useNavigate();
  const theme = localStorage.getItem("theme");
  const [user, setUser] = useState(null);
  useEffect(() => {
    const user_data = getUserData();
    if (user_data) setUser({ ...user_data });
  }, []);

  return (
    <Box
      bgColor={theme === "dark" ? "black" : "lightgray"}
      py={2}
      zIndex={3}
      userSelect={"none"}
    >
      <Flex align="center">
        <HStack
          cursor="pointer"
          onClick={() => navigate("/")}
          ml={{ base: 0, md: 16 }}
        >
          <Image src="/logo.png" alt="UTE CHESS CLUB" w={12} />
          <Text fontSize="lg" fontWeight="bold">
            UTE CHESS CLUB
          </Text>
        </HStack>
        <Spacer />
        <PcMenu user={user} />
      </Flex>
    </Box>
  );
};

export default AdminHeader;

const PcMenu = ({ user }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <Fragment>
      <Menu>
        <MenuButton
          size={"sm"}
          textTransform={"uppercase"}
          as={Button}
          variant="ghost"
          mx={2}
          display={{ base: "none", md: "flex" }}
          onClick={() => navigate("/admin")}
        >
          {t("header.dashboard")}
        </MenuButton>
      </Menu>
      <Menu>
        <MenuButton
          size={"sm"}
          textTransform={"uppercase"}
          as={Button}
          variant="ghost"
          rightIcon={<ChevronDownIcon />}
          mx={2}
          display={{ base: "none", md: "flex" }}
        >
          {t("header.documents")}
        </MenuButton>
        <MenuList p={0} overflow={"hidden"}>
          <MenuItem onClick={() => navigate("/admin/blogs")}>
            {t("header.blogs")}
          </MenuItem>
          <MenuItem onClick={() => navigate("/admin/achievements")}>
            {t("header.achievements")}
          </MenuItem>
          <MenuItem onClick={() => navigate("/admin/books")}>
            {t("header.books")}
          </MenuItem>
          <MenuItem onClick={() => navigate("/admin/videos")}>
            {t("header.videos")}
          </MenuItem>
        </MenuList>
      </Menu>
      <Menu>
        <MenuButton
          size={"sm"}
          textTransform={"uppercase"}
          as={Button}
          variant="ghost"
          rightIcon={<ChevronDownIcon />}
          mx={2}
          display={{ base: "none", md: "flex" }}
        >
          {t("header.games")}
        </MenuButton>
        <MenuList p={0} overflow={"hidden"}>
          <MenuItem onClick={() => navigate("/admin/games")}>
            {t("header.games")}
          </MenuItem>
          <MenuItem onClick={() => navigate("/admin/tournaments")}>
            {t("header.tournaments")}
          </MenuItem>
          {/* <MenuItem onClick={() => navigate("/admin/puzzles")}>
            {t("header.puzzles")}
          </MenuItem> */}
        </MenuList>
      </Menu>
      <Menu>
        <MenuButton
          size={"sm"}
          textTransform={"uppercase"}
          as={Button}
          variant="ghost"
          rightIcon={<ChevronDownIcon />}
          mx={2}
          display={{ base: "none", md: "flex" }}
        >
          {t("header.accounts")}
        </MenuButton>
        <MenuList p={0} overflow={"hidden"}>
          <MenuItem onClick={() => navigate("/admin/users")}>
            {t("header.users")}
          </MenuItem>
          <MenuItem onClick={() => navigate("/admin/admins")}>
            {t("header.admins")}
          </MenuItem>
        </MenuList>
      </Menu>
      <Menu>
        <MenuButton
          size={"sm"}
          textTransform={"uppercase"}
          as={Button}
          variant="ghost"
          rightIcon={<ChevronDownIcon />}
          mx={2}
          display={{ base: "none", md: "flex" }}
        >
          {t("header.others")}
        </MenuButton>
        <MenuList p={0} overflow={"hidden"}>
          <MenuItem onClick={() => navigate("/admin/donate")}>
            {t("header.donate")}
          </MenuItem>
          <MenuItem onClick={() => navigate("/admin/club-offline")}>
            {t("header.offline-calendar")}
          </MenuItem>
          <MenuItem onClick={() => navigate("/admin/notifications")}>
            {t("header.notifications")}
          </MenuItem>
          <MenuItem onClick={() => navigate("/admin/banners")}>
            {t("header.banners")}
          </MenuItem>
        </MenuList>
      </Menu>

      {user?.id ? (
        <Fragment>
          <Spacer />
          <Menu>
            <MenuButton
              size={"sm"}
              display={{ base: "none", md: "flex" }}
              mr={16}
            >
              <Flex align="center">
                <Avatar name={user.name} src={user.avatar} size={"sm"} />
                <Text
                  ml={2}
                  fontWeight="500"
                  display={{ base: "none", md: "block" }}
                >
                  {user.name}
                </Text>
              </Flex>
            </MenuButton>
            <MenuList p={0} overflow={"hidden"}>
              <MenuItem onClick={() => navigate("/profile")}>
                {t("header.profile")}
              </MenuItem>
              <MenuItem onClick={() => navigate("/settings")}>
                {t("header.settings")}
              </MenuItem>
              <MenuItem onClick={() => navigate("/logout")}>
                {t("header.logout")}
              </MenuItem>
            </MenuList>
          </Menu>
        </Fragment>
      ) : (
        <Fragment>
          <Spacer />
          <Button onClick={() => navigate("/login")} mx={2}>
            {t("header.login")}
          </Button>
        </Fragment>
      )}
    </Fragment>
  );
};
