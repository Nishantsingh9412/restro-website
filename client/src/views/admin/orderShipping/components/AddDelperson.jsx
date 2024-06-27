import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PhoneInput from 'react-phone-number-input'
import { parsePhoneNumber } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
    Box
} from '@chakra-ui/react'

import { useDispatch, useSelector } from 'react-redux';
import { AddDelboyAction } from '../../../../redux/action/delboy.js'

const AddDelperson = (props) => {

    const dispatch = useDispatch();
    const isOpen = props.isOpen;
    const onOpen = props.onOpen;
    const onClose = props.onClose;
    const [supplierName, setSupplierName] = useState('');
    const [phone_no, setPhone_no] = useState('');
    const [countryCode, setCountryCode] = useState('');
    const [loading, setLoading] = useState(false);

    const localData = JSON.parse(localStorage.getItem('ProfileData'));
    const AdminUserId = localData?.result?._id;


    // const handleAutoAddValues = () => {
    //     setSupplierName('Tester')
    //     // setPhone_no('8744444444')
    //     // setCountryCode(91)
    // }

    const handleAddDelivBoy = async (e) => {
        e.preventDefault();
        console.log(supplierName, phone_no, countryCode);
        setLoading(true);

        const delboyData = {
            name: supplierName,
            country_code: countryCode,
            phone: phone_no,
            created_by: AdminUserId
        };


        dispatch(AddDelboyAction(delboyData))
            .then((res) => {
                if (res.success) {
                    onClose();
                    setSupplierName('');
                    setPhone_no('');
                    setCountryCode('');
                    toast.success(res.message)
                } else {
                    toast.error(res.message)
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div>
            <ToastContainer />
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add Delivery Boy</ModalHeader>
                    <Button
                        // onClick={handleAutoAddValues}
                    >  + </Button>
                    <ModalCloseButton />
                    <ModalBody>
                        <form onSubmit={handleAddDelivBoy}>
                            <FormControl id="suppliername" isRequired>
                                <FormLabel>Supplier Name</FormLabel>
                                <Input
                                    type="text"
                                    onChange={(e) => setSupplierName(e.target.value)}
                                    _focus={{ borderColor: '#ee7213', boxShadow: '0 0 0 1px #ee7213' }}
                                />
                            </FormControl>

                            <FormControl id="phone" isRequired>
                                <FormLabel>Phone</FormLabel>
                                <Box borderRadius="md" overflow="hidden">
                                    <PhoneInput
                                        international
                                        defaultCountry="DE"
                                        style={{ width: '100%' }}
                                        onChange={
                                            (phoneNumber) => {
                                                if (typeof phoneNumber === 'string') {
                                                    const parsedPhoneNumber = parsePhoneNumber(phoneNumber);
                                                    if (parsedPhoneNumber) {
                                                        setCountryCode(parsedPhoneNumber.countryCallingCode)
                                                        setPhone_no(parsedPhoneNumber.nationalNumber)
                                                    }
                                                }
                                            }
                                        }
                                        placeholder="Phone"
                                        inputComponent={Input}
                                        inputProps={{
                                            _focus: { borderColor: '#ee7213', boxShadow: '0 0 0 1px #ee7213' }
                                        }}
                                    />
                                </Box>
                            </FormControl>

                            {/* This field is implicitly created and updated based on the phone number input */}
                            <FormControl id="countryCode" isHidden>
                                <Input
                                    type="hidden"
                                />
                            </FormControl>

                            <Button
                                mt="4"
                                bg="#ee7213"
                                color="white"
                                isLoading={loading}
                                type="submit"
                                _hover={{ bg: '#ff8c42' }}
                                marginBottom={'1rem'}
                            >
                                Add Delivery Boy
                            </Button>
                        </form>
                    </ModalBody>

                    {/* <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter> */}
                </ModalContent>
            </Modal>
        </div >
    )
}

export default AddDelperson
