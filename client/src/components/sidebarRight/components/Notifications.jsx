/* eslint-disable react/prop-types */
import { Box, Center, Flex, Heading, Icon, Text } from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";

// Notifications component to display a list of notifications
export default function Notifications({ data }) {
  return (
    // Container Box for the notifications
    <Box
      w="90%"
      marginInline="auto"
      bg="var(--primary-accent)"
      color="#fff"
      p="20px"
      borderRadius="50px"
    >
      {/* Heading for the notifications section */}
      <Heading fontSize="24px" mb="10px" mt="20px" fontWeight="500">
        Notifications
      </Heading>

      {/* Flex container to hold the list of notifications */}
      <Flex direction="column" gap="10px">
        {/* Map through the data array to render each notification */}
        {data.map((item, i) => (
          // Flex container for each notification item
          <Flex key={i} alignItems="center" gap="20px">
            {/* Conditionally render the icon if it is available */}
            {item.iconDetails?.isAvailable && (
              <Center
                minW="25px"
                minH="25px"
                h="fit-content"
                bg={item.iconDetails?.bg}
                borderRadius="5px"
              >
                {/* Render the icon */}
                <Icon as={item.iconDetails?.icon} w="15px" h="15px" />
              </Center>
            )}
            {/* Box to hold the title and time of the notification */}
            <Box>
              {/* Notification title */}
              <Text fontSize="18px">{item.title}</Text>
              {/* Notification time formatted to show relative time */}
              <Text style={{ color: "#eee", fontSize: "14px" }}>
                {item.time
                  ? formatDistanceToNow(new Date(item.time), {
                      addSuffix: true,
                    })
                  : ""}
              </Text>
            </Box>
          </Flex>
        ))}
      </Flex>
    </Box>
  );
}
