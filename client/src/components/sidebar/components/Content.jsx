import { Box, Flex, Stack } from "@chakra-ui/react";
import Brand from "./Brand";
import Links from "./Links";
import SidebarCard from "./SidebarCard";

// SidebarContent component definition
// eslint-disable-next-line react/prop-types
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
        <Box ps="20px">
          <Links routes={routes} />
        </Box>
      </Stack>

      {/* SidebarCard component at the bottom of the sidebar */}
      <Box mt="60px" mb="40px" borderRadius="30px">
        <SidebarCard />
      </Box>
    </Flex>
  );
}

export default SidebarContent;
