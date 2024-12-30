import { Flex, Spacer } from "@chakra-ui/react";
import React from "react";
import { Outlet } from "react-router-dom";
import AdminFooter from "../common/adminFooter";
import AdminHeader from "../common/adminHeader";

const AdminLayout = () => {
  return (
    <Flex minH={"100vh"} flexDir={"column"} userSelect={"none"}>
      <AdminHeader />
      <Outlet />
      <Spacer />
      <AdminFooter />
    </Flex>
  );
};

export default AdminLayout;
