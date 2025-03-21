/* eslint-disable react/prop-types */
// Chakra imports
import { Box, Flex } from "@chakra-ui/react";
import PropTypes from "prop-types";
import Footer from "../../components/footer/FooterAuth";
import FixedPlugin from "../../components/fixedPlugin/FixedPlugin";
// Custom components
// Assets

function AuthIllustration(props) {
  const { children, illustrationBackground } = props;
  // Chakra color mode
  return (
    <Flex position="relative" h="max-content">
      <Flex
        h={{
          sm: "initial",
          md: "unset",
          lg: "100vh",
          xl: "97vh",
        }}
        w="100%"
        maxW={{ md: "66%", lg: "1313px" }}
        mx="auto"
        pt={{ sm: "50px", md: "0px" }}
        px={{ lg: "30px", xl: "0px" }}
        ps={{ xl: "70px" }}
        justifyContent="start"
        direction="column"
      >
        {/* Placeholder for navigation link to admin page */}
        {/* <NavLink
          to='/admin'
          style={() => ({
            width: "fit-content",
            marginTop: "40px",
          })}>
          <Flex
            align='center'
            ps={{ base: "25px", lg: "0px" }}
            pt={{ lg: "0px", xl: "0px" }}
            w='fit-content'>
            <Icon
              as={FaChevronLeft}
              me='12px'
              h='13px'
              w='8px'
              color='secondaryGray.600'
            />
            <Text ms='0px' fontSize='sm' color='secondaryGray.600'>
              Back to Simmmmmmmmmmmmple
            </Text>
          </Flex>
        </NavLink> */}

        {/* Render children components */}
        {children}

        {/* Background illustration box */}
        <Box
          display={{ base: "none", md: "block" }}
          h="100%"
          minH="100vh"
          w={{ lg: "50vw", "2xl": "44vw" }}
          position="absolute"
          right="0px"
        >
          <Flex
            bg={`url(${illustrationBackground})`}
            justify="center"
            align="end"
            w="100%"
            h="100%"
            bgSize="cover"
            bgPosition="50%"
            position="absolute"
            borderBottomLeftRadius={{ lg: "120px", xl: "200px" }}
          ></Flex>
        </Box>

        {/* Footer component */}
        <Footer />
      </Flex>

      {/* Fixed plugin component */}
      <FixedPlugin />
    </Flex>
  );
}

// PROPS

AuthIllustration.propTypes = {
  illustrationBackground: PropTypes.string,
  image: PropTypes.any,
};

export default AuthIllustration;
