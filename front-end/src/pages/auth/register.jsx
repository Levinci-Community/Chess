import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Image,
  Input,
  Link,
  Stack,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PasswordField } from "../../components/auth/PasswordField";
import { toast_error, toast_success } from "../../lib/hooks/toast";
import {
  validateEmail,
  validateName,
  validatePassword,
  validateUsername,
} from "../../lib/hooks/validateUser";
import appSettings from "../../settings/appSettings";

export default function RegisterPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const onUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const onPasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const onNameChange = (e) => {
    setName(e.target.value);
  };

  const validate = () => {
    const validateField = (value, validationFunction, errorMessage) => {
      if (!validationFunction(value)) {
        const model = toast_error("Register fail.", errorMessage);
        toast(model);
        return false;
      }
      return true;
    };

    return (
      validateField(username, validateUsername, t("auth.username_condition")) &&
      validateField(password, validatePassword, t("auth.password_condition")) &&
      validateField(email, validateEmail, t("auth.email_condition")) &&
      validateField(name, validateName, t("auth.name_condition"))
    );
  };

  const onSubmit = () => {
    const ok = validate();

    if (ok) {
      const body = { username, email, password, name };
      setLoading(true);
      axios
        .post(`${appSettings.API_PROXY}/register`, body)
        .then((res) => {
          toast(toast_success(t("common.success")));
          navigate("/verify-email");
        })
        .catch((error) => {
          toast(toast_error(t("common.fail"), error.response.data));
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <Container maxW="lg">
      <Stack spacing="8">
        <Stack>
          <VStack>
            <HStack>
              <Image
                src="/logo.png"
                alt={t("common.ute_chess_club")}
                h={16}
                w={16}
              />
              <Text
                fontSize="xl"
                fontWeight="bold"
                display={{ md: "block", sm: "none" }}
                cursor="pointer"
              >
                {t("common.ute_chess_club")}
              </Text>
            </HStack>
          </VStack>
        </Stack>
        <Box
          py={{
            base: "0",
            sm: "8",
          }}
          px={{
            base: "4",
            sm: "10",
          }}
          bg={{
            base: "transparent",
            sm: "bg.surface",
          }}
          boxShadow={{
            base: "none",
            sm: "md",
          }}
          borderRadius={{
            base: "none",
            sm: "xl",
          }}
        >
          <Stack spacing="6">
            <Stack
              spacing={{
                base: "2",
                md: "3",
              }}
              textAlign="center"
            >
              <Heading
                size={{
                  base: "sm",
                  md: "md",
                }}
              >
                {t("auth.register_new_account")}
              </Heading>
            </Stack>
            <Stack spacing="5">
              <FormControl>
                <FormLabel htmlFor="username"> {t("auth.username")}</FormLabel>
                <Input
                  id="username"
                  type="username"
                  required
                  onChange={onUsernameChange}
                />
              </FormControl>
              <PasswordField onChange={onPasswordChange} />
              <FormControl>
                <FormLabel htmlFor="email"> {t("auth.email")}</FormLabel>
                <Input
                  id="email"
                  type="email"
                  required
                  onChange={onEmailChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="name"> {t("auth.name")}</FormLabel>
                <Input id="name" type="name" required onChange={onNameChange} />
              </FormControl>
            </Stack>
            <Stack spacing="6">
              <Button onClick={onSubmit} isLoading={loading}>
                {t("auth.register")}
              </Button>
              <Divider />
              <Text color="fg.muted" textAlign="center">
                {t("auth.already_have_account")}
                <Link href="/login" color="darkcyan">
                  {t("auth.login")}
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}
