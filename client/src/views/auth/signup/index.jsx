/* eslint-disable */
/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2023 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Chakra imports
import {
  Box,
  Button,
  Checkbox,
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
// Custom components
import { HSeparator } from "components/separator/Separator";
import DefaultAuth from "layouts/auth/Default";
// Assets
import illustration from "assets/img/auth/login-img.png";
import { FcGoogle } from "react-icons/fc";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { SignUpAction } from "../../../redux/action/auth.js";


function SignUp() {
  // Chakra color mode
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const textColorDetails = useColorModeValue("navy.700", "secondaryGray.600");
  const textColorBrand = useColorModeValue("blue", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");
  const googleBg = useColorModeValue("secondaryGray.300", "whiteAlpha.200");
  const googleText = useColorModeValue("navy.700", "white");
  const googleHover = useColorModeValue(
    { bg: "gray.200" },
    { bg: "whiteAlpha.300" }
  );
  const googleActive = useColorModeValue(
    { bg: "secondaryGray.300" },
    { bg: "whiteAlpha.200" }
  );
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading,setLoading] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('ProfileData'));
    if (user) {
      history.push('/admin/dashboards/default')
    }
  }, [history])

  const handleGoogleLogin = () => {
    window.open(
      `${process.env.REACT_APP_BASE_URL_FOR_APIS}/auth/google/callback`,
      "_self"
    )
  }

  const AutoAddValuestesting = () => {
    // Generate a random number to ensure the values are unique on each click
    const uniqueNumber = Math.floor(Math.random() * 1000);

    // Set name with a unique identifier
    setName(`John Doe ${uniqueNumber}`);

    // Set email with a unique identifier
    setEmail(`johndoe${uniqueNumber}@example.com`);

    setPassword('111111');

    setConfirmPassword(`111111`);


    // setProfilePicture(`https://example.com/profilePicture${uniqueNumber}.jpg`);
  }

  const validate = () => {
    if (!name) {
      toast.error("Please Enter Your Name");
      return false;
    } else if (name.length < 3) {
      toast.error("Name should be atleast 3 characters long");
      return false;
    } else if (name.length > 20) {
      toast.error("Name should be less than 20 characters long");
      return false;
    } else if (!email) {
      toast.error("Please Enter Your Email");
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email');
      return false;
    } else if (!password) {
      toast.error("Please Enter your Password");
      return false;
    } else if (password.length < 6) {
      toast.error("Password should be atleast 6 characters long");
      return false;
    } else if (password.length > 20) {
      toast.error("Password should be less than 20 characters long");
      return false;
    } else if (!confirmPassword) {
      toast.error("Please Confirm Your Password")
      return false;
    } else if (password !== confirmPassword) {
      toast.error("Password didn't matched")
      return false;
    } else if (profilePicture && !profilePicture?.type === 'image/jpeg' || !profilePicture?.type === 'image/png' || !profilePicture?.type === 'image/jpg') {
      toast.error("Please upload a valid image file")
      return false;
    } else if (profilePicture && profilePicture?.length > 2000000) {
      toast.error("Image size should be less than 1MB")
      return false;
    }
    return true;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // console.log(name, email, password, confirmPassword)
    if (!validate()) return;


    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('confirmPassword', confirmPassword);

    if (profilePicture) {
      // formData.append('profilePicture', profilePicture, profilePicture.name);
      formData.append('profile_picture', profilePicture);
    }

    console.log("newUserData", formData)

    dispatch(SignUpAction(formData)).then((res) => {
      if (!(res.success)) {
        setLoading(false)
        toast.error(res.message);
        console.log(res);
      } else {
        // toast.success(res.message);
        setLoading(false);
        history.push('/admin/dashboards/default');
        console.log(res);
      }
    });

  }

  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
      <ToastContainer />
      <Flex
        maxW={{ base: "100%", md: "max-content" }}
        w='100%'
        mx={{ base: "auto", lg: "0px" }}
        me='auto'
        h='100%'
        alignItems='start'
        justifyContent='center'
        mb={{ base: "30px", md: "60px" }}
        px={{ base: "25px", md: "0px" }}
        mt={{ base: "40px", md: "14vh" }}
        flexDirection='column'>
        <Box me='auto'>
          <Heading color={textColor} fontSize='36px' mb='20px'>
            Sign Up
          </Heading>
          <Button
            onClick={AutoAddValuestesting}
          >
            Auto Add Values
          </Button>
          {/* <Text
            mb='36px'
            ms='4px'
            color={textColorSecondary}
            fontWeight='400'
            fontSize='md'>
            Enter your email and password to sign up!
          </Text> */}
        </Box>
        <Flex
          zIndex='2'
          direction='column'
          w={{ base: "100%", md: "420px" }}
          maxW='100%'
          background='transparent'
          borderRadius='15px'
          mx={{ base: "auto", lg: "unset" }}
          me='auto'
          mb={{ base: "20px", md: "auto" }}>
          {/* <Button
            fontSize='sm'
            me='0px'
            mb='26px'
            py='15px'
            h='50px'
            borderRadius='16px'
            bg={googleBg}
            color={googleText}
            fontWeight='500'
            _hover={googleHover}
            _active={googleActive}
            _focus={googleActive}
            onClick={handleGoogleLogin}
          >
            <Icon as={FcGoogle} w='20px' h='20px' me='10px' />
            Sign Up with Google
          </Button> */}
          {/* <Flex align='center' mb='25px'>
            <HSeparator />
            <Text color='gray.400' mx='14px'>
              or
            </Text>
            <HSeparator />
          </Flex> */}
          <form onSubmit={handleSubmit} encType="multipart/form-data" >
            <FormControl >
              <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' color={textColor} mb='8px'>
                Name<Text color={brandStars}>*</Text>
              </FormLabel>
              <Input
                isRequired={true}
                variant='auth'
                fontSize='sm'
                ms={{ base: "0px", md: "0px" }}
                type='text'
                placeholder='Your Name'
                mb='24px'
                fontWeight='500'
                size='lg'
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
              <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' color={textColor} mb='8px'>
                Email<Text color={brandStars}>*</Text>
              </FormLabel>
              <Input
                isRequired={true}
                variant='auth'
                fontSize='sm'
                ms={{ base: "0px", md: "0px" }}
                type='email'
                placeholder='mail@example.com'
                mb='24px'
                fontWeight='500'
                size='lg'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FormLabel ms='4px' fontSize='sm' fontWeight='500' color={textColor} display='flex'>
                Password<Text color={brandStars}>*</Text>
              </FormLabel>
              <InputGroup size='md'>
                <Input
                  isRequired={true}
                  fontSize='sm'
                  placeholder='please enter password'
                  mb='24px'
                  size='lg'
                  type={show ? "text" : "password"}
                  variant='auth'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement display='flex' alignItems='center' mt='4px'>
                  <Icon
                    color={textColorSecondary}
                    _hover={{ cursor: "pointer" }}
                    as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                    onClick={handleClick}
                  />
                </InputRightElement>
              </InputGroup>
              <FormLabel ms='4px' fontSize='sm' fontWeight='500' color={textColor} display='flex'>
                Confirm Password<Text color={brandStars}>*</Text>
              </FormLabel>
              <InputGroup size='md'>
                <Input
                  isRequired={true}
                  fontSize='sm'
                  placeholder='Confirm your password'
                  mb='24px'
                  size='lg'
                  type='password'
                  variant='auth'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </InputGroup>
              <FormLabel ms='4px' fontSize='sm' fontWeight='500' color={textColor} display='flex'>
                Profile Picture
              </FormLabel>
              <Input
                variant='auth'
                fontSize='sm'
                ms={{ base: "0px", md: "0px" }}
                type='file'
                mb='24px'
                fontWeight='500'
                size='lg'
                onChange={(e) => {
                  setProfilePicture(e.target.files[0])
                  console.log(e.target.files[0])
                }
                }

              />
              <Flex justifyContent='end' align='center' mb='24px'>
                {/* <FormControl display='flex' alignItems='center'>
                <Checkbox id='remember-login' colorScheme='brandScheme' me='10px' />
                <FormLabel htmlFor='remember-login' mb='0' fontWeight='normal' color={textColor} fontSize='sm'>
                  Keep me logged in
                </FormLabel>
              </FormControl> */}
                <NavLink to='/auth/forgot-password'>
                  <Text color={textColorBrand} fontSize='sm' w='124px' fontWeight='500'>
                    Forgot password?
                  </Text>
                </NavLink>
              </Flex>
              <Button
               type="submit"
               fontSize='sm'
               colorScheme="blue"
               fontWeight='500'
               w='100%'
               h='50'
               mb='24px'
               isLoading={loading}
              >
                Sign Up
              </Button>
            </FormControl>
          </form>
          <Flex
            flexDirection='column'
            justifyContent='center'
            alignItems='start'
            paddingBottom={'4rem'}
            maxW='100%'
            mt='0px'>
            <Text color={textColorDetails} fontWeight='400' fontSize='14px'>
              Not registered yet?
              <NavLink to='/'>
                <Text
                  color={textColorBrand}
                  as='span'
                  ms='5px'
                  fontWeight='500'>
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
