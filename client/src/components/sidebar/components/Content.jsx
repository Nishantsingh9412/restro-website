import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";
import Brand from "./Brand";
import Links from "./Links";

// SidebarContent component definition
function SidebarContent({ routes }) {
  return (
    <Flex
      direction="column"
      height="100%"
      pt="25px"
      borderRadius="30px"
      color="#fff"
    >
      {/* Brand component at the top of the sidebar */}
      <Brand />

      {/* Links section */}
      <Stack direction="column" mb="auto" mt="8px">
        <Box ps="25px">
          <Links routes={routes} />
        </Box>
      </Stack>

      <Box mt="10px" mb="40px" borderRadius="30px">
        <Text color={"#fff"} fontSize="sm" textAlign="center">
          {"Upgrade to PRO"}
        </Text>
      </Box>
    </Flex>
  );
}
SidebarContent.propTypes = {
  routes: PropTypes.array.isRequired,
};

export default SidebarContent;
