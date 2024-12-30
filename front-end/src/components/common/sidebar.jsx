// Sidebar.js
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Heading,
  List,
  ListItem,
  Modal,
  Slide,
} from "@chakra-ui/react";
import { IoIosClose } from "react-icons/io";

const Sidebar = ({ data, isOpen, onClose }) => {
  const navigate = useNavigate();
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <Slide in={isOpen} exit={onClose} dir="right">
        <Box
          bg="blue.50"
          p={4}
          w="75%"
          float="right"
          minH="100vh"
          position="fix"
          zIndex={9999}
        >
          <Heading
            fontSize="xl"
            mb={8}
            ml={4}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            Menu
            <Button variant="ghost" onClick={onClose}>
              <IoIosClose size={32} />
            </Button>
          </Heading>
          <List spacing={2}>
            {data.map((item) => (
              <ListItem key={item.id}>
                <Button
                  onClick={() => navigate(item.link)}
                  width="100%"
                  variant="ghost"
                  justifyContent="left"
                >
                  {item.title}
                </Button>
              </ListItem>
            ))}
          </List>
        </Box>
      </Slide>
    </Modal>
  );
};

export default Sidebar;
