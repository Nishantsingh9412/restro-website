/* eslint-disable react/prop-types */
import { useState, useMemo } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Image,
  Box,
  Text,
  Flex,
  Center,
  Input,
} from "@chakra-ui/react";

const ContactsModal = ({ isOpen, onClose, contactsData }) => {
  // State to manage the search query input by the user
  const [searchQuery, setSearchQuery] = useState("");

  // Handler for search input changes
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Memoized contacts list to avoid unnecessary re-renders
  const renderedContacts = useMemo(() => {
    // Filter contacts based on the search query
    const filteredContacts = searchQuery.trim()
      ? contactsData.filter((contact) =>
          contact.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : contactsData;

    // Render the list of contacts
    if (filteredContacts?.length > 0) {
      return filteredContacts.map((item, i) => (
        <Flex
          key={i}
          alignItems="center"
          gap="15px"
          p="10px"
          bg={"transparent"}
          borderRadius="md"
          boxShadow="sm"
        >
          {item.pic && (
            <Center w="50px" h="50px" borderRadius="full" overflow="hidden">
              <Image src={item.pic} w="50px" h="50px" alt="contact icon" />
            </Center>
          )}
          <Box>
            <Text fontSize="18px" fontWeight="bold" color={"gray.800"}>
              {item.name}
            </Text>
            <Text fontSize="16px" color={"gray.800"}>
              +{item.countryCode} {item.phone}
            </Text>
          </Box>
        </Flex>
      ));
    }

    // Show message if no contacts are found
    return (
      <Text fontSize={"large"} textAlign={"center"}>
        No contacts found
      </Text>
    );
  }, [contactsData, searchQuery]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Contact Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Search Bar */}
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={handleSearchChange}
            mb="15px"
            _focus={{
              borderColor: "#ee7213",
              boxShadow: "0 0 0 1px #ee7213",
            }}
          />
          {/* Rendered Contacts */}
          <Flex
            direction="column"
            gap="15px"
            maxH="400px"
            overflowY="auto"
            css={{
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#ee7213",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: "#d65f0c",
              },
            }}
          >
            {renderedContacts}
          </Flex>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
};

export default ContactsModal;
