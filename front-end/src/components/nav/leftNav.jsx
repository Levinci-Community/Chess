import { Box } from "@chakra-ui/react";
import React, { Fragment, useEffect, useState } from "react";
import { getUserData } from "../../lib/auth";
import axios from "../../lib/axios";
import appSettings from "../../settings/appSettings";
import ImageSlider from "../slider/imageSlider";
import HasVipBanner from "../vip/hasVipBanner";
import VipBannerSmall from "../vip/vipBannerSmall";

export default function LeftNav() {
  const user_data = getUserData();
  const isVip = user_data?.is_vip;

  const [images, setImages] = useState([]);

  useEffect(() => {
    axios
      .get(`${appSettings.API_PROXY}/banners/client`)
      .then((resp) => {
        setImages(resp?.data?.banners ?? []);
      })
      .catch((err) => {
        console.error("Something went wrong");
      });
  }, []);

  return (
    <Fragment>
      <ImageSlider images={images} />
      <Box py={2} />
      {!!isVip ? <HasVipBanner /> : <VipBannerSmall />}
    </Fragment>
  );
}
