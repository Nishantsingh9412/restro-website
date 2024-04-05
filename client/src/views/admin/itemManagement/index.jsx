import React, { useEffect, useState } from 'react'
import { FiPlusCircle } from "react-icons/fi";
import { ToastContainer, toast } from 'react-toastify';
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
  TableCaption,
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

import { AddItemAction, GetAllItemsAction, deleteSingleItemAction } from '../../../redux/action/Items';
import ViewItem from './components/ViewItem'
import EdiItem from './components/EditItem';


export default function ItemManagement() {

  const OverlayOne = () => (
    <ModalOverlay
      bg='blackAlpha.800'
      backdropFilter='blur(10px) hue-rotate(90deg)'
    />
  )

  const dispatch = useDispatch();

  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isOpenTwo, onOpen: onOpenTwo, onClose: onCloseTwo } = useDisclosure()
  const { isOpen: isOpenThree, onOpen: onOpenThree, onClose: onCloseThree } = useDisclosure()
  const [overlay, setOverlay] = useState(<OverlayOne />)
  const [itemDataArray, setItemDataArray] = useState([])

  const [EyeIconSelectedId, setEyeIconSelectedId] = useState(null);
  const [PencilIconSelectedId, setPencilIconSelectedId] = useState(null);
  const [itemName, setItemName] = useState('');
  const [unit, setUnit] = useState('');
  const [available, setAvailable] = useState('');
  const [minimum, setMinimum] = useState('');
  const [usageRateValue, setUsageRateValue] = useState('');
  const [usageRateUnit, setUsageRateUnit] = useState('');
  const [lastReplenished, setLastReplenished] = useState('');

  // Remove this code
  const [input, setInput] = useState('')
  const handleInputChange = (e) => setInput(e.target.value)
  const isError = input === ''
  // End of this code


  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    const newItemData = {
      item_name: itemName,
      item_unit: unit,
      available_quantity: available,
      minimum_quantity: minimum,
      usage_rate_value: usageRateValue,
      usage_rate_unit: usageRateUnit,
      Last_Replenished: lastReplenished
    }

    const AddItemPromise = dispatch(AddItemAction(newItemData)).then((res) => {
      if (res.success) {
        onClose();
        return res.message;
      } else {
        throw new Error('Error Adding Item')
      }
    })
    toast.promise(
      AddItemPromise,
      {
        pending: 'Processing Addition of Item...',
        success: 'Item Added Successfully',
        error: 'Error in Adding Item'
      }
    );
  };


  const handleConfirmDelete = (deleteId) => {
    const deleteItemPromise = dispatch(deleteSingleItemAction(deleteId)).then((res) => {
      if (res.success) {
        dispatch(GetAllItemsAction());
        return res.message;
      } else {
        throw new Error('Error Deleting Item')
      }
    })
    toast.promise(
      deleteItemPromise,
      {
        pending: 'Deleting Item...',
        success: 'Item Deleted Successfully',
        error: 'Error in Deleting Item'
      }
    );
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
    dispatch(GetAllItemsAction());
  }, [])


  const ItemDataReducer = useSelector((state) => state.itemsReducer);
  const ItemData = ItemDataReducer?.items
  console.log("This is ItemDataReducer : \n", ItemDataReducer);
  console.log("This is ItemData : \n", ItemData);

  useEffect(() => {
    setItemDataArray(ItemData)
  }, [ItemData])

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
          <TableCaption>Imperial to metric conversion factors</TableCaption>
          <Thead>
            <Tr>
              <Th>Item Name</Th>
              <Th>Unit</Th>
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
                  <Td isNumeric>{item.available_quantity}</Td>
                  <Td isNumeric>{item.minimum_quantity}</Td>
                  <Td isNumeric>{item.usage_rate_value}{item.usage_rate_unit}</Td>
                  <Td isNumeric>{item.Last_Replenished.split('T')[0]}</Td>
                  <Td>

                    <IconButton
                      aria-label='Delete Item'
                      colorScheme='red'
                      size='sm'
                      icon={<IoMdTrash
                        onClick={() => handleDeleteItem(item._id)}
                      />} />

                    <IconButton
                      ml={2}
                      aria-label='Edit Item'
                      colorScheme='blackAlpha'
                      size='sm'
                      icon={<IoPencil />}
                      onClick={() => {
                        setPencilIconSelectedId(item._id)
                        setOverlay(<OverlayOne />)
                        onOpenThree()
                      }}
                    />

                    <IconButton
                      ml={2}
                      aria-label='Edit Item'
                      colorScheme='blackAlpha'
                      size='sm'
                      icon={<IoMdEye />}
                      onClick={() => {
                        setEyeIconSelectedId(item._id)
                        setOverlay(<OverlayOne />)
                        onOpenTwo()
                      }}
                    />
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
          <Tfoot>
            <Tr>
              <Th>Item Name</Th>
              <Th>Unit</Th>
              <Th isNumeric>Available</Th>
              <Th isNumeric>Minimum</Th>
              <Th isNumeric>Usage Rate</Th>
              <Th isNumeric>Last Replenished</Th>
              <Th>Action</Th>
            </Tr>
          </Tfoot>
        </Table>
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

              {/* Check for FormError */}
              {/* <FormControl isInvalid={isError}>
                <FormLabel>Email</FormLabel>
                <Input type='email' value={input} onChange={handleInputChange} />
                {!isError ? (
                  <FormHelperText>
                    Enter the email you'd like to receive the newsletter on.
                  </FormHelperText>
                ) : (
                  <FormErrorMessage>Email is required.</FormErrorMessage>
                )}
              </FormControl> */}

              {/* Form Start */}
              <Box maxW="sm" m="auto" p="4" borderWidth="1px" borderRadius="lg" background={'whiteAlpha.100'}>
                <form onSubmit={handleSubmit}>
                  <FormControl id="itemName" isRequired>
                    <FormLabel>Item Name</FormLabel>
                    <Input
                      type="text"
                      // value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                    />
                  </FormControl>

                  <FormControl id="unit" isRequired>
                    <FormLabel>Unit</FormLabel>
                    {/* <Input type="text" value={unit} onChange={(e) => setUnit(e.target.value)} /> */}
                    <Select
                      placeholder="Select Unit"
                      // value={unit}
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

                  <FormControl id="available" isRequired>
                    <FormLabel>Available</FormLabel>
                    <Input
                      type="text"
                      // value={available}
                      onChange={(e) => setAvailable(e.target.value)}
                    />
                  </FormControl>

                  <FormControl id="minimum" isRequired>
                    <FormLabel>Minimum</FormLabel>
                    <Input
                      type="text"
                      // value={minimum}
                      onChange={(e) => setMinimum(e.target.value)}
                    />
                  </FormControl>

                  <FormControl id="usageRate" isRequired>
                    <FormLabel>Usage Rate</FormLabel>
                    <Flex>
                      <Input
                        flex="1"
                        mr="2"
                        type="number"
                        // value={usageRateValue}
                        onChange={(e) => setUsageRateValue(e.target.value)}
                        placeholder="Value"
                      />
                      <Select
                        flex="1"
                        ml="2"
                        placeholder="Select Unit"
                        // value={usageRateUnit}
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
                      // value={lastReplenished}
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

      {/* View Modal Start */}
      <ViewItem
        isOpen={isOpenTwo}
        onOpen={onOpenTwo}
        onClose={onCloseTwo}
        EyeIconSelectedId={EyeIconSelectedId}
        overlay={overlay}
        setOverlay={setOverlay}
      />
      {/* View Modal End */}



      {/* Edit Item Modal Start */}

      <EdiItem
        isOpen={isOpenThree}
        onOpen={onOpenThree}
        onClose={onCloseThree}
        PencilIconSelectedId={PencilIconSelectedId}
        overlay={overlay}
        setOverlay={setOverlay}
      />
      {/* Edit Item Modal End  */}
    </div>
  )
}
