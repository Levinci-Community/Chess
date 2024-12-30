import {
  Box,
  Container,
  HStack,
  Heading,
  Image,
  Link,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { useTranslation } from "react-i18next";

export default function ForgotPasswordConfirmationPage() {
  const { t } = useTranslation();
  return (
    <Container maxW="lg">
      <Stack spacing="8">
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
                {t("auth.reset_password")}
              </Heading>
            </Stack>
            <Stack spacing="5">
              <Text textAlign="center">
                {t("auth.an_email_with_a")}{" "}
                <strong> {t("auth.reset_password")}</strong>{" "}
                {t("auth.has_been_send_to_your_inbox")}.{" "}
                {t("auth.please_check_your_email")}
              </Text>
            </Stack>
            <Stack spacing="6">
              <Text color="fg.muted" textAlign="center">
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
