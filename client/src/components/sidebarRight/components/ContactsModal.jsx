import  { useEffect, useState } from 'react'
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
} from '@chakra-ui/react'
import { searchContactsAPI } from '../../../api/index.js'

const ContactsModal = ({ isOpen, onClose, onOpen, contactsData }) => {

    const [searchQuery, setSearchQuery] = useState('')
    const [searchResult, setSearchResult] = useState([])
    console.log(searchQuery)
    console.log(searchResult)

    const SearchContacts = () => {
        searchContactsAPI(searchQuery).then((res) => {  
            setSearchResult(res?.data?.result)
        }).catch((err) => {
            console.error(err);
        }).finally(() => {
            console.log('Search Contacts API Call completed succeessfully');
        })
    }


    useEffect(() => {
        SearchContacts();
    }, [searchQuery])

    return (
        <div>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Contact Details</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {/* Search Bar  */}
                        <Input
                            placeholder="Search contacts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            mb="15px"
                        />
                        {
                            searchQuery ? (
                                searchResult && searchResult.length > 0 ? (
                                    <Flex direction="column" gap="15px">
                                        {searchResult.map((item, i) => (
                                            <Flex
                                                key={i}
                                                alignItems="center"
                                                gap="15px"
                                                p="10px"
                                                bg={'transparent'}
                                                borderRadius="md"
                                                boxShadow="sm"
                                            >
                                                {item.pic && (
                                                    <Center w="50px" h="50px" borderRadius="full" overflow="hidden">
                                                        <Image src={item.pic} w="50px" h="50px" alt="contact icon" />
                                                    </Center>
                                                )}
                                                <Box>
                                                    <Text fontSize="18px" fontWeight="bold" color={'gray.800'}>
                                                        {item.name}
                                                    </Text>
                                                    <Text fontSize="16px" color={'gray.800'}>
                                                        +{item.countryCode} {item.phone}
                                                    </Text>
                                                </Box>
                                            </Flex>
                                        ))}
                                    </Flex>
                                ) : (
                                    <Text
                                        fontSize={'large'}
                                        textAlign={'center'}
                                    >
                                        No supplier found
                                    </Text>
                                )
                            ) : (
                                <Flex direction="column" gap="15px">
                                    {contactsData?.slice(0,5)?.map((item, i) => (
                                        <Flex
                                            key={i}
                                            alignItems="center"
                                            gap="15px"
                                            p="10px"
                                            bg={'transparent'}
                                            borderRadius="md"
                                            boxShadow="sm"
                                        >
                                            {item.pic && (
                                                <Center w="50px" h="50px" borderRadius="full" overflow="hidden">
                                                    <Image src={item.pic} w="50px" h="50px" alt="contact icon" />
                                                </Center>
                                            )}
                                            <Box>
                                                <Text fontSize="18px" fontWeight="bold" color={'gray.800'}>
                                                    {item.name}
                                                </Text>
                                                <Text fontSize="16px" color={'gray.800'}>
                                                    +{item.countryCode} {item.phone}
                                                </Text>
                                            </Box>
                                        </Flex>
                                    ))}
                                </Flex>
                            )
                        }
                    </ModalBody>

                    <ModalFooter>
                        {/* <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button> */}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div >
    )
}

export default ContactsModal
