import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import PhoneInput, { parsePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
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
  Tabs,
  TabList,
  Tab,
  TabIndicator,
  useColorModeValue,
  Spinner,
} from "@chakra-ui/react";
import DefaultAuth from "../../../layouts/auth/Default.jsx";
import illustration from "../../../assets/img/auth/login-img.png";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { loginAdmin, loginEmployee } from "../../../redux/action/auth.js";

function SignIn() {
  // Define color modes for different elements
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const textColorDetails = useColorModeValue("navy.700", "secondaryGray.600");
  const textColorBrand = useColorModeValue("blue", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");

  // State variables
  const [role, setRole] = useState("admin");
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    country_code: "",
    phone: "",
    memberId: "",
  });
  const [loading, setLoading] = useState(false);

  // Redux dispatch and navigation hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("ProfileData"));
    console.log("USER", user);

    const role = user?.result?.role;
    if (role === "admin" && user) {
      navigate("/admin/dashboards/default");
    } else if (user) {
      navigate("/delivery/dashboard");
    }
    setLoading(false);
  }, [navigate]);

  // Toggle password visibility
  const handleClick = () => setShow(!show);

  // Validate form data
  const validate = () => {
    if (!formData.email) {
      toast.error("Email is required");
      return false;
    } else if (!formData.password) {
      toast.error("Password is required");
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email");
      return false;
    }
    return true;
  };

  // Handle admin login
  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    if (!validate()) return;

    const loginData = { email: formData.email, password: formData.password };

    dispatch(loginAdmin(loginData))
      .then((res) => {
        setLoading(false);
        if (res.payload.success) {
          navigate("/admin/dashboards/default");
        } else {
          toast.error(res.error.message);
        }
      })
      .catch((err) => {
        console.log("ERROR", err);
      });
  };

  const handleRouteByRole = (role) => {
    switch (role) {
      case "Waiter":
        navigate("/waiter/dashboard");
        break;
      case "Delivery Boy":
        navigate("/delivery/dashboard");
        break;
      default:
        navigate("/");
    }
  };

  // Handle employee boy login
  const handleLoginEmployee = (e) => {
    e.preventDefault();
    setLoading(true);

    const loginData = {
      phone: "+" + formData.country_code + formData.phone,
      country_code: formData.country_code,
      membership_id: formData.memberId,
    };

    dispatch(loginEmployee(loginData)).then((res) => {
      console.log(res.payload);
      setLoading(false);
      if (res.payload.success) {
        const employee = res?.payload?.result?.role;
        handleRouteByRole(employee);
      } else {
        toast.error(res.payload);
      }
    });
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Render input field
  const renderInputField = (
    label,
    name,
    type = "text",
    placeholder = "",
    isRequired = true
  ) => (
    <FormControl id={name} mb="24px">
      <FormLabel
        display="flex"
        ms="4px"
        fontSize="sm"
        fontWeight="500"
        color={textColor}
        mb="8px"
      >
        {label} <Text color={brandStars}>*</Text>
      </FormLabel>
      <Input
        isRequired={isRequired}
        variant="auth"
        fontSize="sm"
        placeholder={placeholder}
        mb="24px"
        fontWeight="500"
        size="lg"
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
      />
    </FormControl>
  );

  // Render admin login form
  const renderAdminForm = () => (
    <form onSubmit={handleLogin}>
      {renderInputField("Email", "email", "email", "mail@example.com")}
      <FormControl>
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
            placeholder="Enter Password"
            mb="24px"
            size="lg"
            type={show ? "text" : "password"}
            variant="auth"
            name="password"
            value={formData.password}
            onChange={handleChange}
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
      </FormControl>
      <Flex justifyContent="end" align="center" mb="24px">
        <NavLink to="/auth/forgot-password">
          <Text color={textColorBrand} fontSize="sm" w="124px" fontWeight="500">
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
        Sign In
      </Button>
      <Button
        fontSize="sm"
        colorScheme="green"
        fontWeight="500"
        w="100%"
        h="50"
        mb="24px"
        onClick={() => {
          setFormData({
            ...formData,
            email: "nizx@gmail.com",
            password: "123456",
          });
        }}
      >
        Test Application
      </Button>
      <Flex
        flexDirection="column"
        justifyContent="center"
        alignItems="start"
        maxW="100%"
        mt="0px"
      >
        <Text color={textColorDetails} fontWeight="400" fontSize="14px">
          Not registered yet?
          <NavLink to="/auth/sign-up">
            <Text color={textColorBrand} as="span" ms="5px" fontWeight="500">
              Create an Account
            </Text>
          </NavLink>
        </Text>
      </Flex>
    </form>
  );

  // Render employee boy login form
  const renderEmployeeForm = () => (
    <form onSubmit={handleLoginEmployee}>
      <FormControl id="phone">
        <FormLabel
          display="flex"
          ms="4px"
          fontSize="sm"
          fontWeight="500"
          color={textColor}
          mb="8px"
        >
          Phone<Text color={brandStars}>*</Text>
        </FormLabel>
        <Box mb="24px" borderRadius="md" overflow="hidden">
          <PhoneInput
            isRequired
            variant="auth"
            fontSize="sm"
            international
            defaultCountry="DE"
            style={{ width: "100%" }}
            onChange={(phoneNumber) => {
              if (typeof phoneNumber === "string") {
                const parsedPhoneNumber = parsePhoneNumber(phoneNumber);
                if (parsedPhoneNumber) {
                  setFormData((prevState) => ({
                    ...prevState,
                    country_code: parsedPhoneNumber.countryCallingCode,
                    phone: parsedPhoneNumber.nationalNumber,
                  }));
                }
              }
            }}
            placeholder="Phone"
            value={
              formData.phone
                ? `+${formData.country_code} ${formData.phone}`
                : ""
            }
            inputComponent={Input}
            inputProps={{
              _focus: {
                borderColor: "#ee7213",
                boxShadow: "0 0 0 1px #ee7213",
              },
            }}
          />
        </Box>
      </FormControl>
      {renderInputField("Member ID", "memberId", "text", "GvI0uopUiTV1")}
      <Button
        type="submit"
        fontSize="sm"
        colorScheme="green"
        fontWeight="500"
        w="100%"
        h="50"
        mt="20px"
        mb="24px"
        isLoading={loading}
      >
        Sign In
      </Button>
      <Button
        fontSize="sm"
        colorScheme="blue"
        fontWeight="500"
        w="100%"
        h="50"
        mb="24px"
        onClick={() => {
          setFormData({
            ...formData,
            phone: "1234567892",
            country_code: "91",
            memberId: "DxB3SYiOIW",
          });
        }}
      >
        Test Application
      </Button>
    </form>
  );

  // Render loader
  const renderLoader = () => (
    <Flex justifyContent="center" alignItems="center" h="100vh">
      <Spinner size="xl" color="blue.500" />
    </Flex>
  );

  if (loading) return renderLoader();

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
        <Box me="auto" mb="24px">
          <Heading color={textColor} fontSize="36px" mb="20px">
            Sign In
          </Heading>
          <Tabs
            position="relative"
            variant="unstyled"
            mt="10px"
            onChange={(index) => setRole(index === 0 ? "admin" : "employee")}
          >
            <TabList>
              <Tab _selected={{ boxShadow: "none" }}>Admin</Tab>
              <Tab _selected={{ boxShadow: "none" }}>Employee</Tab>
            </TabList>
            <TabIndicator
              mt="-1.5px"
              height="2px"
              bg={role === "admin" ? "blue.500" : "green.500"}
              borderRadius="1px"
            />
          </Tabs>
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
          {role === "admin" ? renderAdminForm() : renderEmployeeForm()}
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SignIn;
