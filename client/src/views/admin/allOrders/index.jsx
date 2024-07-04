import React, { useEffect, useState } from 'react';
import { MdCancel } from "react-icons/md";
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { FaCartShopping } from 'react-icons/fa6';
// import { FaGlassCheers, FaHeart, FaRegHeart } from 'react-icons/fa';
// import { IoMdCart } from "react-icons/io";
// import { MdAddShoppingCart } from "react-icons/md";
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
    InputLeftElement,
    InputGroup,
    List,
    InputRightElement,
    Badge,
} from '@chakra-ui/react'
import { BiSolidTrash } from "react-icons/bi";
import { IoMdSearch } from 'react-icons/io';
import { FiPlusCircle } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';

import { AddOrderItemAction, getAllOrderItemsAction, searchOrderItemAction, searchDrinksOnlyAction, getDrinksOnlyAction } from '../../../redux/action/OrderItems';
import CartDrawer from './components/CartDrawer';
import DrinksModal from './components/DrinksModal';


export default function AllOrders() {

    const OverlayOne = () => (
        <ModalOverlay
        />
    )

    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isOpenCart, onOpen: onOpenCart, onClose: onCloseCart } = useDisclosure()
    const { isOpen: isOpenDrinks, onOpen: onOpenDrinks, onClose: onCloseDrinks } = useDisclosure()
    const [overlay, setOverlay] = React.useState(<OverlayOne />)

    const dispatch = useDispatch();
    const history = useHistory();

    const [selectedItemLength, setSelectedItemLength] = useState(0);
    // const [Tax, setTax] = useState(0);
    // const [discountPerc, setDiscountPerc] = useState(0);
    const [selectedItemTemp, setSelectedItemTemp] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [ItemName, setItemName] = useState('');
    const [priceVal, setPriceVal] = useState(0);
    const [priceUnit, setPriceUnit] = useState('');
    const [pic, setPic] = useState(undefined);
    const [description, setDescription] = useState('');
    const [allOrderTotal, setAllOrderTotal] = useState(0);
    const [isFavourite, setIsFavourite] = useState(false);
    const [originalTotal, setOriginalTotal] = useState(0);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [allItemsData, setAllItemsData] = useState([]);
    const [drinksSearchPerformed, setDrinksSearchPerformed] = useState(false);
    const [searchTermDrinks, setSearchTermDrinks] = useState('');
    const [searchResultsDrinks, setSearchResultsDrinks] = useState([]);
    const [drinksData, setDrinksData] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearchDrinks = () => {
        dispatch(searchDrinksOnlyAction(searchTermDrinks)).then((res) => {
            if (res.success) {
                setSearchResultsDrinks(res?.data);
                console.log("Search Results: ", res?.data)
            } else {
                console.log("error from searchDrinksOnlyAction: " + res.message)
            }
        })
    }

    const handleProcessOrder = () => {
        history.push('/admin/process-order', { selectedItemTemp, allOrderTotal });
    }

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
            description: description,
            isFavorite: isFavourite,
            isDrink: false
        }

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
    const AllOrderItemsLength = AllOrderItemsReducer?.length;
    const cartDataReducer = useSelector((state) => state);
    console.log("Cart Data Reducer", cartDataReducer)

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

    // function generateBill(selectedItems, total) {
    //     const doc = new jsPDF();
    //     doc.setFont('courier'); // Set font to Courier
    //     let y = 20;
    //     doc.setFontSize(18);
    //     doc.text('Taj Hotels Limited', 10, y);
    //     doc.setFontSize(14);
    //     y += 10;
    //     doc.text('Item', 10, y);
    //     doc.text('Quantity', 40, y);
    //     doc.text('Price', 70, y);
    //     doc.text('Total', 90, y);
    //     y += 10;
    //     selectedItems.forEach((item, index) => {
    //         const lines = doc.splitTextToSize(item.orderName, 40); // Split the item name into lines of up to 40 units long
    //         for (let i = 0; i < lines.length; i++) {
    //             doc.text(lines[i], 10, y);
    //             if (i === 0) { // Only add quantity and price on the first line
    //                 doc.text(item.quantity.toString(), 50, y);
    //                 doc.text(`${item.priceVal} ${item.priceUnit === 'Euro' ? '€' : item.priceUnit}`, 70, y);
    //                 doc.text(`${(item.quantity * item.priceVal).toFixed(2)} ${item.priceUnit === 'Euro' ? '€' : item.priceUnit}`, 90, y);
    //             }
    //             y += 10;
    //         }
    //         y += 10;
    //     });
    //     doc.text('------------------------', 10, y);
    //     y += 10;
    //     doc.text(`Total: ${parseFloat(total).toFixed(2)} €`, 10, y);
    //     y += 10;
    //     doc.text('------------------------', 10, y);
    //     y += 10;
    //     doc.text(`Date: ${new Date().toLocaleString()}`, 10, y);
    //     doc.save("Bill.pdf");
    // }

    // Usage

    // const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = () => {
        dispatch(searchOrderItemAction(searchTerm)).then((res) => {
            if (res.success) {
                setSearchResults(res?.data);
                console.log("Search Results: ", res?.data)
            } else {
                console.log("error from searchOrderItemAction: " + res.message)
            }
        })
    };

    useEffect(() => {
        setSelectedItemTemp(AllOrderItemsReducer.items);
    }, [handleAddItemOrder])

    useEffect(() => {
        dispatch(getAllOrderItemsAction()).then((res) => {
            if (res.success) {
                setAllItemsData(res?.data);
            } else {
                console.log("Erorr Getting Data")
            }
        })
    }, [])

    useEffect(() => {
        dispatch(getDrinksOnlyAction()).then((res) => {
            if (res.success) {
                setDrinksData(res?.data);
            } else {
                console.log("Error Getting Drinks Data")
            }
        })
    }, [])

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

            <Box position="relative" display="inline-block">
                <Button
                    leftIcon={<FaCartShopping />}
                    marginLeft="12px"
                    colorScheme="cyan"
                    variant="solid"
                    onClick={onOpenCart}
                >
                    Cart
                </Button>
                {/* {cartItemsLength.length > 0 && ( */}
                <Badge
                    colorScheme="cyan"
                    variant='solid'
                    position="absolute"
                    top="-1"
                    right="-1"
                    borderRadius="full"
                >
                    {AllOrderItemsLength}
                </Badge>
                {/* )} */}
            </Box>
            <Box
                display={'flex'}
                justifyContent={'center'}
                marginLeft='12rem'
            >
                <Button
                    leftIcon={<FiPlusCircle />}
                    ml={'10px'}
                    colorScheme='cyan'
                    variant='solid'
                    onClick={
                        () => {
                            onOpenDrinks();
                        }
                    }
                >
                    Add Drinks
                </Button>
            </Box>
            {/* Modal Starts Here */}
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
                        <ModalFooter>
                            <Button onClick={onClose}>Close</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </>
            {/* Modal Ends here */}

            {/* Drinks Modal Starts */}
            <DrinksModal
                isOpen={isOpenDrinks}
                onOpen={onOpenDrinks}
                onClose={onCloseDrinks}
            />

            {/* Drinks modal Ends */}


            <Box display={{ base: "block", md: "flex" }}>

                {/* Box1 */}
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
                        <InputRightElement>
                            <MdCancel
                                size={'20'}
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                    setSearchPerformed(false);
                                    setSearchTerm('');
                                }}
                            />
                        </InputRightElement>

                        <Input
                            paddingLeft={'2.5rem'}
                            borderRadius={'50px'}
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setSearchPerformed(true);
                                if (e.target.value.trim() !== '') {
                                    handleSearch();
                                } else {
                                    setSearchResults([]);
                                }
                            }}
                        />
                    </InputGroup>
                    {searchPerformed ?
                        <>
                            <List mt={2}>
                                {searchResults?.map((result, index) => (
                                    <Box
                                        key={index}
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
                                                        style={{ cursor: 'pointer', userSelect: 'none', padding: '10px' }}
                                                        onClick={() => {
                                                            handleAddItemOrder(result);
                                                        }}
                                                    >Add To Cart</Text>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                ))}
                            </List>
                        </> :
                        <>
                            <Box marginTop={'1rem'} display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={6}>
                                {allItemsData?.map((result, index) => (
                                    <Box key={result._id} display="flex" flexDirection="column" alignItems="center">
                                        <Box>
                                            <Image borderRadius="full" boxSize="50px" src={result?.pic} alt="Food-Image" />
                                        </Box>
                                        <Box marginLeft="1rem">
                                            <Text mt="1" fontWeight="semibold" as="h6" lineHeight="tight" isTruncated>
                                                {result?.orderName}
                                                {/* {result?.isFavorite ? 'Yes' : 'No'} */}
                                            </Text>
                                            <Text
                                                style={{ cursor: 'pointer', userSelect: 'none' }}
                                                onClick={() => {
                                                    handleAddItemOrder(result);
                                                }}
                                            >  Add To Cart </Text>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </>
                    }
                </Box>


                {/* <Button
                    onClick={() => generateBill(selectedItemTemp, allOrderTotal)}
                >
                    Generate Bill
                </Button> */}

                {/* Box 2 */}
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
                        <InputRightElement>
                            <MdCancel
                                size={'20'}
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                    setDrinksSearchPerformed(false);
                                    setSearchTermDrinks('');
                                }}
                            />
                        </InputRightElement>

                        <Input
                            paddingLeft={'2.5rem'}
                            borderRadius={'50px'}
                            placeholder="Search..."
                            value={searchTermDrinks}
                            onChange={(e) => {
                                setSearchTermDrinks(e.target.value);
                                setDrinksSearchPerformed(true);
                                if (e.target.value.trim() !== '') {
                                    handleSearchDrinks();
                                } else {
                                    setSearchResultsDrinks([]);
                                }
                            }}
                        />
                    </InputGroup>
                    {drinksSearchPerformed ?
                        <>
                            <List mt={2}>
                                {searchResultsDrinks?.map((result, index) => (
                                    <Box
                                        key={index}
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
                                                        style={{ cursor: 'pointer', userSelect: 'none', padding: '10px' }}
                                                        onClick={() => {
                                                            handleAddItemOrder(result);
                                                        }}
                                                    >Add To Cart</Text>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                ))}
                            </List>
                        </> :
                        <>
                            <Box marginTop={'1rem'} display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={6}>
                                {drinksData?.map((result, index) => (
                                    <Box key={result._id} display="flex" flexDirection="column" alignItems="center">
                                        <Box>
                                            <Image borderRadius="full" boxSize="50px" src={result?.pic} alt="Food-Image" />
                                        </Box>
                                        <Box marginLeft="1rem">
                                            <Text mt="1" fontWeight="semibold" as="h6" lineHeight="tight" isTruncated>
                                                {result?.orderName}
                                                {/* {result?.isFavorite ? 'Yes' : 'No'} */}
                                            </Text>
                                            <Text
                                                style={{ cursor: 'pointer', userSelect: 'none' }}
                                                onClick={() => {
                                                    handleAddItemOrder(result);
                                                }}
                                            >  Add To Cart </Text>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </>
                    }
                </Box>
            </Box>


            {/* Cart Drawer Start */}
            <CartDrawer
                isOpen={isOpenCart}
                onOpen={onOpenCart}
                onClose={onCloseCart}
            />
            {/* Cart Drawer End */}
        </div>

    )
}