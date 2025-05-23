// import React from "react";
import {
  Box,
  Stack,
  Heading,
  Flex,
  // Text,
  Button,
  useDisclosure
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";

const MainPage = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleToggle = () => (isOpen ? onClose() : onOpen());
  
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding={6}
      bg="teal.500"
      color="white"
      {...props}
    >
      <Flex align="center" mr={5}>
        <Heading as="h1" size="lg" letterSpacing={"tighter"}>
          <a href="/admin/default"> 
           <Button 
            color={"#000000"}

           > Open Admin Dashboard </Button>
          </a>
        </Heading>
      </Flex>

      <Box display={{ base: "block", md: "none" }} onClick={handleToggle}>
        <HamburgerIcon />
      </Box>

      <Stack
        direction={{ base: "column", md: "row" }}
        display={{ base: isOpen ? "block" : "none", md: "flex" }}
        width={{ base: "full", md: "auto" }}
        alignItems="center"
        flexGrow={1}
        mt={{ base: 4, md: 0 }}
      >
        {/* <Text>Docs</Text> */}
        {/* <Text>Examples</Text> */}
        {/* <Text>Blog</Text> */}
        {/* <a href="http://localhost:3000/#/admin/default"> Main Dashboard</a> */}
      </Stack>

      <Box
        display={{ base: isOpen ? "block" : "none", md: "block" }}
        mt={{ base: 4, md: 0 }}
      >

      </Box>
    </Flex>
  );
};

export default MainPage;