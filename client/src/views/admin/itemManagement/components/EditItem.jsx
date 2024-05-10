import React, { useEffect, useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    Text,
    Box,
    FormControl,
    FormLabel,
    Input,
    Select,
    Flex
} from '@chakra-ui/react';

import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ScaleLoader } from 'react-spinners';

import { GetSingleItemAction, updateSingleItemAction } from '../../../../redux/action/Items';

// import { GetSingleItemAction } from '../../../../redux/action/Items.js';

const EdiItem = (props) => {
    const dispatch = useDispatch();
    const ItemId = props.PencilIconSelectedId

    const [EditItemName, setEditItemName] = useState('')
    const [EditUnit, setEditUnit] = useState('')

    const [EditAvailable, setEditAvailable] = useState(0)
    const [EditMinimum, setEditMinimum] = useState(0)
    const [EditUsageRateValue, setEditUsageRateValue] = useState(0)

    const [EditUsageRateUnit, setEditUsageRateUnit] = useState('')
    const [EditLastReplenished, setEditLastReplenished] = useState('')
    const [loadingEditModal, setLoadingEditModal] = useState(true)

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedItemsData = {
            item_name: EditItemName,
            item_unit: EditUnit,
            available_quantity: EditAvailable,
            minimum_quantity: EditMinimum,
            usage_rate_value: EditUsageRateValue,
            usage_rate_unit: EditUsageRateUnit,
            Last_Replenished: EditLastReplenished
        }
        const EditItemPromise = dispatch(updateSingleItemAction(ItemId, updatedItemsData)).then((res) => {
            if (res.success) {
                props.onClose();
                return res.message;
            } else {
                throw new Error('Error Adding Item')
            }
        })
        toast.promise(
            EditItemPromise,
            {
                pending: 'Processing Update of Item...',
                success: 'Item Updated Successfully',
                error: 'Error in Updating Item'
            }
        );
    }

    // const { isOpen, onOpen, onClose } = useDisclosure()
    // const [overlay, setOverlay] = useState(<OverlayOne />)


    useEffect(() => {
        dispatch(GetSingleItemAction(ItemId))
            .finally(() => {
                setLoadingEditModal(false);
            });

    }, [ItemId])

    const SelectedItemData = useSelector((state) => state.itemsReducer.selectedItem);
    console.log(30, "SelectedItemData: \n", SelectedItemData)

    useEffect(() => {
        if (SelectedItemData) {
            setEditItemName(SelectedItemData?.item_name)
            setEditUnit(SelectedItemData?.item_unit)
            setEditAvailable(SelectedItemData?.available_quantity)
            setEditMinimum(SelectedItemData?.minimum_quantity)
            setEditUsageRateValue(SelectedItemData?.usage_rate_value)
            setEditUsageRateUnit(SelectedItemData?.usage_rate_unit)
            setEditLastReplenished(SelectedItemData?.Last_Replenished.split('T')[0])
        }
    }, [SelectedItemData])

    return (
        <>
            <div>
                <Modal isCentered isOpen={props.isOpen} onClose={props.onClose}>
                    {loadingEditModal ?
                        <ModalContent height="300px">
                            <Box display="flex" height="100%" alignItems="center" justifyContent="center">
                                <ScaleLoader
                                    color="#36d7b7"
                                    size={70}
                                />
                            </Box>
                        </ModalContent>
                        : <>
                            {props.overlay}
                            <ModalContent
                                background={'#9BF0F2'}
                                border={'5px solid #fff'}
                            >
                                <ModalHeader>Edit Item</ModalHeader>
                                <ModalCloseButton />
                                <ModalBody
                                >
                                    <Box maxW="sm" m="auto" p="4" borderWidth="1px" borderRadius="lg" background={'whiteAlpha.100'}>
                                        <form onSubmit={handleSubmit}>
                                            <FormControl id="itemName" isRequired>
                                                <FormLabel>Item Name</FormLabel>
                                                <Input
                                                    type="text"
                                                    value={EditItemName}
                                                    onChange={(e) => setEditItemName(e.target.value)}
                                                />
                                            </FormControl>

                                            <FormControl id="unit" isRequired>
                                                <FormLabel>Unit</FormLabel>
                                                {/* <Input type="text" value={unit} onChange={(e) => setUnit(e.target.value)} /> */}
                                                <Select
                                                    placeholder="Select Unit"
                                                    value={EditUnit}
                                                    onChange={(e) => setEditUnit(e.target.value)}
                                                >
                                                    <option value="Grams">Grams</option>
                                                    <option value="KG">KG</option>
                                                    <option value="Litre">Litre</option>
                                                    <option value="Piece">Piece</option>
                                                    <option value="Gallon">Gallon</option>
                                                    <option value="Dozen">Dozen</option>
                                                </Select>
                                            </FormControl>

                                            <FormControl id="available" isRequired>
                                                <FormLabel>Available</FormLabel>
                                                <Input
                                                    type="number"
                                                    step={'any'}
                                                    value={EditAvailable}
                                                    onChange={(e) => setEditAvailable(Number(e.target.value))}
                                                />
                                            </FormControl>

                                            <FormControl id="minimum" isRequired>
                                                <FormLabel>Minimum</FormLabel>
                                                <Input
                                                    type="number"
                                                    step={'any'}
                                                    value={EditMinimum}
                                                    onChange={(e) => setEditMinimum(Number(e.target.value))}
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
                                                        value={EditUsageRateValue}
                                                        onChange={(e) => setEditUsageRateValue(Number(e.target.value))}
                                                        placeholder="Value"
                                                    />
                                                    <Select
                                                        flex="1"
                                                        ml="2"
                                                        placeholder="Select Unit"
                                                        value={EditUsageRateUnit}
                                                        onChange={(e) => setEditUsageRateUnit(e.target.value)}
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
                                                    value={EditLastReplenished}
                                                    onChange={(e) => setEditLastReplenished(e.target.value)}
                                                />
                                            </FormControl>

                                            <Button mt="4" colorScheme="blue" type="submit">
                                                Update Item
                                            </Button>
                                        </form>
                                    </Box>
                                </ModalBody>
                                <ModalFooter>
                                    <Button onClick={props.onClose}>Close</Button>
                                </ModalFooter>
                            </ModalContent>
                        </>
                    }
                </Modal>
            </div>

        </>
    )
}

export default EdiItem