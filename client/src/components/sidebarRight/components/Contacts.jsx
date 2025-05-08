import {
  Box,
  Center,
  Flex,
  Image,
  Heading,
  Text,
  useDisclosure,
  Spinner,
} from "@chakra-ui/react";
import { getSupplierContacts } from "../../../api/index.js";
import { useEffect, useState, useCallback } from "react";
import ContactsModal from "./ContactsModal.jsx";

export default function Contacts() {
  // State to store contacts data
  const [contactsData, setContactsData] = useState([]);
  // State to manage loading state
  const [loading, setLoading] = useState(true);
  // Chakra UI hook to manage modal state
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Function to fetch contacts data from API
  const ContactsAPIFetch = useCallback(() => {
    getSupplierContacts()
      .then((res) => {
        // Set contacts data from API response
        setContactsData(res?.data?.result);
        // Set loading to false after data is fetched
        setLoading(false);
      })
      .catch((err) => {
        // Log error if API call fails
        console.error(err);
        // Set loading to false even if there's an error
        setLoading(false);
      });
  }, []);

  // useEffect to call the API fetch function on component mount
  useEffect(() => {
    ContactsAPIFetch();
  }, [ContactsAPIFetch]);

  return (
    <Box p="20px">
      <Heading fontSize="24px" mb="20px" fontWeight="500">
        Contacts
      </Heading>
      {loading ? (
        // Show spinner while loading
        <Center>
          <Spinner />
        </Center>
      ) : (
        // Display contacts data once loaded
        <Flex direction="column" gap="15px">
          {contactsData
            ?.slice(0, 5) // Display only the first 5 contacts
            ?.map(({ pic, name, countryCode, phone }, i) => (
              <Flex
                key={i}
                alignItems="center"
                gap="15px"
                p="10px"
                bg={"transparent"}
                borderRadius="md"
                boxShadow="sm"
              >
                {pic && (
                  <Center
                    w="50px"
                    h="50px"
                    borderRadius="full"
                    overflow="hidden"
                  >
                    <Image src={pic} w="50px" h="50px" alt="contact icon" />
                  </Center>
                )}
                <Box>
                  <Text fontSize="18px" fontWeight="bold" color={"white"}>
                    {name}
                  </Text>
                  <Text fontSize="16px" color={"white"}>
                    +{countryCode} {phone}
                  </Text>
                </Box>
              </Flex>
            ))}
          <Box
            style={{ cursor: "pointer", textAlign: "center" }}
            onClick={onOpen}
          >
            Show All
          </Box>
        </Flex>
      )}
      <ContactsModal
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
        contactsData={contactsData}
      />
    </Box>
  );
}
