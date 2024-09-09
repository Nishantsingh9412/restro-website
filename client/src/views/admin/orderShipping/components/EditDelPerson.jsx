import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
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

import {
    useDispatch,
    useSelector
} from 'react-redux';
import {
    // AddDelboyAction,
    getSingleDelBoyAction,
    updateSingleDelBoyAction
} from '../../../../redux/action/delboy.js'

const EditDelPerson = (props) => {

    const dispatch = useDispatch();
    const isOpen = props.isOpen;
    const onOpen = props.onOpen;
    const onClose = props.onClose;
    const EditDelBoyId = props.EditDelBoyId;

    const [supplierName, setSupplierName] = useState('');
    const [phone_no, setPhone_no] = useState('');
    const [countryCode, setCountryCode] = useState('');
    const [loading, setLoading] = useState(false);

    // Getting local storage data
    // const localData = JSON.parse(localStorage.getItem('ProfileData'));
    // const AdminUserId = localData?.result?._id;

    // Getting single delivery boy data for edit 
    const delBoyData = useSelector((state) => state?.delBoyReducer?.selectedDelBoy);


    const handleUpdateDelivBoy = async (e) => {
        e.preventDefault();
        setLoading(true);
        const UpdatedDelboyData = {
            name: supplierName,
            country_code: countryCode,
            phone: phone_no,
        };

        dispatch(updateSingleDelBoyAction(EditDelBoyId, UpdatedDelboyData))
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

    useEffect(() => {
        dispatch(getSingleDelBoyAction(EditDelBoyId))
    }, [isOpen]);

    useEffect(() => {
        if (delBoyData) {
            setSupplierName(delBoyData.name);
            setPhone_no(delBoyData.phone);
            setCountryCode(`${delBoyData.country_code}`);
        }
    }, [delBoyData]);

    useEffect(() => {
        if (delBoyData) {
            setSupplierName('');
            setPhone_no('');
            setCountryCode('');
        }
    }, [onClose])

    return (
        <div>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Update Delivery Boy</ModalHeader>
                    {/* 
                    <Button
                        onClick={handleAutoAddValues}
                    >  + </Button>
                     */}
                    <ModalCloseButton />
                    <ModalBody>
                        <form onSubmit={handleUpdateDelivBoy}>
                            <FormControl id="suppliername" isRequired>
                                <FormLabel>Supplier Name</FormLabel>
                                <Input
                                    type="text"
                                    value={supplierName}
                                    onChange={(e) =>
                                        setSupplierName(e.target.value)
                                    }
                                    _focus={{
                                        borderColor: '#ee7213',
                                        boxShadow: '0 0 0 1px #ee7213'
                                    }}
                                />
                            </FormControl>

                            <FormControl id="phone" isRequired>
                                <FormLabel>Phone</FormLabel>
                                <Box borderRadius="md" overflow="hidden">
                                    <PhoneInput
                                        international
                                        defaultCountry="DE"
                                        value={`+${countryCode}${phone_no}`} // Concatenate country code and phone number  
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
                                Save
                            </Button>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div >
    )
}

export default EditDelPerson
