import { Flex, Spacer } from "@chakra-ui/react";
import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../common/footer";
import Header from "../common/header";
const ClientLayout = () => {
  return (
    <Flex minH={"100vh"} flexDir={"column"} userSelect={"none"}>
      <Header />
      <Outlet />
      <Spacer />
      <Footer />
    </Flex>
  );
};

export default ClientLayout;
