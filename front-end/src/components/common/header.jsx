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
  useDisclosure,
} from "@chakra-ui/react";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaList } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../../lib/auth";
import { client_menu } from "./data";
import Sidebar from "./sidebar";
import Tutorial from "./tutorial";

const Header = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const theme = localStorage.getItem("theme");
  const [user, setUser] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [user_data, setUserData] = useState();

  useEffect(() => {
    setUserData(getUserData());
  }, [getUserData]);

  useEffect(() => {
    if (user_data) setUser({ ...user_data });
    const isFirstVisit = localStorage.getItem("isFirstVisit");
    if (isFirstVisit === null) {
      setShowTutorial(true);
      localStorage.setItem("isFirstVisit", "false");
    }
  }, [user_data]);

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
        <Box display={{ base: "block", md: "none" }}>
          <Button title="menu" variant="ghost" py={8} px={4} onClick={onOpen}>
            <FaList size={36} />
          </Button>
          <Sidebar data={client_menu} isOpen={isOpen} onClose={onClose} />
        </Box>
      </Flex>
      {showTutorial && (
        <Box position={"absolute"} top={3} left={72}>
          <Tutorial hideButtonStart={true} />
        </Box>
      )}
    </Box>
  );
};

export default Header;

const PcMenu = ({ user }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <Fragment>
      <Menu>
        <MenuButton
          textTransform={"uppercase"}
          as={Button}
          variant="ghost"
          rightIcon={<ChevronDownIcon />}
          mx={2}
          display={{ base: "none", md: "flex" }}
          className="menu-club"
        >
          {t("header.club")}
        </MenuButton>
        <MenuList p={0} overflow={"hidden"}>
          <MenuItem onClick={() => navigate("/")}>{t("header.home")}</MenuItem>
          <MenuItem onClick={() => navigate("/blogs")}>
            {t("header.blogs")}
          </MenuItem>
          <MenuItem onClick={() => navigate("/achievements")}>
            {t("header.achievements")}
          </MenuItem>
          <MenuItem onClick={() => navigate("/donate")}>
            {t("header.donate")}
          </MenuItem>
          <MenuItem onClick={() => navigate("/about")}>
            {t("header.about")}
          </MenuItem>
        </MenuList>
      </Menu>

      <Menu>
        <MenuButton
          textTransform={"uppercase"}
          as={Button}
          variant="ghost"
          rightIcon={<ChevronDownIcon />}
          mx={2}
          display={{ base: "none", md: "flex" }}
          className="menu-play"
        >
          {t("header.play")}
        </MenuButton>
        <MenuList p={0} overflow={"hidden"}>
          <MenuItem onClick={() => navigate("/lobby")}>
            {t("header.lobby")}
          </MenuItem>
          <MenuItem onClick={() => navigate("/new-game")}>
            {t("header.playWithOptions")}
          </MenuItem>
          <MenuItem onClick={() => navigate("/tournaments")}>
            {t("header.tournaments")}
          </MenuItem>
        </MenuList>
      </Menu>
      <Menu>
        <MenuButton
          textTransform={"uppercase"}
          as={Button}
          variant="ghost"
          rightIcon={<ChevronDownIcon />}
          mx={2}
          display={{ base: "none", md: "flex" }}
          className="menu-practice"
        >
          {t("header.practice")}
        </MenuButton>
        <MenuList p={0} overflow={"hidden"}>
          <MenuItem onClick={() => navigate("/puzzle")}>
            {t("header.puzzles")}
          </MenuItem>
          <MenuItem onClick={() => navigate("/chessle")}>
            {t("header.chessle")}
          </MenuItem>
          <MenuItem onClick={() => navigate("/videos")}>
            {t("header.videos")}
          </MenuItem>
          <MenuItem onClick={() => navigate("/books")}>
            {t("header.books")}
          </MenuItem>
        </MenuList>
      </Menu>

      <Menu>
        <MenuButton
          textTransform={"uppercase"}
          as={Button}
          variant="ghost"
          mx={2}
          onClick={() => navigate("/tv")}
          display={{ base: "none", md: "flex" }}
          className="menu-tv"
        >
          {t("header.tv")}
        </MenuButton>
      </Menu>
      <Menu>
        <MenuButton
          textTransform={"uppercase"}
          as={Button}
          variant="ghost"
          rightIcon={<ChevronDownIcon />}
          mx={2}
          display={{ base: "none", md: "flex" }}
          className="menu-vip"
        >
          {t("header.vip")}
        </MenuButton>
        <MenuList p={0} overflow={"hidden"}>
          <MenuItem onClick={() => navigate("/vip")}>
            {t("header.upgrade_vip")}
          </MenuItem>
          <MenuItem onClick={() => navigate("/vip/count-down")}>
            {t("header.count-down")}
          </MenuItem>
          <MenuItem onClick={() => navigate("/vip/haste")}>
            {t("header.haste")}
          </MenuItem>
          <MenuItem onClick={() => navigate("/vip/infinity")}>
            {t("header.infinity")}
          </MenuItem>
          <MenuItem onClick={() => navigate("/vip/speed-run")}>
            {t("header.speed-run")}
          </MenuItem>
          <MenuItem onClick={() => navigate("/vip/three")}>
            {t("header.three")}
          </MenuItem>
        </MenuList>
      </Menu>
      {user?.id ? (
        <Fragment>
          <Spacer />
          <Menu>
            <MenuButton
              display={{ base: "none", md: "flex" }}
              mr={16}
              className="menu-user"
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
              {user?.role === "ADMIN" && (
                <MenuItem onClick={() => navigate("/admin")}>
                  {t("header.admin")}
                </MenuItem>
              )}
              <MenuItem onClick={() => navigate("/profile")}>
                {t("header.profile")}
              </MenuItem>
              <MenuItem onClick={() => navigate("/friends")}>
                {t("header.friend")}
              </MenuItem>
              <MenuItem onClick={() => navigate("/chat")}>
                {t("header.chat")}
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
          <Button onClick={() => navigate("/register")} mr={16}>
            {t("header.register")}
          </Button>
        </Fragment>
      )}
    </Fragment>
  );
};
