/* eslint-disable react/prop-types */
import { Box, VStack, Flex, Text, HStack, IconButton } from "@chakra-ui/react";
import { IoMdTrash } from "react-icons/io";
import { IoEyeOff, IoLocate, IoPencil } from "react-icons/io5";
import { MdOfflinePin } from "react-icons/md";

import { CgUnavailable } from "react-icons/cg";

// DeliveryBoyCard component to display delivery boy details
const DeliveryBoyCard = ({ boy, handleDeleteDelboy, handleEdit }) => {
  return (
    <Box
      p="6"
      boxShadow="lg"
      borderWidth="1px"
      borderRadius="lg"
      bg="white"
      _hover={{ boxShadow: "xl" }}
      transition="all 0.3s"
    >
      <VStack align="start" spacing="2">
        {/* Flex container for name and action buttons */}
        <Flex w="full" justifyContent="space-between">
          <Text fontWeight="bold" fontSize="lg">
            {boy?.name} {/* Display delivery boy's name */}
          </Text>
          <HStack spacing="2">
            {/* Edit button */}
            {/* <IconButton
              icon={<IoPencil />}
              aria-label="Edit"
              colorScheme="yellow"
              size="sm"
              onClick={() => handleEdit(boy)}
            />
            {/* Delete button */}
            {/* <IconButton
              icon={<IoMdTrash />}
              aria-label="Delete"
              colorScheme="red"
              size="sm"
              onClick={(e) => handleDeleteDelboy(e, boy._id)} // Handle delete action
            /> */}
            {/* Show offline icon when delivery boy is offline */}
            {!boy?.is_online ? (
              <IconButton
                icon={<CgUnavailable />}
                aria-label="Offline"
                colorScheme="gray"
                size="xl"
                isDisabled
                title="Offline"
              />
            ) : (
              <IconButton
                icon={<IoLocate />}
                aria-label="Location Track"
                colorScheme="blue"
                size="sm"
                onClick={() => window.open(boy?.liveLocationURL, "_blank")} // Redirect to the live location URL
              />
            )}
          </HStack>
        </Flex>
        <Text>Phone: {boy?.phone}</Text>
        {/* Display delivery boy's country code */}
        <Text>Country Code: {boy?.country_code}</Text>
      </VStack>
    </Box>
  );
};

export default DeliveryBoyCard;
