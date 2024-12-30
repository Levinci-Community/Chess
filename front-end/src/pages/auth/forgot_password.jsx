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
import { toast_error, toast_success } from "../../lib/hooks/toast";
import { validateEmail } from "../../lib/hooks/validateUser";
import appSettings from "../../settings/appSettings";

export default function ForgotPasswordPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");

  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const validate = () => {
    if (validateEmail(email) === false) {
      const model = toast_error(t("common.fail"), t("auth.invalid_email"));
      toast(model);
      return false;
    }
    return true;
  };

  const onSubmit = () => {
    if (validate()) {
      const ok = validate();

      if (ok) {
        const body = { email };
        setLoading(true);
        axios
          .get(`${appSettings.API_PROXY}/forgot-password`, { params: body })
          .then((resp) => {
            toast(toast_success(resp.data));
            navigate("/login");
          })
          .catch((err) => {
            console.log(err);
            toast(toast_error(err?.response?.data));
          })
          .finally(() => {
            setLoading(false);
          });
      }
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
                {t("auth.forgot_password")}
              </Heading>
            </Stack>
            <Stack spacing="5">
              <FormControl>
                <FormLabel htmlFor="email"> {t("auth.email")}</FormLabel>
                <Input
                  id="email"
                  type="email"
                  required
                  onChange={onEmailChange}
                />
              </FormControl>
            </Stack>
            <Stack spacing="6">
              <Button onClick={onSubmit} isLoading={loading}>
                {t("auth.reset_password")}
              </Button>
              <Divider />
              <Text color="fg.muted" textAlign="center">
                {t("auth.remember_password")}
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
