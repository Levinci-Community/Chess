import { Box, Flex, Heading, Image, Spacer, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import Image1 from "../../assets/images/donate/1.jpg";
import Image2 from "../../assets/images/donate/2.jpg";
import Image3 from "../../assets/images/donate/3.jpg";
import Image4 from "../../assets/images/donate/4.webp";
import Image5 from "../../assets/images/donate/5.jpg";
import Image6 from "../../assets/images/donate/6.jpg";
import Image7 from "../../assets/images/donate/7.jpg";
import Image8 from "../../assets/images/donate/8.jpg";
import appSettings from "../../settings/appSettings";

const DonatePage = () => {
  const { t } = useTranslation();

  return (
    <Box bgColor={"blue.900"}>
      <Flex>
        <Image
          src={Image1}
          alt="chess1"
          w={"20%"}
          objectFit={"contain"}
          minH={32}
        />
        <Spacer />
        <Image
          src={Image2}
          alt="chess2"
          w={"30%"}
          objectFit={"contain"}
          minH={32}
          mt={-64}
        />
        <Spacer />

        <Image
          src={Image3}
          alt="chess3"
          w={"15%"}
          objectFit={"contain"}
          minH={32}
          mt={-16}
        />
        <Spacer />

        <Image
          src={Image4}
          alt="chess4"
          w={"20%"}
          objectFit={"contain"}
          minH={32}
        />
      </Flex>
      <Flex mt={12} position={"relative"}>
        <Image
          src={Image5}
          alt="chess5"
          w={"15%"}
          objectFit={"cover"}
          maxHeight={48}
          minH={32}
        />
        <Spacer />
        <Heading
          as="h1"
          mb={4}
          color={"white"}
          position={"absolute"}
          textAlign={"center"}
          top={-16}
          left={0}
          w={"100%"}
        >
          {t("club.support_ute_chess_club")}
        </Heading>
        <Flex alignItems={"center"}>
          <Image
            h={200}
            w={200}
            src={`${appSettings.API_PROXY}/images/donate`}
            alt={t("club.support_ute_chess_club")}
          />
          <Box ml={8}>
            <Text py={2} fontSize={"2xl"} color={"white"}>
              {t("club.card_bank")}: Vietcombank
            </Text>
            <Text py={2} fontSize={"2xl"} color={"white"}>
              {t("club.card_number")}: 022 6868 6868 6868
            </Text>
            <Text py={2} fontSize={"2xl"} color={"white"}>
              {t("club.card_name")}: CLB CỜ SPKT
            </Text>
          </Box>
        </Flex>
        <Spacer />
        <Image
          src={Image6}
          alt="chess6"
          w={"15%"}
          objectFit={"cover"}
          maxHeight={48}
          minH={32}
        />
      </Flex>
      <Flex mt={12}>
        <Image
          src={Image7}
          alt="chess7"
          w={"20%"}
          objectFit={"contain"}
          h={48}
        />
        <Spacer />
        <Box px={32} mt={4}>
          <Text fontSize="xl" mb={4} color={"white"} textAlign={"center"}>
            {t("club.your_donate_help_us_providing")}
          </Text>
          <Text fontSize="xl" color={"white"} textAlign={"center"}>
            {t("club.thank_you")}
          </Text>
        </Box>
        <Spacer />
        <Image src={Image8} w={"20%"} objectFit={"cover"} h={48} />
      </Flex>
    </Box>
  );
};

export default DonatePage;
