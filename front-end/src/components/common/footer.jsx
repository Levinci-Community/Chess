import { InfoIcon, SettingsIcon } from "@chakra-ui/icons";
import { Box, Flex, HStack, Image, Link, Text, VStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FaEnvelope, FaFacebook, FaRegCreditCard } from "react-icons/fa";
import { IoDiamond } from "react-icons/io5";

export default function Footer() {
  const theme = localStorage.getItem("theme");
  const { t } = useTranslation();
  return (
    <Flex
      d={{ base: "none", sm: "flex" }}
      px={{ base: 0, md: 20, lg: 40 }}
      py={1}
      bgColor={theme === "dark" ? "black" : "lightgray"}
      direction={{ base: "column", md: "row" }}
      justifyContent={"space-evenly"}
      alignItems="center"
      w="100%"
      userSelect={"none"}
    >
      <Box>
        <HStack>
          <Image
            src="/logo.png"
            alt="UTE CHESS CLUB"
            w={{ base: 16, lg: 20 }}
          />
          <VStack>
            <Text fontWeight="bold">UTE CHESS CLUB</Text>
            <Text fontSize="sm" color="fg.subtle">
              &copy; {new Date().getFullYear()} UTE CHESS CLUB. All rights
              reserved.
            </Text>
          </VStack>
        </HStack>
      </Box>
      <Box display={{ base: "none", lg: "block" }}>
        <Flex>
          <VStack spacing={2} alignItems="flex-start" w={150}>
            <Text fontWeight="bold">{t("footer.more")}</Text>
            <VStack alignItems="flex-start">
              <CustomLink href="/about">
                <Text ml={2} display="flex" alignItems="center">
                  <InfoIcon style={{ marginRight: 8 }} />
                  {t("footer.about")}
                </Text>
              </CustomLink>
              <CustomLink href="/settings">
                <Text ml={2} display="flex" alignItems="center">
                  <SettingsIcon style={{ marginRight: 8 }} />
                  {t("footer.settings")}
                </Text>
              </CustomLink>
            </VStack>
          </VStack>

          <VStack spacing={2} alignItems="flex-start" w={150}>
            <Text fontWeight="bold">{t("footer.community")}</Text>
            <VStack alignItems="flex-start">
              <CustomLink href="https://www.facebook.com/utechessclub">
                <Text ml={2} display="flex" alignItems="center">
                  <FaFacebook style={{ marginRight: 8 }} />
                  {t("footer.facebook")}
                </Text>
              </CustomLink>
              <CustomLink href="https://mail.google.com/mail/?view=cm&fs=1&to=clbcospkt@gmail.com">
                <Text ml={2} display="flex" alignItems="center">
                  <FaEnvelope style={{ marginRight: 8 }} />
                  {t("footer.gmail")}
                </Text>
              </CustomLink>
            </VStack>
          </VStack>

          <VStack spacing={2} alignItems="flex-start" w={150}>
            <Text fontWeight="bold">{t("footer.upgrade")}</Text>
            <VStack alignItems="flex-start">
              <CustomLink href="/vip">
                <Text ml={2} display="flex" alignItems="center">
                  <IoDiamond style={{ marginRight: 8 }} />
                  {t("footer.vip")}
                </Text>
              </CustomLink>
              <CustomLink href="/billing">
                <Text ml={2} display="flex" alignItems="center">
                  <FaRegCreditCard style={{ marginRight: 8 }} />
                  {t("footer.payment")}
                </Text>
              </CustomLink>
            </VStack>
          </VStack>
        </Flex>
      </Box>
    </Flex>
  );
}

const CustomLink = ({ children, href, ...props }) => {
  return (
    <Link
      href={href}
      fontSize="sm  "
      display="flex"
      alignItems="center"
      _hover={{ textDecoration: "underline" }}
      minWidth={200}
      {...props}
    >
      {children}
    </Link>
  );
};
