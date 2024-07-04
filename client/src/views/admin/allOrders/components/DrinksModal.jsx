import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    Textarea,
} from '@chakra-ui/react';
import { useDispatch } from 'react-redux';

import { AddOrderItemAction } from '../../../../redux/action/OrderItems';



const DrinksModal = (props) => {

    const onOpen = props.onOpen;
    const isOpen = props.isOpen;
    const onClose = props.onClose;

    const dispatch = useDispatch();

    const [ItemName, setItemName] = useState('');
    const [priceVal, setPriceVal] = useState('');
    const [priceUnit, setPriceUnit] = useState('');
    const [description, setDescription] = useState('');
    const [isFavourite, setIsFavourite] = useState('');
    const [pic, setPic] = useState('https://res.cloudinary.com/dezifvepx/image/upload/v1719740144/restro-website/drinks_aqtzou.jpg');
    const [loading, setLoading] = useState(false);

    const localUserId = JSON.parse(localStorage.getItem('ProfileData'));
    const userId = localUserId?.result?._id;

    const autoFillform = () => {
        setItemName('Coke');
        setPriceVal(2);
        setPriceUnit('Euro');
        setDescription('This is coke');
        setIsFavourite(true);
    }


    const postOrderImage = async (pics) => {
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
            setLoading(false);
        }).catch(err => {
            console.log(err);
            setLoading(false);
            return toast.error('Error Uploading Image to server')
        })
    }

    const handleSubmitDrinks = (e) => {
        e.preventDefault();
        const drinksData = {
            orderName: ItemName,
            priceVal: priceVal,
            priceUnit: priceUnit,
            description: description,
            isFavorite: isFavourite,
            pic: pic,
            isDrink: true,
            created_by: userId
        }

        const AddItemPromise = dispatch(AddOrderItemAction(drinksData)).then((res) => {
            if (res.success) {
                onClose();
                return res.message;
            } else {
                throw new Error(res.message); // Make sure to throw an error here
            }
        });
        toast.promise(
            AddItemPromise,
            {
                pending: 'Processing Addition of Drink...',
                success: 'Drink Added Successfully',
                error: (err) => err.message
            }
        );

        console.log(drinksData);
        console.log('drinks submission testing');
    }

    return (
        <>
            <Modal isCentered isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    <ModalHeader>Add Drinks</ModalHeader>
                    <Button
                        onClick={autoFillform}
                    >
                        Auto Fill
                    </Button>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box maxW="sm" m="auto" p="4" borderWidth="1px" borderRadius="lg" background={'whiteAlpha.100'}>
                            <form onSubmit={handleSubmitDrinks}>
                                <FormControl id="ItemName" isRequired>
                                    <FormLabel>Item Name</FormLabel>
                                    <Input
                                        type="text"
                                        onChange={(e) => setItemName(e.target.value)}
                                        value={ItemName}
                                    />
                                </FormControl>

                                <FormControl id="priceVal" isRequired>
                                    <FormLabel>Price Value</FormLabel>
                                    <Input
                                        type="number"
                                        onChange={(e) => setPriceVal(e.target.value)}
                                        min={0}
                                        value={priceVal}
                                    />
                                </FormControl>

                                <FormControl id="priceUnit" >
                                    <FormLabel>Price Unit</FormLabel>
                                    <Select
                                        onChange={(e) => setPriceUnit(e.target.value)}
                                        value={priceUnit}
                                    >
                                        <option value=''> Select Price Unit </option>
                                        <option value='Euro'>Euro</option>
                                    </Select>
                                </FormControl>

                                <FormControl id="description" >
                                    <FormLabel>Description</FormLabel>
                                    <Textarea
                                        type="text"
                                        onChange={(e) => setDescription(e.target.value)}
                                        value={description}
                                    />
                                </FormControl>

                                <FormControl id="isFavourite" >
                                    <FormLabel>Favourite</FormLabel>
                                    <Select
                                        onChange={(e) => setIsFavourite(e.target.value)}
                                        value={isFavourite}
                                    >
                                        <option value=''> Select Favourite </option>
                                        <option value={false}>No</option>
                                        <option value={true}>Yes</option>
                                    </Select>

                                </FormControl>

                                <FormControl id="pic" >
                                    <FormLabel>Upload Picture</FormLabel>
                                    <Input
                                        type="file"
                                        accept='image/*'
                                        onChange={(e) => postOrderImage(e.target.files[0])}
                                    />
                                </FormControl>

                                <Button
                                    mt="4"
                                    colorScheme="blue"
                                    type="submit"
                                    isLoading={loading}
                                >
                                    Add Item
                                </Button>
                            </form>
                        </Box>
                    </ModalBody>
                    {/* <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter> */}
                </ModalContent>
            </Modal>
        </>
    )
}

export default DrinksModal
