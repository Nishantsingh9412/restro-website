import React, { useEffect, useState } from 'react'
import { FiPlusCircle } from "react-icons/fi";
import { toast } from 'react-toastify';
import { nanoid } from 'nanoid';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2'
import bwipjs from 'bwip-js';
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
  Flex,
  Grid,
  GridItem,
} from "@chakra-ui/react"

import { IoMdEye, IoMdTrash } from 'react-icons/io';
import { IoPencil } from 'react-icons/io5';
import { BiBarcodeReader } from 'react-icons/bi';
import { IoMdAnalytics } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';

import { AddItemAction, GetAllItemsAction, deleteSingleItemAction } from '../../../redux/action/Items';
import ViewItem from './components/ViewItem'
import EdiItem from './components/EditItem';
import ViewCode from './components/ViewCode';
import ViewAnalytics from './components/ViewAnalytics';
import styles from './ItemManagement.module.css'



export default function ItemManagement() {

  const OverlayOne = () => (
    <ModalOverlay
    // bg='blackAlpha.800'
    // backdropFilter='blur(10px) hue-rotate(90deg)'
    />
  )

  const dispatch = useDispatch();

  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isOpenTwo, onOpen: onOpenTwo, onClose: onCloseTwo } = useDisclosure()
  const { isOpen: isOpenThree, onOpen: onOpenThree, onClose: onCloseThree } = useDisclosure()
  const { isOpen: isOpenBarCode, onOpen: onOpenBarCode, onClose: onCloseBarCode } = useDisclosure()
  const { isOpen: isOpenAnalytics, onOpen: onOpenAnalytics, onClose: onCloseAnalytics } = useDisclosure();
  const [overlay, setOverlay] = useState(<OverlayOne />)
  const [itemDataArray, setItemDataArray] = useState([])

  const [EyeIconSelectedId, setEyeIconSelectedId] = useState(null);
  const [AnalyticsSelectedId, setAnalyticsSelectedId] = useState(null);
  const [PencilIconSelectedId, setPencilIconSelectedId] = useState(null);
  const [itemName, setItemName] = useState('');
  const [unit, setUnit] = useState('');

  const [available, setAvailable] = useState(0);
  const [minimum, setMinimum] = useState(0);
  const [usageRateValue, setUsageRateValue] = useState(0);

  const [usageRateUnit, setUsageRateUnit] = useState('');
  const [pin, setPin] = useState(null);
  const [barCodeData, setbarCodeData] = useState('');
  const [barcodeDataUrl, setBarcodeDataUrl] = useState(null)
  const [existingBarcodeNo, setExistingBarcodeNo] = useState('')
  const [expiryDate, setExpiryDate] = useState('')


  const localData = JSON.parse(localStorage.getItem('ProfileData'));
  const userId = localData?.result?._id;
  console.log('This is userId: ', userId);

  const handleGenerateBarcode = (item) => {
    try {
      let canvas = bwipjs.toCanvas('mycanvas', {
        bcid: 'code128',       // Barcode type
        text: item.bar_code,    // Text to encode
        scale: 3,               // 3x scaling factor
        height: 10,              // Bar height, in millimeters
        includetext: true,            // Show human-readable text
        textxalign: 'center',        // Always good to set this
      });
      // Convert the canvas to a data URL and save it in the state
      let dataUrl = canvas.toDataURL();
      setBarcodeDataUrl(dataUrl);
    } catch (e) {
      console.log('Error in generating barcode')
    }
  }

  const checkPin = (inputPin) => {
    if (inputPin === '1234') {
      return true;
    } else {
      alert('Wrong Pin');
      return false;
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    const newItemData = {
      item_name: itemName,
      item_unit: unit,
      available_quantity: available,
      minimum_quantity: minimum,
      existing_barcode_no: existingBarcodeNo,
      expiry_date: expiryDate,
      bar_code: nanoid(13),
      created_by: userId
      // usage_rate_value: usageRateValue,
      // usage_rate_unit: usageRateUnit,
      // Last_Replenished: lastReplenished
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
        dispatch(GetAllItemsAction(userId));
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
    const style = document.createElement('style');
    style.innerHTML = `
    .swal-bg {
        background-color: #F3F2EE !important;
    }
    .swal-border {
        border: 5px solid #fff !important;
    }`;
    document.head.appendChild(style);

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      customClass: {
        popup: 'swal-bg swal-border'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        handleConfirmDelete(id);
      }
    });
  }

  useEffect(() => {
    dispatch(GetAllItemsAction(userId));
  }, [])


  const ItemDataReducer = useSelector((state) => state.itemsReducer);
  const ItemData = ItemDataReducer?.items
  console.log("This is ItemDataReducer : \n", ItemDataReducer);
  console.log("This is ItemData : \n", ItemData);

  const handleAutoAddVals = () => {
    setItemName('Rice');
    setUnit('KG');
    setAvailable(100);
    setMinimum(10);
    setUsageRateValue(5);
    setUsageRateUnit('KG');
    setExistingBarcodeNo('1FRE6ZE124R78');
    setExpiryDate('2021-07-01');

    // setLastReplenished('2021-07-01');
  }

  useEffect(() => {
    setItemDataArray(ItemData)
  }, [ItemData])

  return (
    <div style={{ marginTop: '5vw' }} >
      <div >
        <button
          className={styles.addbtn}
          onClick={() => {
            setOverlay(<OverlayOne />)
            onOpen()
          }}
        >
          Add Item
        </button>
      </div>

      <Box>
        <Box display={{ base: 'none', lg: 'block' }} mt="40px">
          <Grid templateColumns="repeat(8, 1fr)" gap={4} className={styles.tableHeader}>
            <GridItem>Item Name</GridItem>
            <GridItem>Unit</GridItem>
            <GridItem>Available</GridItem>
            <GridItem>Minimum</GridItem>
            <GridItem>Barcode No.</GridItem>
            <GridItem>Last Replenished</GridItem>
            <GridItem>Expiry Date</GridItem>
            <GridItem>Action</GridItem>
          </Grid>

          {itemDataArray?.map((item, index) => (
            <Grid templateColumns="repeat(8, 1fr)" gap={4} className={styles.tableRow} key={index}>
              <GridItem>{item.item_name}</GridItem>
              <GridItem>{item.item_unit}</GridItem>
              <GridItem>{item.available_quantity}</GridItem>
              <GridItem>{item.minimum_quantity}</GridItem>
              <GridItem>{item.existing_barcode_no ? item.existing_barcode_no : '--'}</GridItem>
              <GridItem>{item.updatedAt.split('T')[0]}</GridItem>
              <GridItem>{item.expiry_date ? item.expiry_date.split('T')[0] : '--'}</GridItem>
              <GridItem>
                <IconButton
                  aria-label='Delete Item'
                  colorScheme='red'
                  size='sm'
                  icon={<IoMdTrash />}
                  onClick={() => handleDeleteItem(item._id)}
                />
                <IconButton
                  aria-label='Edit Item'
                  colorScheme='yellow'
                  size='sm'
                  icon={<IoPencil />}
                  onClick={() => {
                    const inputPin = prompt('Enter your pin');
                    setPencilIconSelectedId(item._id);
                    setOverlay(<OverlayOne />);
                    onOpenThree();
                  }}
                />
                <IconButton
                  aria-label='View Item'
                  colorScheme='green'
                  size='sm'
                  icon={<IoMdEye />}
                  onClick={() => {
                    setEyeIconSelectedId(item._id)
                    setOverlay(<OverlayOne />)
                    onOpenTwo()
                  }}
                />
                <IconButton
                  aria-label='Generate Barcode'
                  colorScheme='blue'
                  size='sm'
                  icon={<BiBarcodeReader />}
                  onClick={() => {
                    handleGenerateBarcode(item)
                    setbarCodeData(item)
                    onOpenBarCode()
                  }}
                />
                <IconButton
                  aria-label='Analytics'
                  colorScheme='teal'
                  size='sm'
                  icon={<IoMdAnalytics />}
                  onClick={() => {
                    setAnalyticsSelectedId(item._id)
                    onOpenAnalytics()
                  }}
                />
              </GridItem>
            </Grid>
          ))}
        </Box>

        {/* Mobile View */}
        <Box display={{ base: 'block', lg: 'none' }} mt="40px">
          {itemDataArray?.map((item, index) => (
            <Box key={index} mb={4} p={4} borderWidth="1px" borderRadius="lg">
              <Box><strong>Item Name:</strong> {item.item_name}</Box>
              <Box><strong>Unit:</strong> {item.item_unit}</Box>
              <Box><strong>Available:</strong> {item.available_quantity}</Box>
              <Box><strong>Minimum:</strong> {item.minimum_quantity}</Box>
              <Box><strong>Barcode No.:</strong> {item.existing_barcode_no ? item.existing_barcode_no : '--'}</Box>
              <Box><strong>Last Replenished:</strong> {item.updatedAt.split('T')[0]}</Box>
              <Box><strong>Expiry Date:</strong> {item.expiry_date ? item.expiry_date.split('T')[0] : '--'}</Box>
              <Box mt={2}>
                <IconButton
                  aria-label='Delete Item'
                  colorScheme='red'
                  size='sm'
                  icon={<IoMdTrash />}
                  onClick={() => handleDeleteItem(item._id)}
                  mr={2}
                />
                <IconButton
                  aria-label='Edit Item'
                  colorScheme='yellow'
                  size='sm'
                  icon={<IoPencil />}
                  onClick={() => {
                    const inputPin = prompt('Enter your pin');
                    setPencilIconSelectedId(item._id);
                    setOverlay(<OverlayOne />);
                    onOpenThree();
                  }}
                  mr={2}
                />
                <IconButton
                  aria-label='View Item'
                  colorScheme='green'
                  size='sm'
                  icon={<IoMdEye />}
                  onClick={() => {
                    setEyeIconSelectedId(item._id)
                    setOverlay(<OverlayOne />)
                    onOpenTwo()
                  }}
                  mr={2}
                />
                <IconButton
                  aria-label='Generate Barcode'
                  colorScheme='blue'
                  size='sm'
                  icon={<BiBarcodeReader />}
                  onClick={() => {
                    handleGenerateBarcode(item)
                    setbarCodeData(item)
                    onOpenBarCode()
                  }}
                  mr={2}
                />
                <IconButton
                  aria-label='Analytics'
                  colorScheme='teal'
                  size='sm'
                  icon={<IoMdAnalytics />}
                  onClick={() => {
                    setAnalyticsSelectedId(item._id)
                    onOpenAnalytics()
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>


      {/* <div className={`d-none d-lg-block`} style={{ marginTop: '40px' }}>
        <div
          className={styles.tableHeader}
        >
          <div>Item Name</div>
          <div>Unit</div>
          <div>Available</div>
          <div>Minimum</div>
          <div>Barcode No.</div>
          <div>Last Replenished</div>
          <div>Expiry Date</div>
          <div>Action</div>
        </div>

        {itemDataArray?.map((item, index) => (
          <div className={styles.tableRow} key={index}>
            <div>{item.item_name}</div>
            <div>{item.item_unit}</div>
            <div>{item.available_quantity}</div>
            <div>{item.minimum_quantity}</div>
            <div>{item.existing_barcode_no ? item.existing_barcode_no : '--'}</div>
            <div>{item.updatedAt.split('T')[0]}</div>
            <div>{item.expiry_date ? item.expiry_date.split('T')[0] : '--'} </div>
            <div>
              <IconButton
                aria-label='Delete Item'
                colorScheme='red'
                size='sm'
                icon={<IoMdTrash />}
                onClick={() => handleDeleteItem(item._id)}
              />
              <IconButton
                aria-label='Edit Item'
                colorScheme='yellow'
                size='sm'
                icon={<IoPencil />}
                onClick={() => {
                  const inputPin = prompt('Enter your pin');
                  setPencilIconSelectedId(item._id);
                  setOverlay(<OverlayOne />);
                  onOpenThree();
                }}
              />
              <IconButton
                aria-label='Edit Item'
                colorScheme='green'
                size='sm'
                icon={<IoMdEye />}
                onClick={() => {
                  setEyeIconSelectedId(item._id)
                  setOverlay(<OverlayOne />)
                  onOpenTwo()
                }}
              />
              <IconButton
                aria-label='Generate Barcode'
                colorScheme='blue'
                size='sm'
                icon={<BiBarcodeReader />}
                onClick={() => {
                  handleGenerateBarcode(item)
                  setbarCodeData(item)
                  onOpenBarCode()
                }}
              />

              <IconButton
                aria-label='Generate Barcode'
                colorScheme='teal'
                size='sm'
                icon={<IoMdAnalytics />}
                onClick={() => {
                  setAnalyticsSelectedId(item._id)
                  onOpenAnalytics()
                }}
              />
            </div>
          </div>
        ))}
      </div> */}


      {/* <div className="d-sm-block d-md-block d-lg-none">
        <div className="row">
          {itemDataArray?.map((item, index) => (
            <div className="col-12 col-sm-6 col-lg-4">
              <div className="card mt-2"
                style={{
                  border: '3px solid #029CFF',
                  borderRadius: '2rem'
                }}
                key={index}
              >
                <div className="card-body">
                  <h5 className="card-title d-flex justify-content-center font-weight-bold">{item.item_name}</h5>
                  <table className="table">
                    <tbody>
                      <tr>
                        <th scope="row">Unit</th>
                        <td>{item.item_unit}</td>
                      </tr>
                      <tr>
                        <th scope="row">Available</th>
                        <td>{item.available_quantity}</td>
                      </tr>
                      <tr>
                        <th scope="row">Minimum</th>
                        <td>{item.minimum_quantity}</td>
                      </tr>
                      <tr>
                        <th scope="row">Barcode No.</th>
                        <div>{item.existing_barcode_no ? item.existing_barcode_no : '--'}</div>

                      </tr>
                      <tr>
                        <th scope="row">Last Replenished</th>
                        <td>{item.updatedAt.split('T')[0]}</td>
                      </tr>

                      <tr>
                        <th scope="row">Expiry Date</th>
                        <td>{item.expiry_date ? item.expiry_date.split('T')[0] : '--'}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className='d-flex justify-content-evenly' >
                    <IconButton
                      aria-label='Delete Item'
                      colorScheme='red'
                      size='sm'
                      icon={<IoMdTrash />}
                      onClick={() => handleDeleteItem(item._id)}
                    />
                    <IconButton
                      aria-label='Edit Item'
                      colorScheme='yellow'
                      size='sm'
                      icon={<IoPencil />}
                      onClick={() => {
                        setPencilIconSelectedId(item._id)
                        setOverlay(<OverlayOne />)
                        onOpenThree()
                      }}
                    />
                    <IconButton
                      aria-label='Edit Item'
                      colorScheme='green'
                      size='sm'
                      icon={<IoMdEye />}
                      onClick={() => {
                        setEyeIconSelectedId(item._id)
                        setOverlay(<OverlayOne />)
                        onOpenTwo()
                      }}
                    />
                    <IconButton
                      aria-label='Generate Barcode'
                      colorScheme='blue'
                      size='sm'
                      icon={<BiBarcodeReader />}
                      onClick={() => {
                        // handleGenerateBarcode(item)
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div> */}


      {/* Table Start */}
      {/* <Box style={{ marginTop: '2vw' }} overflowX="auto">
        <Table variant="striped" colorScheme="teal" >
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
          <Tbody
          >
            {itemDataArray?.map((item, index) => {
              return (
                <Tr  key={index}>
                  <Td>{item.item_name}</Td>
                  <Td>{item.item_unit}</Td>
                  <Td isNumeric>{item.available_quantity}</Td>
                  <Td isNumeric>{item.minimum_quantity}</Td>
                  <Td isNumeric>{item.usage_rate_value}{item.usage_rate_unit}</Td>
                  <Td isNumeric>{item.updatedAt.split('T')[0]}</Td>
                  <Td
                    display={'flex'}
                  >

                    <IconButton
                      aria-label='Delete Item'
                      colorScheme='red'
                      size='sm'
                      icon={<IoMdTrash
                        onClick={() => handleDeleteItem(item._id)}
                      />} />

                    <IconButton
                      // ml={2}
                      aria-label='Edit Item'
                      colorScheme='yellow'
                      size='sm'
                      icon={<IoPencil />}
                      onClick={() => {
                        setPencilIconSelectedId(item._id)
                        setOverlay(<OverlayOne />)
                        onOpenThree()
                      }}
                    />

                    <IconButton
                      // ml={2}
                      aria-label='Edit Item'
                      colorScheme='green'
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
      </Box> */}
      {/* Table End */}

      {/* Add Modal Start */}
      <>
        <Modal isCentered isOpen={isOpen} onClose={onClose}>
          {overlay}
          <ModalContent
            background={'#D8EFFE'}
            border='5px solid #fff'
          >
            <ModalHeader
              textAlign='center'
            >
              Add Item
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>

              <Button onClick={handleAutoAddVals} >
                +
              </Button>


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
              <Box
                maxW="sm"
                m="auto"
                p="4"
                // borderWidth="1px"
                borderRadius="lg"
              // border='4px solid #fff'
              // background={'whiteAlpha.100'}
              >
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

                  {/* <FormControl id="usageRate" isRequired>
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
                  </FormControl> */}

                  {/* <FormControl id="lastReplenished" isRequired>
                    <FormLabel>Last Replenished</FormLabel>
                    <Input
                      type="date"
                      value={lastReplenished}
                      onChange={(e) => setLastReplenished(e.target.value)}
                    />
                  </FormControl> */}
                  <FormControl id="expiryDate">
                    <FormLabel>
                      Expiry Date
                    </FormLabel>
                    <Input
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                    />
                  </FormControl>
                  <FormControl id="existingBarcodeNo" >
                    <FormLabel>Barcode No</FormLabel>
                    <Input
                      type="text"
                      value={existingBarcodeNo}
                      onChange={(e) => setExistingBarcodeNo(e.target.value)}
                    />
                  </FormControl>
                  <Button
                    mt="4"
                    colorScheme='cyan'
                    color='#fff'
                    type="submit"
                  >
                    Add Item
                  </Button>
                </form>
              </Box>
              {/* Form End */}

            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme='gray'

                onClick={onClose}>Close</Button>
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

      <canvas id="mycanvas"
        style={{ display: 'none' }}
      ></canvas>

      <ViewCode
        isOpen={isOpenBarCode}
        onOpen={onOpenBarCode}
        onClose={onCloseBarCode}
        barCodeData={barCodeData}
        barcodeDataUrl={barcodeDataUrl}
      />

      <ViewAnalytics
        isOpen={isOpenAnalytics}
        onOpen={onOpenAnalytics}
        onClose={onCloseAnalytics}
        AnalyticsSelectedId={AnalyticsSelectedId}
      />


    </div >
  )
}
