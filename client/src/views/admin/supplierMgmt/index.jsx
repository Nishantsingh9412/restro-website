import React, { useEffect, useState } from 'react'
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


export default function SupplierManagement() {

    const dispatch = useDispatch();
    const [suppliername, setSupplierName] = useState('');
    const [pic, setPic] = useState(undefined);
    const [Items, setItem] = useState([]);
    const [loading, setLoading] = useState(false);


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
            bg='blackAlpha.800'
            backdropFilter='blur(10px) hue-rotate(90deg)'
        />
    )

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [overlay, setOverlay] = useState(<OverlayOne />)

    const handleAddSupplier = (e) => {
        e.preventDefault();
        
        const newSupplier = {
            name:suppliername,
            pic,
            Items
        }
        console.log("This is new Supplier Data \n");
        console.log(newSupplier);
        dispatch(AddNewSupplierAction(newSupplier)).then((res) => {
            if(res.success){
                toast.success('Item Added successfully');
                onClose();
            }else{
                toast.error(res.message);
            }
        })
    }

    useEffect(() => {
        dispatch(GetAllSuppliersAction());
    }, [])



    const allSuppliers = useSelector(state => state.supplierReducer.suppliers);
    const selectedSupplier = useSelector(state => state.supplierReducer.seletectedSupplier);
    console.log(" allstates Data \n")
    console.log(allSuppliers);

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
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                }}>
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
                    <ModalContent>
                        <ModalHeader> Add Supplier </ModalHeader>
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
                                        // value={itemName}
                                        />
                                    </FormControl>

                                    <FormControl id="items" isRequired>
                                        <FormLabel>Items  (separate by comma) </FormLabel>
                                        <Input
                                            type="text"
                                            onChange={(e) => setItem(e.target.value.split(','))}
                                            placeholder={"Tomato,Cauliflower,Brinjal"}
                                        />
                                    </FormControl>

                                    <FormControl id="pic" >
                                        <FormLabel>Upload Picture</FormLabel>
                                        <Input type="file" accept='image/*' onChange={(e) => postSupplierImage(e.target.files[0])} />
                                    </FormControl>

                                    <Button
                                        mt="4"
                                        colorScheme="blue"
                                        type="submit"
                                        isLoading={loading}
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
