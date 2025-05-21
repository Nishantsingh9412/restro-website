import { Box, Button, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

function NotFound() {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      h="100vh"
      bg="gray.50"
      px={4}
    >
      <Box textAlign="center" mb={6}>
        <Image
          src="https://img.freepik.com/free-vector/404-error-page-found-concept-illustration_114360-1811.jpg"
          alt="404 Not Found"
          mx="auto"
          mb={4}
        />
        <Heading as="h1" size="2xl" color="blue.500" mb={2}>
          404
        </Heading>
        <Text fontSize="lg" color="gray.600">
          Oops! The page you&apos;re looking for doesn&apos;t exist.
        </Text>
      </Box>
      <NavLink to="/">
        <Button colorScheme="blue" size="lg" px={8} _hover={{ bg: "blue.600" }}>
          Go Back to Home
        </Button>
      </NavLink>
    </Flex>
  );
}

export default NotFound;
