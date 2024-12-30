import { Button } from "@chakra-ui/react";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaDiamond } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../../lib/auth";

export default function UpdateVipNow() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState();
  useEffect(() => {
    const user_data = getUserData();
    if (user_data) setUser(user_data);
  }, [getUserData]);
  return (
    <Fragment>
      <Button
        colorScheme="green"
        w={"100%"}
        mb={4}
        leftIcon={<FaDiamond />}
        rightIcon={<FaDiamond />}
        onClick={() => navigate("/vip")}
      >
        {user?.is_vip ? t("vip.your_vip_is_active") : t("vip.upgrade_your_vip")}
      </Button>
    </Fragment>
  );
}
