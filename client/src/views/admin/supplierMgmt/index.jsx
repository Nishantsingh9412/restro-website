import React, { useEffect, useState } from 'react'
import PhoneInput from 'react-phone-number-input'
import { parsePhoneNumber } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { FiPlusCircle } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoPlusCircle } from "react-icons/go";
import {
    Modal,
    Box,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Text,
    Input
} from '@chakra-ui/react'
import SupplierCards from "./components/SupplierCards"
import { AddNewSupplierAction, GetAllSuppliersAction } from "../../../redux/action/supplier";
import styles from './SupplierManagement.module.css'

export default function SupplierManagement() {

    const dispatch = useDispatch();
    const [suppliername, setSupplierName] = useState('');
    const [pic, setPic] = useState(undefined);
    const [Items, setItem] = useState([]);
    const [email, setEmail] = useState('');
    const [countryCode, setCountryCode] = useState('');
    const [phone_no, setPhone_no] = useState('');
    const [supplierLocation, setSupplierLocation] = useState('');
    const [loading, setLoading] = useState(false);

    const localData = JSON.parse(localStorage.getItem('ProfileData'));
    const localStorageId = localData?.result?._id;

    const postSupplierImage = (pics) => {
        console.log("This is Image Data \n")
        console.log(pics);
        setLoading(true);
        if (pics === undefined) {
            toast.error("Please upload a picture")
            setLoading(false);
            return;
        }
        if (pics.type !== 'image/jpeg' && pics.type !== 'image/png') {
            toast.error('Invalid image format');
            setLoading(false);
            return;
        }
        if (pics.size > 2000000) {
            setLoading(false);
            return toast.error('Image size should be less than 2 MB ')
        }

        const data = new FormData();
        data.append('file', pics);
        data.append('upload_preset', 'restro-website');
        data.append('cloud_name', 'dezifvepx');
        fetch('https://api.cloudinary.com/v1_1/dezifvepx/image/upload', {
            method: 'post',
            body: data
        }).then(res => res.json()).then(data => {
            setPic(data.url.toString());
            console.log(data);
            // setPicLogoUploaded(true);
            setLoading(false);
        }).catch(err => {
            console.log(err);
            setLoading(false);
            return toast.error('Error Uploading Image to server')
        })
    }


    const OverlayOne = () => (
        <ModalOverlay
        // bg='blackAlpha.800'
        // backdropFilter='blur(10px) hue-rotate(90deg)'
        />
    )

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [overlay, setOverlay] = useState(<OverlayOne />)


    const resetStates = () => {
        setSupplierName('');
        setItem([]);
        setEmail('');
        setCountryCode('');
        setPhone_no('');
        setSupplierLocation('');
        setPic(undefined);
    }

    const handleAddSupplier = (e) => {
        e.preventDefault();
        const newSupplier = {
            name: suppliername,
            pic,
            Items,
            countryCode,
            phone: phone_no,
            email,
            location: supplierLocation,
            created_by: localStorageId
        }
        // console.log("This is new Supplier Data \n");
        // console.log(newSupplier);
        dispatch(AddNewSupplierAction(newSupplier)).then((res) => {
            if (res.success) {
                resetStates();
                toast.success('Item Added successfully');
                onClose();
            } else {
                toast.error(res.message);
            }
        })
    }

    useEffect(() => {
        dispatch(GetAllSuppliersAction(localStorageId));
    }, [])

    const allSuppliers = useSelector(state => state.supplierReducer.suppliers);
    const selectedSupplier = useSelector(state => state.supplierReducer.seletectedSupplier);
    // console.log(" allstates Data \n")
    // console.log(allSuppliers);

    // const AutoAddSupplier = () => {
    //     setSupplierName('Supplier 1');
    //     setItem(['Item 1', 'Item 2', 'Item 3']);
    //     setEmail('supplier1@gmail.com');
    //     setCountryCode('91');
    //     setPhone_no('1234567890');
    //     setSupplierLocation('Location 1');
    // }

    return (
        <div>
            <ToastContainer />
            <div>
                <SupplierCards
                    data={allSuppliers}
                    selectedSupplier={selectedSupplier}
                />
            </div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    position: 'fixed',
                    bottom: '40px',
                    right: '40px',
                }}
            >

                <div style={{
                    background: '#4caf50',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'end',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                }} className={styles.plusBtn}  >
                    <GoPlusCircle
                        onClick={() => {
                            setOverlay(<OverlayOne />)
                            onOpen();
                        }}
                        size={'60'} />
                </div>
            </div>
            {/* Add supplier Modal Starts  */}
            <>
                <Modal isCentered isOpen={isOpen} onClose={onClose}>
                    {overlay}
                    <ModalContent
                        background={'#F3F2EE'}
                        color={'#ee7213'}
                    >
                        <ModalHeader>
                            <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                gap="10px"
                            >
                                <FiPlusCircle />
                                <Text>Add Supplier</Text>
                            </Box>


                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            {/* <Text> This is custom Backdrop Filter ! </Text> */}
                            {/* Form Start */}
                            <Box maxW="sm" m="auto" p="4" borderWidth="1px" borderRadius="lg" background={'whiteAlpha.100'}>
                                <form onSubmit={handleAddSupplier}>
                                    <FormControl id="suppliername" isRequired>
                                        <FormLabel>Supplier Name</FormLabel>
                                        <Input
                                            type="text"
                                            onChange={(e) => setSupplierName(e.target.value)}
                                            _focus={{ borderColor: '#ee7213', boxShadow: '0 0 0 1px #ee7213' }}
                                        // value={itemName}
                                        />
                                    </FormControl>

                                    <FormControl id="items" isRequired>
                                        <FormLabel>Items  (separate by comma) </FormLabel>
                                        <Input
                                            type="text"
                                            onChange={(e) => setItem(e.target.value.split(','))}
                                            placeholder={"Tomato,Cauliflower,Brinjal"}
                                            _focus={{ borderColor: '#ee7213', boxShadow: '0 0 0 1px #ee7213' }}
                                        />
                                    </FormControl>

                                    <FormControl id="phone" >
                                        <FormLabel>Phone</FormLabel>
                                        <Box borderRadius="md" overflow="hidden">
                                            <PhoneInput
                                                international
                                                defaultCountry="DE"
                                                style={{ width: '100%' }} // Make the input take up the full width of its container
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

                                    <FormControl id="email" >
                                        <FormLabel>Email</FormLabel>
                                        <Input
                                            type="email"
                                            onChange={(e) => setEmail(e.target.value)}
                                            _focus={{ borderColor: '#ee7213', boxShadow: '0 0 0 1px #ee7213' }}
                                        />
                                    </FormControl>

                                    <FormControl id="location">
                                        <FormLabel> Location  </FormLabel>
                                        <Input
                                            type="text"
                                            placeholder="Location"
                                            onChange={(e) => setSupplierLocation(e.target.value)}
                                            _focus={{ borderColor: '#ee7213', boxShadow: '0 0 0 1px #ee7213' }}
                                        />
                                    </FormControl>

                                    <FormControl id="pic" >
                                        <FormLabel>Upload Picture</FormLabel>
                                        <Input
                                            type="file"
                                            accept='image/*'
                                            onChange={(e) => postSupplierImage(e.target.files[0])}
                                            _focus={{ borderColor: '#ee7213', boxShadow: '0 0 0 1px #ee7213' }}
                                        />
                                    </FormControl>

                                    <Button
                                        mt="4"
                                        bg="#ee7213"
                                        color="white"
                                        type="submit"
                                        isLoading={loading}
                                        _hover={{ bg: '#ff8c42' }}
                                    >
                                        Add Supplier
                                    </Button>
                                </form>
                            </Box>
                            {/* Form End */}
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={onClose}>Close</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </>
            {/* Add supplier Modal Ends  */}
        </div>
    )
}
