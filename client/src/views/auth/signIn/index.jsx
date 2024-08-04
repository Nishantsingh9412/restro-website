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
import PhoneInput from 'react-phone-number-input'
import { parsePhoneNumber } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
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
  useColorModeValue,
  Text,
  Tabs,
  TabList,
  Tab,
  TabIndicator,
} from "@chakra-ui/react";
// Custom components
import { HSeparator } from "components/separator/Separator";
import DefaultAuth from "layouts/auth/Default";
// Assets
// import illustration from "assets/img/auth/auth.png";
import illustration from "assets/img/auth/login-img.png";
import { FcGoogle } from "react-icons/fc";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom'
import { LoginAction, LoginDelivBoyAction } from "../../../redux/action/auth.js";

function SignIn() {
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
  const [role, setRole] = useState('admin')
  const [show, setShow] = React.useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [country_code, setCountryCode] = useState("");
  const [phone, setPhone] = useState("");
  const [loadingDeliv, setLoadingDeliv] = useState(false);
  const [memeberid, setMemberId] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();
  const handleClick = () => setShow(!show);

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

  const validate = () => {
    if (!email) {
      toast.error("Email is required")
      return false
    } else if (!password) {
      toast.error("Password is required")
      return false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email');
      return false;
    }
    return true;
  }


  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true)
    console.log("Email: ", email);
    console.log("Password: ", password);
    if (!validate()) return;

    const loginData = {
      email,
      password
    }

    dispatch(LoginAction(loginData)).then((res) => {
      console.log("Login Response: ", res);
      if (res.success) {
        // toast.success(res.message);
        setLoading(false)
        history.push('/admin/dashboards/default');
      } else {
        setLoading(false)
        toast.error(res.message);
      }
    })

  }

  const handleLoginDelivBoy = (e) => {
    e.preventDefault();

    setLoading(true)

    const loginData = {
      phone_number:phone,
      country_code,
      membership_id: memeberid
    }
    console.log(loginData);

    dispatch(LoginDelivBoyAction(loginData)).then((res) => {
      console.log("Login Response: ", res);
      if (res.success) {
        // toast.success(res.message);
        setLoading(false)
        history.push('/delivery');
      } else {
        setLoading(false)
        toast.error(res.message);
      }
    })


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

        <Box me='auto' mb='24px'>
          <Heading color={textColor} fontSize='36px' mb='20px'>
            Sign In
          </Heading>
          <Tabs position='relative' variant='unstyled' mt='10px' onChange={(index) => setRole(index === 0 ? 'admin' : 'deliveryboy')}>
            <TabList>
              <Tab _selected={{ boxShadow: 'none' }} >Admin</Tab>
              <Tab _selected={{ boxShadow: 'none' }} >Delivery Boy</Tab>
            </TabList>
            <TabIndicator mt='-1.5px' height='2px' bg={role === 'admin' ? 'blue.500' : 'green.500'} borderRadius='1px' />
          </Tabs>
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
            Sign in with Google
          </Button> */}

          {/* <Flex align='center' mb='25px'>
            <HSeparator />
            <Text color='gray.400' mx='14px'>
              or
            </Text>
            <HSeparator />
          </Flex> */}

          {role === 'admin' ?

            <form onSubmit={handleLogin}>
              <FormControl>
                <FormLabel
                  display='flex'
                  ms='4px'
                  fontSize='sm'
                  fontWeight='500'
                  color={textColor}
                  mb='8px'>
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
                <FormLabel
                  ms='4px'
                  fontSize='sm'
                  fontWeight='500'
                  color={textColor}
                  display='flex'
                >
                  Password<Text color={brandStars}>*</Text>
                </FormLabel>
                <InputGroup size='md'>
                  <Input
                    isRequired={true}
                    fontSize='sm'
                    placeholder='Enter Password'
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
                <Flex justifyContent='end' align='center' mb='24px'>
                  {/* <FormControl display='flex' alignItems='center'>
                <Checkbox
                  id='remember-login'
                  colorScheme='brandScheme'
                  me='10px'
                />
                <FormLabel
                  htmlFor='remember-login'
                  mb='0'
                  fontWeight='normal'
                  color={textColor}
                  fontSize='sm'>
                  Keep me logged in
                </FormLabel>
              </FormControl> */}
                  <NavLink to='/auth/forgot-password'>
                    <Text
                      color={textColorBrand}
                      fontSize='sm'
                      w='124px'
                      fontWeight='500'>
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
                  Sign In
                </Button>

                <Button
                  fontSize='sm'
                  colorScheme="green"
                  fontWeight='500'
                  w='100%'
                  h='50'
                  mb='24px'
                  isLoading={loading}
                  onClick={() => {
                    setEmail('prakash@gmail.com');
                    setPassword('111111');
                  }}
                >
                  Test Application
                </Button>
              </FormControl>
              <Flex
                flexDirection='column'
                justifyContent='center'
                alignItems='start'
                maxW='100%'
                mt='0px'>
                <Text color={textColorDetails} fontWeight='400' fontSize='14px'>
                  Not registered yet?
                  <NavLink to='/auth/sign-up'>
                    <Text
                      color={textColorBrand}
                      as='span'
                      ms='5px'
                      fontWeight='500'>
                      Create an Account
                    </Text>
                  </NavLink>
                </Text>
              </Flex>
            </form>
            :
            <form onSubmit={handleLoginDelivBoy} >
              <FormControl id="phone" >
                <FormLabel
                  display='flex'
                  ms='4px'
                  fontSize='sm'
                  fontWeight='500'
                  color={textColor}
                  mb='8px'
                >Phone<Text color={brandStars}>*</Text></FormLabel>
                <Box mb='24px' borderRadius="md" overflow="hidden">
                  <PhoneInput
                    isRequired={true}
                    variant='auth'
                    fontSize='sm'
                    ms={{ base: "0px", md: "0px" }}
                    fontWeight='500'
                    size='lg'

                    international
                    defaultCountry="DE"
                    style={{ width: '100%' }} // Make the input take up the full width of its container
                    onChange={
                      (phoneNumber) => {
                        if (typeof phoneNumber === 'string') {
                          const parsedPhoneNumber = parsePhoneNumber(phoneNumber);
                          if (parsedPhoneNumber) {
                            setCountryCode(parsedPhoneNumber.countryCallingCode)
                            setPhone(parsedPhoneNumber.nationalNumber)
                          }
                        }
                      }
                    }
                    placeholder="Phone"
                    value={phone ? `+${country_code} ${phone}` : ''}
                    inputComponent={Input}
                    inputProps={{
                      _focus: { borderColor: '#ee7213', boxShadow: '0 0 0 1px #ee7213' }
                    }}
                  />
                </Box>
              </FormControl>
              <FormControl id="memberid" mb='24px'  >
                <FormLabel
                  display='flex'
                  ms='4px'
                  fontSize='sm'
                  fontWeight='500'
                  color={textColor}
                  mb='8px'
                >Member ID <Text color={brandStars}>*</Text></FormLabel>
                <Input
                  isRequired={true}
                  variant='auth'
                  fontSize='sm'
                  ms={{ base: "0px", md: "0px" }}
                  placeholder='GvI0uopUiTV1'
                  mb='24px'
                  fontWeight='500'
                  size='lg'
                  type="text"
                  value={memeberid}
                  onChange={(e) => setMemberId(e.target.value)}
                />

                <Button
                  type="submit"
                  fontSize='sm'
                  colorScheme="green"
                  fontWeight='500'
                  w='100%'
                  h='50'
                  mt='20px'
                  mb='24px'
                  isLoading={loadingDeliv}
                >
                  Sign In
                </Button>

                <Button
                  fontSize='sm'
                  colorScheme="blue"
                  fontWeight='500'
                  w='100%'
                  h='50'
                  mb='24px'
                  isLoading={loadingDeliv}
                  onClick={() => {
                    setPhone('111111');
                    setMemberId('GvI0uopUiTV1');
                  }}
                >
                  Test Application
                </Button>
              </FormControl>
            </form>
          }
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SignIn;
