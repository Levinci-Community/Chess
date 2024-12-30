import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useToast,
} from "@chakra-ui/react";
import { validatePassword } from "../../lib/hooks/validateUser";
import { PasswordField } from "../auth/PasswordField";
import { toast_error, toast_success } from "../../lib/hooks/toast";
import axios from "axios";
import appSettings from "../../settings/appSettings";
import { useTranslation } from "react-i18next";

export default function ChangePasswordModal({ isOpen, onClose }) {
  const toast = useToast();
  const { t } = useTranslation();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const onOldPasswordChange = (e) => {
    setOldPassword(e.target.value);
  };

  const onNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleChangePassword = async () => {
    let ok = true;

    if (validatePassword(oldPassword) === false) {
      const model = toast_error(
        t("changePassword.oldPasswordFail"),
        t("changePassword.passwordRequirement")
      );
      toast(model);
      ok = false;
    }

    if (validatePassword(newPassword) === false) {
      const model = toast_error(
        t("changePassword.changePasswordFail"),
        t("changePassword.passwordRequirement")
      );
      toast(model);
      ok = false;
    }

    if (ok === false) return;

    try {
      const response = await axios.post(
        `${appSettings.API_PROXY}/change-password`,
        {
          oldPassword: oldPassword,
          newPassword: newPassword,
        }
      );

      if (response.status === 200) {
        const model = toast_success(t("changePassword.success"));
        toast(model);
        onClose();
      } else {
        const model = toast_error(t("changePassword.failure"));
        toast(model);
      }
    } catch (error) {
      const model = toast_error(t("changePassword.error"));
      toast(model);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("changePassword.title")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <PasswordField
            label={t("changePassword.oldPassword")}
            id={"old-password"}
            onChange={onOldPasswordChange}
          />
          <PasswordField
            label={t("changePassword.newPassword")}
            id={"new-password"}
            onChange={onNewPasswordChange}
          />
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="teal" onClick={handleChangePassword}>
            {t("changePassword.changeButton")}
          </Button>
          <Button ml={2} onClick={onClose}>
            {t("changePassword.cancelButton")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
