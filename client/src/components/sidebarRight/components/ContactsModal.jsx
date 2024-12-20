/* eslint-disable react/prop-types */
import { useEffect, useState, useCallback, useMemo } from "react";
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
  Spinner,
} from "@chakra-ui/react";
import { searchContactsAPI } from "../../../api/index.js";
import { debounce } from "lodash"; // Ensure lodash is installed for debouncing

const ContactsModal = ({ isOpen, onClose, contactsData }) => {
  // State to manage the search query input by the user
  const [searchQuery, setSearchQuery] = useState("");
  // State to store the search results from the API
  const [searchResult, setSearchResult] = useState([]);
  // State to manage the loading spinner visibility
  const [loading, setLoading] = useState(false);

  // Function to search contacts with debouncing to limit API calls
  const searchContacts = useCallback(
    debounce((query) => {
      setLoading(true);
      searchContactsAPI(query)
        .then((res) => {
          setSearchResult(res?.data?.result || []);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 500),
    [] // Adjust the debounce delay as needed
  );

  // Effect to trigger the search function when the search query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      searchContacts(searchQuery);
    }
  }, [searchQuery, searchContacts]);

  // Handler for search input changes
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Memoized contacts list to avoid unnecessary re-renders
  const renderedContacts = useMemo(() => {
    // Determine which contacts to display based on search query and loading state
    const contacts = searchQuery.trim()
      ? searchResult
      : contactsData?.slice(0, 5);

    // Show spinner while loading
    if (loading) {
      return <Spinner size="lg" />;
    }

    // Render the list of contacts
    if (contacts?.length > 0) {
      return contacts.map((item, i) => (
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
  }, [searchResult, contactsData, searchQuery, loading]);

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
          <Flex direction="column" gap="15px">
            {renderedContacts}
          </Flex>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
};

export default ContactsModal;
