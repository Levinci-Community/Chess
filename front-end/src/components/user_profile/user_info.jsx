import { EditIcon, EmailIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Center,
  Heading,
  Stack,
  Text,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { useTranslation } from "react-i18next";
import { getUserData } from "../../lib/auth";
import AvatarUploadModal from "./avatar_upload_modal";
import ChangePasswordModal from "./change_password_modal";

const UserInfo = () => {
  const { t } = useTranslation();
  const {
    isOpen: isAvatarUploadOpen,
    onOpen: onAvatarUploadOpen,
    onClose: onAvatarUploadClose,
  } = useDisclosure();
  const {
    isOpen: isChangePasswordOpen,
    onOpen: onChangePasswordOpen,
    onClose: onChangePasswordClose,
  } = useDisclosure();

  const containerWidth = useBreakpointValue({ base: "100%", md: "1/3" });
  const user = getUserData();
  const theme = localStorage.getItem("theme");

  return (
    <Stack
      maxW="container.lg"
      width={containerWidth}
      h={"100%"}
      pt={24}
      pb={12}
      px={4}
      boxShadow="md"
      borderRadius="md"
      bgColor={theme === "dark" ? "black" : "white"}
      textAlign="center"
    >
      <AvatarUploadModal
        isOpen={isAvatarUploadOpen}
        onClose={onAvatarUploadClose}
      />
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={onChangePasswordClose}
      />

      <Stack spacing={4}>
        {/* Avatar */}
        <Center>
          <Avatar
            name={user.name}
            src={user.avatar}
            cursor="pointer"
            size="2xl"
            position="relative"
            onClick={onAvatarUploadOpen}
          >
            <EditIcon
              color="inherit"
              fontSize="2xl"
              position="absolute"
              bottom={6}
              right={2}
              boxShadow="md"
            />
          </Avatar>
        </Center>

        {/* Name and Username */}
        <Box>
          <Heading fontSize="xl" mb={4}>
            {user.name}
          </Heading>
          <Text color="gray.500" fontSize="lg" mb={2}>
            @{user.username}
          </Text>
          <Text color="gray.500" fontSize="lg" mb={2}>
            <EmailIcon fontSize="lg" /> {user.email}
          </Text>
          {user?.is_vip && (
            <Text color="green.500" fontSize="md">
              VIP
            </Text>
          )}
        </Box>

        {/* Change Password */}
        <Box mt={8}>
          <Button colorScheme="teal" size="lg" onClick={onChangePasswordOpen}>
            {t("profile.changePassword")}
          </Button>
        </Box>
      </Stack>
    </Stack>
  );
};

export default UserInfo;
