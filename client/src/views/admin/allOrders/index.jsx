import React, { useEffect, useState } from 'react';
import { jsPDF } from "jspdf";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Image,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Text,
    Box,
    FormControl,
    FormLabel,
    Input,
    Button,
    Textarea,
    Select,
    IconButton,
    InputLeftElement,
    InputGroup,
    List,
    ListItem,
} from '@chakra-ui/react'
import { BiSolidTrash } from "react-icons/bi";
import { SearchIcon } from '@chakra-ui/icons'
import { IoMdSearch, IoMdTrash } from 'react-icons/io';
import { FiPlusCircle } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';

import { AddOrderItemAction, searchOrderItemAction } from '../../../redux/action/OrderItems';
import { CiTrash } from "react-icons/ci";

export default function AllOrders() {

    const OverlayOne = () => (
        <ModalOverlay
            bg='blackAlpha.800'
            backdropFilter='blur(10px) hue-rotate(90deg)'
        />
    )

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [overlay, setOverlay] = React.useState(<OverlayOne />)

    const dispatch = useDispatch();

    const [selectedItemLength, setSelectedItemLength] = useState(0);
    // const [Tax, setTax] = useState(0);
    // const [discountPerc, setDiscountPerc] = useState(0);
    const [selectedItemTemp, setSelectedItemTemp] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [ItemName, setItemName] = useState('');
    const [priceVal, setPriceVal] = useState(0);
    const [priceUnit, setPriceUnit] = useState('');
    const [pic, setPic] = useState('');
    const [description, setDescription] = useState('');
    const [allOrderTotal, setAllOrderTotal] = useState(0);
    const [originalTotal,setOriginalTotal] = useState(0);
    const [loading, setLoading] = useState(false);



    const postOrderImage = (pics) => {
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

    const autoFillform = () => {
        const itemNames = ['Mix Veg', 'Normal Dal', 'Paneer Tikka', 'Dal Makhani'];
        const priceVals = [10, 15, 20, 25];
        const priceUnits = ['Euro'];
        const descriptions = ['This is Mix Veg', 'This is Normal Dal', 'This is Paneer Tikka', 'This is Dal Makhani'];

        const randomItemName = itemNames[Math.floor(Math.random() * itemNames.length)];
        const randomPriceVal = priceVals[Math.floor(Math.random() * priceVals.length)];
        const randomPriceUnit = priceUnits[Math.floor(Math.random() * priceUnits.length)];
        const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];

        setItemName(randomItemName);
        setPriceVal(randomPriceVal);
        setPriceUnit(randomPriceUnit);
        setDescription(randomDescription);
    }

    const handleSubmitItemOrder = (e) => {
        e.preventDefault();
        const newItemOrderData = {
            orderName: ItemName,
            priceVal: priceVal,
            priceUnit: priceUnit,
            pic: pic,
            description: description
        }

        // const neWItemAddPromise = dispatch(AddOrderItemAction(newItemData)).then((res) => {

        // })

        const AddItemPromise = dispatch(AddOrderItemAction(newItemOrderData)).then((res) => {
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
                pending: 'Processing Addition of Item...',
                success: 'Item Added Successfully',
                error: (err) => err.message
            }
        );
    }


    const AllOrderItemsReducer = useSelector((state) => state.OrderItemReducer);
    console.log("All Order Items Reducer Data \n")
    console.log(AllOrderItemsReducer);

    const handleRemoveItemOrder = (id) => {
        console.log("Remove Item Clicked", id);
        if (id !== undefined) {
            setAllOrderTotal(allOrderTotal - selectedItemTemp.find(item => item._id === id).priceVal);
            dispatch({ type: 'REMOVE_ORDER_ITEM_TEMP', data: id })
        }
    }

    const handleRemoveItemOrderCompletely = (id) => {
        console.log("Remove Item Completely Clicked", id);
        if (id !== undefined) {
            setAllOrderTotal(allOrderTotal - (selectedItemTemp.find(item => item._id === id).priceVal * selectedItemTemp.find(item => item._id === id).quantity));
            dispatch({ type: 'REMOVE_ORDER_ITEM_TEMP_COMPLETELY', data: id })
        }
    }

    const handleAddItemOrder = (product) => {
        console.log("Add Item Clicked", product)
        if (product !== undefined) {
            setAllOrderTotal(allOrderTotal + product.priceVal);
            dispatch({ type: 'ADD_ORDER_ITEM_TEMP', data: product })
        }
    }



    function generateBill(selectedItems, total) {
        const doc = new jsPDF();
        doc.setFont('courier'); // Set font to Courier
        let y = 20;
        doc.setFontSize(18);
        doc.text('Taj Hotels Limited', 10, y);
        doc.setFontSize(14);
        y += 10;
        doc.text('Item', 10, y);
        doc.text('Quantity', 40, y);
        doc.text('Price', 70, y);
        doc.text('Total', 90, y);
        y += 10;
        selectedItems.forEach((item, index) => {
            const lines = doc.splitTextToSize(item.orderName, 40); // Split the item name into lines of up to 40 units long
            for (let i = 0; i < lines.length; i++) {
                doc.text(lines[i], 10, y);
                if (i === 0) { // Only add quantity and price on the first line
                    doc.text(item.quantity.toString(), 50, y);
                    doc.text(`${item.priceVal} ${item.priceUnit === 'Euro' ? '€' : item.priceUnit}`, 70, y);
                    doc.text(`${(item.quantity * item.priceVal).toFixed(2)} ${item.priceUnit === 'Euro' ? '€' : item.priceUnit}`, 90, y);
                }
                y += 10;
            }
            y += 10;
        });
        doc.text('------------------------', 10, y);
        y += 10;
        doc.text(`Total: ${parseFloat(total).toFixed(2)} €`, 10, y);
        y += 10;
        doc.text('------------------------', 10, y);
        y += 10;
        doc.text(`Date: ${new Date().toLocaleString()}`, 10, y);
        doc.save("Bill.pdf");
    }

    // Usage

    // const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = () => {
        dispatch(searchOrderItemAction(searchTerm)).then((res) => {
            if (res.success) {
                setSearchResults(res.data);
                console.log("Search Results: ", res.data)
            } else {
                console.log("error from searchOrderItemAction: " + res.message)
            }
        })
    };

    // const items = useSelector(state => state.orderItems.items);

    // const getItemQuantity = (id) => {
    //     const item = items?.find(item => item._id === id);
    //     return item ? item?.quantity : 0;
    // }


    // // For calculating tax 
    // useEffect(() => {
    //     setAllOrderTotal(selectedItemTemp.reduce((acc, item) => acc + item.priceVal * item.quantity, 0) + parseFloat(Tax));
    //     // setAllOrderTotal(parseFloat(Tax) + allOrderTotal)
    // }, [Tax])

    // // For calculating discount
    // useEffect(() => {
    //     setAllOrderTotal(selectedItemTemp.reduce((acc, item) => acc + item.priceVal * item.quantity, 0) - 
    //     parseFloat(discountPerc * selectedItemTemp.reduce((acc, item) => acc + item.priceVal * item.quantity, 0) / 100));
    // }, [discountPerc]);

    useEffect(() => {
        setSelectedItemTemp(AllOrderItemsReducer.items);
        // setSelectedItemLength(AllOrderItemsReducer.itemsLength);
    }, [handleAddItemOrder])



    return (
        <div style={{ marginTop: '4vw' }}>
            {/* Item name , Item Image , Item price  */}
            <ToastContainer />
            {/* <h2>Hello From AllOrders</h2> */}
            <Button
                leftIcon={<FiPlusCircle />}
                colorScheme='pink'
                variant='solid'
                onClick={
                    () => {
                        setOverlay()
                        onOpen()
                    }
                }
            >
                Add Items
            </Button>


            {/* <Button
                onClick={() => {
                    setOverlay()
                    onOpen()
                }}
            >
                Use Overlay one
            </Button> */}

            {/* Model Start */}
            <>
                <Modal isCentered isOpen={isOpen} onClose={onClose}>
                    {overlay}
                    <ModalContent>
                        <ModalHeader>Add Items</ModalHeader>
                        <Button
                            onClick={autoFillform}
                        >
                            Auto Fill
                        </Button>
                        <ModalCloseButton />
                        <ModalBody>
                            <Box maxW="sm" m="auto" p="4" borderWidth="1px" borderRadius="lg" background={'whiteAlpha.100'}>
                                <form onSubmit={handleSubmitItemOrder}>
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
                        <ModalFooter>
                            <Button onClick={onClose}>Close</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </>
            {/* Modal Ends here */}


            <Box display={{ base: "block", md: "flex" }}>
                {/* Box1 */}
                <Box flexBasis={{ base: "100%", md: "50%" }} p={5} borderWidth={1} margin={3}>
                    {selectedItemTemp.map((item, index) => (
                        <Box key={index}
                            borderWidth="1px"
                            borderRadius="lg"
                            overflow="hidden"
                            mb={3}
                        >
                            <Box p="6">
                                <Box display="flex" alignItems="center">
                                    <Box>
                                        <Image
                                            borderRadius='full'
                                            boxSize='50px'
                                            src={item?.pic}
                                            // src='https://bit.ly/dan-abramov'
                                            alt='Food-Image'
                                        />
                                    </Box>
                                    <Box marginLeft={'1rem'}>
                                        <Text mt="1" display={'flex'} fontWeight="semibold" as="h4" lineHeight="tight" isTruncated>
                                            {item?.orderName}
                                            <BiSolidTrash
                                                size={'20'}
                                                style={{ marginLeft: '8px', marginTop: '2px', cursor: 'pointer', color: 'red' }}
                                                // onClick={handleRemoveItemOrder.bind(this, item._id}}
                                                onClick={() => handleRemoveItemOrderCompletely(item._id)}
                                            />
                                        </Text>
                                        <Text mt="1" fontWeight="semibold" as="h4" lineHeight="tight" isTruncated>
                                            {item?.quantity} X  {item?.priceVal}
                                            {item?.priceUnit === 'Euro' ? ' €' : item?.priceUnit}
                                        </Text>
                                    </Box>
                                </Box>
                                <Box display={'flex'} justifyContent={'end'}>
                                    {item?.quantity * item?.priceVal} {item?.priceUnit === 'Euro' ? ' €' : item?.priceUnit}
                                </Box>
                            </Box>

                        </Box>
                    ))}


                    {/* <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <FormLabel style={{ flex: '0 0 50%' }}>Tax</FormLabel>
                        <Input
                            style={{ flex: '0 0 50%' }}
                            type="number"
                            onChange={(e) => setTax(e.target.value)}
                            value={Tax}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <FormLabel style={{ flex: '0 0 50%' }}>Discount Percentage </FormLabel>
                        <Input
                            style={{ flex: '0 0 50%' }}
                            type="number"
                            onChange={(e) => setDiscountPerc(e.target.value)}
                            value={discountPerc}
                        />
                    </div> */}

                    {/* {Tax > 0 && (<Text
                        marginTop={'5px'}
                        display={'flex'}
                        justifyContent={'end'}
                        marginRight={'1rem'}
                    >
                        Tax : {Tax} €
                    </Text>
                    )} */}

                    {allOrderTotal > 0 && (
                        <Text
                            marginTop={'5px'}
                            display={'flex'}
                            justifyContent={'end'}
                            marginRight={'1rem'}
                        >
                            Total : {parseFloat(allOrderTotal).toFixed(2)} €
                        </Text>
                    )}


                </Box>

                <Button
                    onClick={() => generateBill(selectedItemTemp, allOrderTotal)}
                >
                    Generate Bill
                </Button>

                <Box flexBasis={{ base: "100%", md: "50%" }} p={5} borderWidth={1} margin={3}>
                    <InputGroup>
                        {/* Box2 */}
                        <InputLeftElement
                            pointerEvents={'none'}
                        >
                            <IoMdSearch
                                size={'20'}
                                aria-label="Search database"
                            />
                        </InputLeftElement>

                        <Input
                            paddingLeft={'2.5rem'}
                            borderRadius={'50px'}
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                if (e.target.value.trim() !== '') {
                                    handleSearch();
                                } else {
                                    setSearchResults([]);
                                }
                            }}
                        />
                    </InputGroup>
                    <List mt={2}>
                        {searchResults?.map((result, index) => (
                            <Box
                                key={index}
                                borderWidth="1px"
                                borderRadius="lg"
                                overflow="hidden"
                                // onClick={() => ha(result)}
                                mb={3}
                            >
                                <Box p="6">
                                    <Box display="flex" alignItems="center">
                                        <Box>
                                            <Image
                                                borderRadius='full'
                                                boxSize='50px'
                                                src={result?.pic}
                                                alt='Food-Image'
                                            />
                                        </Box>
                                        <Box marginLeft={'1rem'}>
                                            <Text mt="1" fontWeight="semibold" as="h4" lineHeight="tight" isTruncated>
                                                {result?.orderName}
                                            </Text>
                                            <Text mt="1" fontWeight="semibold" as="h4" lineHeight="tight" isTruncated>
                                                {result?.priceVal} {result?.priceUnit}
                                            </Text>
                                        </Box>
                                    </Box>

                                    <Box display={'flex'} justifyContent={'end'}>
                                        <Box
                                            display={'flex'}
                                            background={'#fa4a0c'}
                                            color={'white'}
                                            gap={'1rem'}
                                            borderRadius={'50px'}
                                            paddingRight={'10px'}
                                            paddingLeft={'10px'}
                                        >
                                            <Text
                                                style={{ cursor: 'pointer', userSelect: 'none', fontSize: '20px' }}
                                                onClick={() => {
                                                    handleAddItemOrder(result);
                                                }
                                                }
                                            >+</Text>
                                            {/* <Box>{getItemQuantity(result._id)}</Box> */}
                                            {/* <Box>{selectedItemLength}</Box> */}
                                            <Text
                                                style={{ cursor: 'pointer', userSelect: 'none', fontSize: '20px' }}
                                                onClick={() => {
                                                    handleRemoveItemOrder(result._id);
                                                }}
                                            >-</Text>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                    </List>
                </Box>
            </Box>
        </div>

    )
}