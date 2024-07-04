import { Box, Center, Flex, Image, Heading, Text, useColorModeValue, useDisclosure } from '@chakra-ui/react';

import { supplierContactsAPI } from '../../../api/index.js';
import { useEffect, useState } from 'react';
import ContactsModal from './ContactsModal.jsx';

export default function Contacts() {
  const [contactsData, setContactsData] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure()

  const ContactsAPIFetch = () => {
    supplierContactsAPI()
      .then((res) => {
        setContactsData(res?.data?.result);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    ContactsAPIFetch();
  }, []);



  const cardBg = useColorModeValue('white', 'gray.700');
  const cardHoverBg = useColorModeValue('gray.100', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');

  return (
    <Box p="20px">
      <Heading fontSize="24px" mb="20px" fontWeight="500">
        Contacts
      </Heading>
      <Flex direction="column" gap="15px">
        {contactsData?.slice(0, 5)?.map((item, i) => (
          <Flex
            key={i}
            alignItems="center"
            gap="15px"
            p="10px"
            bg={'transparent'}
            borderRadius="md"
            boxShadow="sm"
          // _hover={{ bg: cardHoverBg }}
          // transition="background 0.2s"
          >
            {item?.pic && (
              <Center w="50px" h="50px" borderRadius="full" overflow="hidden">
                <Image src={item.pic} w="50px" h="50px" alt="contact icon" />
              </Center>
            )}
            <Box>
              <Text fontSize="18px" fontWeight="bold" color={'white'}>
                {item.name}
              </Text>
              <Text fontSize="16px" color={'white'}>
                +{item.countryCode} {item.phone}
              </Text>
            </Box>
          </Flex>
        ))}
        <Box
          style={{ cursor: 'pointer', textAlign: 'center' }}
          onClick={() => {
            onOpen();
          }}
        > Show  All  </Box>
      </Flex>
      {/* Contacts Modal Start */}
      <ContactsModal
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
        contactsData={contactsData}
      />
      {/* Contacts Modal end */}
    </Box>
  );
}
