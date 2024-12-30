import {
  Box,
  Container,
  Flex,
  HStack,
  Heading,
  Image,
  Link,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function VerifyEmailSuccessPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
          <Heading
            size={{
              base: "sm",
              md: "md",
            }}
          >
            {t("auth.success_to_verify")}
          </Heading>
          <Flex w={"100%"} justifyContent={"center"}>
            <Link pt={4} color="teal" href="/login">
              {t("auth.login")}
            </Link>
          </Flex>
        </Box>
      </Stack>
    </Container>
  );
}
