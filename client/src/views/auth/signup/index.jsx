import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import DefaultAuth from "../../../layouts/auth/Default";
import illustration from "../../../assets/img/auth/login-img.png";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { signUpAdmin } from "../../../redux/action/auth.js";

function SignUp() {
  // Chakra color mode
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const textColorDetails = useColorModeValue("navy.700", "secondaryGray.600");
  const textColorBrand = useColorModeValue("blue", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");

  // State variables
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("ProfileData"));
    if (user) {
      navigate("/admin/dashboards/default");
    }
  }, [navigate]);

  // Toggle password visibility
  const handleClick = () => setShow(!show);

  // Auto-fill form for testing
  const AutoAddValuestesting = () => {
    const uniqueNumber = Math.floor(Math.random() * 1000);
    setName(`John Doe ${uniqueNumber}`);
    setEmail(`johndoe${uniqueNumber}@example.com`);
    setPassword("111111");
    setConfirmPassword("111111");
  };

  // Form validation
  const validate = () => {
    if (!name) {
      toast.error("Please Enter Your Name");
      return false;
    } else if (name.length < 3 || name.length > 20) {
      toast.error("Name should be between 3 and 20 characters long");
      return false;
    } else if (!email) {
      toast.error("Please Enter Your Email");
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email");
      return false;
    } else if (!password) {
      toast.error("Please Enter your Password");
      return false;
    } else if (password.length < 6 || password.length > 20) {
      toast.error("Password should be between 6 and 20 characters long");
      return false;
    } else if (!confirmPassword) {
      toast.error("Please Confirm Your Password");
      return false;
    } else if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    } else if (
      profilePicture &&
      !["image/jpeg", "image/png", "image/jpg"].includes(profilePicture.type)
    ) {
      toast.error("Please upload a valid image file");
      return false;
    } else if (profilePicture && profilePicture.size > 2000000) {
      toast.error("Image size should be less than 2MB");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (!validate()) {
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    if (profilePicture) {
      formData.append("profile_picture", profilePicture);
    }

    dispatch(signUpAdmin(formData)).then((res) => {
      setLoading(false);
      if (!res.payload.success) {
        toast.error(res.message);
      } else {
        navigate("/admin/dashboards/default");
      }
    });
  };

  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
      <ToastContainer />
      <Flex
        maxW={{ base: "100%", md: "max-content" }}
        w="100%"
        mx={{ base: "auto", lg: "0px" }}
        me="auto"
        h="100%"
        alignItems="start"
        justifyContent="center"
        mb={{ base: "30px", md: "60px" }}
        px={{ base: "25px", md: "0px" }}
        mt={{ base: "40px", md: "14vh" }}
        flexDirection="column"
      >
        <Box me="auto">
          <Heading color={textColor} fontSize="36px" mb="20px">
            Sign Up
          </Heading>
          <Button onClick={AutoAddValuestesting}>Auto Add Values</Button>
        </Box>
        <Flex
          zIndex="2"
          direction="column"
          w={{ base: "100%", md: "420px" }}
          maxW="100%"
          background="transparent"
          borderRadius="15px"
          mx={{ base: "auto", lg: "unset" }}
          me="auto"
          mb={{ base: "20px", md: "auto" }}
        >
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <FormControl>
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
              >
                Name<Text color={brandStars}>*</Text>
              </FormLabel>
              <Input
                isRequired
                variant="auth"
                fontSize="sm"
                type="text"
                placeholder="Your Name"
                mb="24px"
                fontWeight="500"
                size="lg"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
              >
                Email<Text color={brandStars}>*</Text>
              </FormLabel>
              <Input
                isRequired
                variant="auth"
                fontSize="sm"
                type="email"
                placeholder="mail@example.com"
                mb="24px"
                fontWeight="500"
                size="lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FormLabel
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                display="flex"
              >
                Password<Text color={brandStars}>*</Text>
              </FormLabel>
              <InputGroup size="md">
                <Input
                  isRequired
                  fontSize="sm"
                  placeholder="please enter password"
                  mb="24px"
                  size="lg"
                  type={show ? "text" : "password"}
                  variant="auth"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement display="flex" alignItems="center" mt="4px">
                  <Icon
                    color={textColorSecondary}
                    _hover={{ cursor: "pointer" }}
                    as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                    onClick={handleClick}
                  />
                </InputRightElement>
              </InputGroup>
              <FormLabel
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                display="flex"
              >
                Confirm Password<Text color={brandStars}>*</Text>
              </FormLabel>
              <InputGroup size="md">
                <Input
                  isRequired
                  fontSize="sm"
                  placeholder="Confirm your password"
                  mb="24px"
                  size="lg"
                  type="password"
                  variant="auth"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </InputGroup>
              <FormLabel
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                display="flex"
              >
                Profile Picture
              </FormLabel>
              <Input
                variant="auth"
                fontSize="sm"
                type="file"
                mb="24px"
                fontWeight="500"
                size="lg"
                onChange={(e) => setProfilePicture(e.target.files[0])}
              />
              <Flex justifyContent="end" align="center" mb="24px">
                <NavLink to="/auth/forgot-password">
                  <Text
                    color={textColorBrand}
                    fontSize="sm"
                    w="124px"
                    fontWeight="500"
                  >
                    Forgot password?
                  </Text>
                </NavLink>
              </Flex>
              <Button
                type="submit"
                fontSize="sm"
                colorScheme="blue"
                fontWeight="500"
                w="100%"
                h="50"
                mb="24px"
                isLoading={loading}
              >
                Sign Up
              </Button>
            </FormControl>
          </form>
          <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="start"
            paddingBottom={"4rem"}
            maxW="100%"
            mt="0px"
          >
            <Text color={textColorDetails} fontWeight="400" fontSize="14px">
              Not registered yet?
              <NavLink to="/">
                <Text
                  color={textColorBrand}
                  as="span"
                  ms="5px"
                  fontWeight="500"
                >
                  Sign In
                </Text>
              </NavLink>
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SignUp;
