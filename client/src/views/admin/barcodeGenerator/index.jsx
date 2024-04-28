import React, { useEffect, useState } from 'react'
import { FiPlusCircle } from "react-icons/fi";
import { ToastContainer, toast } from 'react-toastify';
import { nanoid } from 'nanoid';
import bwipjs from 'bwip-js';

// import * as bwipjs from 'bwip-js';

import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2'
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    Box,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Text,
    useDisclosure,
    IconButton,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    Select,
    Option,
    Flex
} from "@chakra-ui/react"
import { IoMdEye, IoMdTrash } from 'react-icons/io';
import { IoPencil } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { getALlItemsActionQR, postQRItemAction } from '../../../redux/action/QRItems.js';
import { BiBarcodeReader } from 'react-icons/bi';




const BarcodeGenerator = () => {

    const OverlayOne = () => (
        <ModalOverlay
            bg='blackAlpha.800'
            backdropFilter='blur(10px) hue-rotate(90deg)'
        />
    )

    const dispatch = useDispatch();

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [overlay, setOverlay] = useState(<OverlayOne />)

    const [itemDataArray, setItemDataArray] = useState([])
    const [EyeIconSelectedId, setEyeIconSelectedId] = useState(null);
    const [PencilIconSelectedId, setPencilIconSelectedId] = useState(null);
    const [itemName, setItemName] = useState('');
    const [unit, setUnit] = useState('');

    const [item_count, setItem_count] = useState(0);
    const [available, setAvailable] = useState(0);
    const [minimum, setMinimum] = useState(0);
    const [usageRateValue, setUsageRateValue] = useState(0);

    const [usageRateUnit, setUsageRateUnit] = useState('');
    const [lastReplenished, setLastReplenished] = useState('');

    // Remove this code
    const [input, setInput] = useState('')
    const handleInputChange = (e) => setInput(e.target.value)
    const isError = input === ''
    // End of this code


    const handleSubmit = (e) => {
        e.preventDefault();
        const newItemDataQR = {
            qr_code: nanoid(13),
            item_name: itemName,
            item_unit: unit,
            item_count: item_count,
            available_quantity: available,
            minimum_quantity: minimum,
            usage_rate_value: usageRateValue,
            usage_rate_unit: usageRateUnit,
            Last_Replenished: lastReplenished
        }

        const AddItemPromiseQR = dispatch(postQRItemAction(newItemDataQR)).then((res) => {
            if (res.success) {
                onClose();
                return res.message;
            } else {
                throw new Error('Error Adding Item')
            }
        })
        toast.promise(
            AddItemPromiseQR,
            {
                pending: 'Processing Addition of Item...',
                success: 'Item Added Successfully',
                error: 'Error in Adding Item'
            }
        );
    };


    const handleConfirmDelete = (deleteId) => {
        // const deleteItemPromise = dispatch(deleteSingleItemAction(deleteId)).then((res) => {
        //   if (res.success) {
        //     dispatch(GetAllItemsAction());
        //     return res.message;
        //   } else {
        //     throw new Error('Error Deleting Item')
        //   }
        // })
        // toast.promise(
        //   deleteItemPromise,
        //   {
        //     pending: 'Deleting Item...',
        //     success: 'Item Deleted Successfully',
        //     error: 'Error in Deleting Item'
        //   }
        // );
    }


    const handleDeleteItem = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                handleConfirmDelete(id);
            }
        });
    }


    useEffect(() => {
        dispatch(getALlItemsActionQR());
    }, [])


    const ItemDataReducerQR = useSelector((state) => state.QRItemsReducer);
    const QRItemsReducerData = ItemDataReducerQR?.items
    console.log("This is ItemDataReducer : \n", ItemDataReducerQR);
    console.log("This is ItemData : \n", QRItemsReducerData);

    const handleAutoAddVals = () => {
        setItemName('Rice');
        setUnit('KG');
        setItem_count(1);
        setAvailable(100);
        setMinimum(10);
        setUsageRateValue(5);
        setUsageRateUnit('KG');
        setLastReplenished('2021-07-01');
    }

    const handleGenerateBarcode = (item) => {
        try {
            let canvas = bwipjs.toCanvas('mycanvas', {
                bcid: 'code128',       // Barcode type
                text: item.qr_code,    // Text to encode
                scale: 3,               // 3x scaling factor
                height: 10,              // Bar height, in millimeters
                includetext: true,            // Show human-readable text
                textxalign: 'center',        // Always good to set this
            });
        } catch (e) {
            console.log('Error in generating barcode')
        }

    }

    useEffect(() => {
        setItemDataArray(QRItemsReducerData)
    }, [QRItemsReducerData])

    return (
        <div style={{ marginTop: '5vw' }} >
            <div >
                <ToastContainer />
                <Button
                    leftIcon={<FiPlusCircle />}
                    colorScheme='pink'
                    onClick={() => {
                        setOverlay(<OverlayOne />)
                        onOpen()
                    }}
                >
                    Add Item
                </Button>
            </div>

            {/* Table Start */}
            <Box style={{ marginTop: '2vw' }} overflowX="auto">

                <Table variant="striped" colorScheme="pink" >

                    <Thead>
                        <Tr>
                            <Th>Item Name</Th>
                            <Th>Unit</Th>
                            <Th> Item Quantity </Th>
                            <Th isNumeric>Available</Th>
                            <Th isNumeric>Minimum</Th>
                            <Th isNumeric>Usage Rate</Th>
                            <Th isNumeric>Last Replenished</Th>
                            <Th>Action</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {itemDataArray?.map((item, index) => {
                            return (
                                <Tr key={index}>
                                    <Td>{item.item_name}</Td>
                                    <Td>{item.item_unit}</Td>
                                    <Td isNumeric>{item.item_count}</Td>
                                    <Td isNumeric>{item.available_quantity}</Td>
                                    <Td isNumeric>{item.minimum_quantity}</Td>
                                    <Td isNumeric>{item.usage_rate_value}{item.usage_rate_unit}</Td>
                                    <Td isNumeric>{item.Last_Replenished.split('T')[0]}</Td>
                                    <Td
                                        onClick={() => handleGenerateBarcode(item)}
                                    >
                                        <BiBarcodeReader />
                                    </Td>
                                </Tr>
                            );
                        })}
                    </Tbody>
                    <Tfoot>
                        <Tr>
                            <Th>Item Name</Th>
                            <Th>Unit</Th>
                            <Th> Item Quantity </Th>
                            <Th isNumeric>Available</Th>
                            <Th isNumeric>Minimum</Th>
                            <Th isNumeric>Usage Rate</Th>
                            <Th isNumeric>Last Replenished</Th>
                            <Th>Action</Th>
                        </Tr>
                    </Tfoot>
                </Table>
                <Box marginTop={'50px'}>
                    <canvas id="mycanvas"></canvas>
                </Box>

            </Box>
            {/* Table End */}

            {/* Add Modal Start */}
            <>
                <Modal isCentered isOpen={isOpen} onClose={onClose}>
                    {overlay}
                    <ModalContent>
                        <ModalHeader>Add Item</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Text>Custom backdrop filters!</Text>
                            <Button onClick={handleAutoAddVals}>
                                Auto Add Values
                            </Button>
                            {/* Form Start */}
                            <Box maxW="sm" m="auto" p="4" borderWidth="1px" borderRadius="lg" background={'whiteAlpha.100'}>
                                <form onSubmit={handleSubmit}>
                                    <FormControl id="itemName" isRequired>
                                        <FormLabel>Item Name</FormLabel>
                                        <Input
                                            type="text"
                                            value={itemName}
                                            onChange={(e) => setItemName(e.target.value)}
                                        />
                                    </FormControl>

                                    <FormControl id="unit" isRequired>
                                        <FormLabel>Unit</FormLabel>
                                        {/* <Input type="text" value={unit} onChange={(e) => setUnit(e.target.value)} /> */}
                                        <Select
                                            placeholder="Select Unit"
                                            value={unit}
                                            onChange={(e) => setUnit(e.target.value)}
                                        >
                                            <option value="Grams">Grams</option>
                                            <option value="KG">KG</option>
                                            <option value="Litre">Litre</option>
                                            <option value="Piece">Piece</option>
                                            <option value="Gallon">Gallon</option>
                                            <option value="Dozen">Dozen</option>
                                        </Select>
                                    </FormControl>

                                    <FormControl id="itemCount" isRequired>
                                        <FormLabel>Item Count</FormLabel>
                                        <Input
                                            type='number'
                                            step={'any'}
                                            value={item_count}
                                            onChange={(e) => setItem_count(Number(e.target.value))}
                                        />
                                    </FormControl>

                                    <FormControl id="available" isRequired>
                                        <FormLabel>Available</FormLabel>
                                        <Input
                                            type="number"
                                            step={'any'}
                                            value={available}
                                            onChange={(e) => setAvailable(Number(e.target.value))}
                                        />
                                    </FormControl>

                                    <FormControl id="minimum" isRequired>
                                        <FormLabel>Minimum</FormLabel>
                                        <Input
                                            type="number"
                                            step={'any'}
                                            value={minimum}
                                            onChange={(e) => setMinimum(Number(e.target.value))}
                                        />
                                    </FormControl>

                                    <FormControl id="usageRate" isRequired>
                                        <FormLabel>Usage Rate</FormLabel>
                                        <Flex>
                                            <Input
                                                flex="1"
                                                mr="2"
                                                type="number"
                                                step={'any'}
                                                value={usageRateValue}
                                                onChange={(e) => setUsageRateValue(Number(e.target.value))}
                                                placeholder="Value"
                                            />
                                            <Select
                                                flex="1"
                                                ml="2"
                                                placeholder="Select Unit"
                                                value={usageRateUnit}
                                                onChange={(e) => setUsageRateUnit(e.target.value)}
                                            >
                                                <option value="Grams">Grams</option>
                                                <option value="KG">KG</option>
                                                <option value="Litre">Litre</option>
                                                <option value="Piece">Piece</option>
                                                <option value="Gallon">Gallon</option>
                                                <option value="Dozen">Dozen</option>
                                            </Select>
                                        </Flex>
                                    </FormControl>

                                    <FormControl id="lastReplenished" isRequired>
                                        <FormLabel>Last Replenished</FormLabel>
                                        <Input
                                            type="date"
                                            value={lastReplenished}
                                            onChange={(e) => setLastReplenished(e.target.value)}
                                        />
                                    </FormControl>

                                    <Button mt="4" colorScheme="blue" type="submit">
                                        Add Item
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
            {/* Add Modal End */}

            {/* Edit Modal Start */}

            {/* Edit Item Modal End  */}
        </div>
    )
}


export default BarcodeGenerator
