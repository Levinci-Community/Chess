import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { getUserData } from "../../lib/auth";
import axios from "../../lib/axios";
import appSettings from "../../settings/appSettings";

const AvatarUploadModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef();
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const user = getUserData();

  const handleUpload = async () => {
    setLoading(true);
    const file = fileInputRef.current.files[0];
    const formData = new FormData();
    formData.append(
      "file",
      file,
      `user-${user.id}.${file.name.split(".").pop()}`,
    );

    try {
      const response = await axios.post(
        `${appSettings.API_PROXY}/images/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      const data = await response?.data;
      setImageUrl(data?.image);
      onClose();
    } catch (error) {
      console.error("Error uploading image: ", error);
    }
    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("users.upload_avatar")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>{t("users.select_an_image")}</FormLabel>
            <Input type="file" ref={fileInputRef} p={1} />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="teal" onClick={handleUpload} isLoading={loading}>
            {t("common.upload")}
          </Button>
          <Button ml={2} onClick={onClose} isDisabled={loading}>
            {t("common.cancel")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AvatarUploadModal;
