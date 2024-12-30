import { Box } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Joyride, { ACTIONS, STATUS } from "react-joyride";

const Tutorial = () => {
  const [run, setRun] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    // Automatically start the tutorial with the first step open
    setRun(true);
  }, []);

  const steps = [
    {
      target: ".menu-club",
      content: t("tutorial.menu-club"),
      disableBeacon: true,
    },
    {
      target: ".menu-play",
      content: t("tutorial.menu-play"),
      disableBeacon: true,
    },
    {
      target: ".menu-practice",
      content: t("tutorial.menu-practice"),
      disableBeacon: true,
    },
    {
      target: ".menu-tv",
      content: t("tutorial.menu-tv"),
      disableBeacon: true,
    },
    {
      target: ".menu-vip",
      content: t("tutorial.menu-vip"),
      disableBeacon: true,
    },
    {
      target: ".menu-user",
      content: t("tutorial.menu-user"),
      disableBeacon: true,
    },
  ];

  const handleJoyrideCallback = (data) => {
    const { status, action } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun(false);
    } else if (action === ACTIONS.CLOSE) {
      setRun(false);
    }
  };

  return (
    <Box p={4}>
      <Joyride
        steps={steps}
        run={run}
        continuous
        showProgress
        showSkipButton
        callback={handleJoyrideCallback}
        styles={{
          options: {
            arrowColor: "#e3ffeb",
            backgroundColor: "#e3ffeb",
            overlayColor: "rgba(79, 26, 0, 0.4)",
            primaryColor: "#000",
            textColor: "#004a14",
            zIndex: 1000,
          },
        }}
        disableOverlayClose
        disableBeacon={true}
      />
    </Box>
  );
};

export default Tutorial;
