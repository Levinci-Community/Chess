import {
  Box,
  Button,
  Container,
  Heading,
  Image,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { formatNumber } from "../../lib/number";
import appSettings from "../../settings/appSettings";

export default function BillingPage() {
  const { t } = useTranslation();
  const [orderId, setOrderId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("momo");
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
  const price = "200000";

  // Function to extract query parameters from the URL
  const getQueryParams = (url) => {
    const params = {};
    const parser = document.createElement("a");
    parser.href = url;
    const query = parser.search.substring(1);
    const vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split("=");
      params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    }
    return params;
  };

  useEffect(() => {
    const params = getQueryParams(window.location.href);
    if (params.orderId) {
      setOrderId(params.orderId);
      queryPaymentStatus(params.orderId);
    }
  }, []);

  const handlePayment = async () => {
    let endpoint;
    if (paymentMethod === "momo") {
      endpoint = `${appSettings.API_PROXY}/momo_payment`;
    } else {
      alert("Update later");
      return;
    }

    try {
      const response = await axios.post(endpoint, { amount: price });
      if (response.data.payUrl) {
        window.location.href = response.data.payUrl;
      } else {
        alert("Payment failed");
      }
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  const queryPaymentStatus = async (orderId) => {
    try {
      const response = await axios.post(
        `${appSettings.API_PROXY}/momo_payment_status`,
        { orderId }
      );
      // Add logic here to extend VIP subscription if payment is successful
      if (response.data.resultCode === "0" || response.data.resultCode === 0) {
        setIsPaymentSuccessful(true);
        becomeVip(); // Call becomeVip function after successful payment
      }
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  const becomeVip = async () => {
    try {
      const token = localStorage.getItem("access_token"); // Assuming you store the token in localStorage
      const response = await axios.post(
        `${appSettings.API_PROXY}/users/become-vip`,
        {
          vip_duration_days: 30, // or any duration you want
          order_id: orderId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("VIP status updated", response.data);
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  return (
    <Container maxW="md" centerContent py={6}>
      {isPaymentSuccessful ? (
        <Box
          textAlign="center"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Image
            src={"../../assets/images/icon/icon_check.jpg"}
            alt="Check icon"
            boxSize="100px"
            mb={4}
          />
          <Text fontSize="xl" fontWeight="bold">
            {t("payment.payment_successfull")}
          </Text>
        </Box>
      ) : (
        <>
          <Box textAlign="center" mb={4}>
            <Heading size="lg">{t("payment.amount_due")}</Heading>
            <Text fontSize="2xl" fontWeight="bold">
              {formatNumber(price)} VND
            </Text>
          </Box>
          <Box w="100%" p={4} borderWidth={1} borderRadius="lg">
            <Heading size="md" mb={4}>
              {t("payment.payment_method")}
            </Heading>
            <RadioGroup onChange={setPaymentMethod} value={paymentMethod}>
              <Stack direction="column" spacing={4}>
                <Radio value="momo">
                  <Box display="flex" alignItems="center">
                    <Image
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdZKHXNJrsnKlR_LYGBNB9Z-2Rm4ZgEpG-LwBXD4ChKyBqKdQs&s"
                      boxSize="50px"
                      mr={4}
                    />
                    <Text>
                      {t("payment.momo")}
                      <br />
                      <small>{t("payment.momo_description")}</small>
                    </Text>
                  </Box>
                </Radio>
                <Radio value="vnpay">
                  <Box display="flex" alignItems="center">
                    <Image
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjeDeEU8y0EmqKl5AtUF5loKkWn9rHvI9lKLAuqOyZ0SrFnAk&s"
                      boxSize="50px"
                      mr={4}
                    />
                    <Text>
                      {t("payment.vnpay")}
                      <br />
                      <small>{t("payment.vnpay_description")}</small>
                    </Text>
                  </Box>
                </Radio>
                <Radio value="zalopay">
                  <Box display="flex" alignItems="center">
                    <Image
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTD6astgqkNctUyOO43ZDc011j_wr3_ImEmnVVvIPLmf8_Tw5s&s"
                      boxSize="50px"
                      mr={4}
                    />
                    <Text>
                      {t("payment.zalopay")}
                      <br />
                      <small>{t("payment.zalopay_description")}</small>
                    </Text>
                  </Box>
                </Radio>
              </Stack>
            </RadioGroup>
            <Button colorScheme="blue" w="100%" mt={4} onClick={handlePayment}>
              {t("payment.pay_now")}
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
}
