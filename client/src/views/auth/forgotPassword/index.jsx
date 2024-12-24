import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Text,
  useToast,
} from "@chakra-ui/react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your forgot password logic here
    toast({
      title: "Password reset link sent.",
      description: "Check your email for the password reset link.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bg="gray.50"
      p={4}
    >
      <Box maxW="md" w="full" bg="white" p={6} boxShadow="md" borderRadius="md">
        <Heading as="h2" size="lg" mb={4} textAlign="center">
          Forgot Password
        </Heading>
        <Text mb={4} textAlign="center">
          Enter your email address and we'll send you a link to reset your
          password.
        </Text>
        <form onSubmit={handleSubmit}>
          <FormControl id="email" isRequired>
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <Button mt={4} colorScheme="blue" type="submit" width="full">
            Send Reset Link
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
