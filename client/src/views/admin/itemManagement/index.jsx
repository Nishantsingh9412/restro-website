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
import BarCodeScan from './components/BarCodeScan';
import MyTableComponent from './components/MyTableComponent';
import AddItemModal from './components/AddItemModal';



export default function ItemManagement() {

  const OverlayOne = () => (
    <ModalOverlay
    // bg='blackAlpha.800'
    // backdropFilter='blur(10px) hue-rotate(90deg)'
    />
  )

  const dispatch = useDispatch();
  
  const [barcode_no_val, setBarcode_no_val] = useState('');
  const [handlerFunction, setHandlerFunction] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isOpenTwo, onOpen: onOpenTwo, onClose: onCloseTwo } = useDisclosure()
  const { isOpen: isOpenThree, onOpen: onOpenThree, onClose: onCloseThree } = useDisclosure()
  const { isOpen: isOpenBarCode, onOpen: onOpenBarCode, onClose: onCloseBarCode } = useDisclosure()
  const { isOpen: isOpenAnalytics, onOpen: onOpenAnalytics, onClose: onCloseAnalytics } = useDisclosure();
  const {
    isOpen: isOpenBarCodeScan,
    onOpen: onOpenBarCodeScan,
    onClose: onCloseBarCodeScan
  } = useDisclosure();
  const [overlay, setOverlay] = useState(<OverlayOne />)
  const [itemDataArray, setItemDataArray] = useState([])

  const [EyeIconSelectedId, setEyeIconSelectedId] = useState(null);
  const [AnalyticsSelectedId, setAnalyticsSelectedId] = useState(null);
  const [PencilIconSelectedId, setPencilIconSelectedId] = useState(null);
  const [itemName, setItemName] = useState('');
  const [unit, setUnit] = useState('');             // This is the real unit  (KG, L, M, etc) 
  const [unitValue,setUnitValue] = useState(0);    // This is unit per piece value (1, 2, 3, etc)
  

  const [available, setAvailable] = useState(0);
  const [minimum, setMinimum] = useState(0);
  const [usageRateValue, setUsageRateValue] = useState(0);

  const [usageRateUnit, setUsageRateUnit] = useState('');
  const [pin, setPin] = useState(null);
  const [barCodeData, setbarCodeData] = useState('');
  const [barcodeDataUrl, setBarcodeDataUrl] = useState(null)
  const [existingBarcodeNo, setExistingBarcodeNo] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [showOptions, setShowOptions] = useState(false);
  const [showUsedOptions, setUsedOptions] = useState(false);
  
  const [scanResult, setScanResult] = useState(null);


  const localData = JSON.parse(localStorage.getItem('ProfileData'));
  const userId = localData?.result?._id;
  // console.log('This is userId: ', userId);

  // const handleScan = () => {
  //   console.log('Scan button clicked');
  //   onOpenBarCodeScan();
  // }

  // const handleScanResult = (err, result) => {
  //   if (result) {
  //     setScanResult(result.text);
  //     console.log(" <--------------Scanned scanned scanned scanned ------------------> ")
  //     console.log('Scan result:', result.text);
  //   }
  //   if (err) {
  //     console.error(err);
  //   }
  // };

  const handleScanResult = (result) => {
    if (result) {
      setScanResult(result); // Update the scan result state
    }
    onCloseBarCodeScan(); // Close the modal after scanning
  };


  // const handleClose = () => {
  // onCloseBarCodeScan();
  // history.push('/'); // Navigate back to the home page or previous page
  // };

  // setShowBarCodeScan(true);

  const handleOptionClick = (option) => {
    if (option === 1) {
      setOverlay(<OverlayOne />);
      onOpen();
    } else if (option === 2) {
      setHandlerFunction(() => handleAfterScannedAdd);
      onOpenBarCodeScan();
    }
    setShowOptions(false);                                // Hide options after selection
  };

  const handleUsedOptionClick = (option) => {
    if (option === 1) {
      setOverlay(<OverlayOne />);
      onOpen();
    } else if (option === 2) {
      setHandlerFunction(() => handleAfterScannedUsed);
      onOpenBarCodeScan();
    }
    setUsedOptions(false);                                // Hide options after selection
  };


  const handleGenerateBarcode = (item) => {
    try {
      let canvas = bwipjs.toCanvas('mycanvas', {
        bcid: 'code128',                                    // Barcode type
        text: item.bar_code,                                // Text to encode
        scale: 3,                                           // 3x scaling factor
        height: 10,                                         // Bar height, in millimeters
        includetext: true,                                  // Show human-readable text
        textxalign: 'center',                               // Always good to set this
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
    // let barcodeValue;
    // Handle form submission
    // if(!existingBarcodeNo){
      // barcodeValue = nanoid(13);
      // setBarcode_no_val(nanoid(13));
    // }else{
      // barcodeValue = existingBarcodeNo;
      // setBarcode_no_val(existingBarcodeNo);
    // }

    const newItemData = {
      item_name: itemName,
      item_unit_per_piece_unit: unit,
      item_unit_per_piece_value:unitValue,
      available_quantity: available,
      minimum_quantity: minimum,
      expiry_date: expiryDate,
      bar_code: !existingBarcodeNo ? nanoid(13) : existingBarcodeNo,
      created_by: userId
      // existing_barcode_no: existingBarcodeNo,
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
    const deleteItemPromise = dispatch(deleteSingleItemAction(deleteId))
      .then((res) => {
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
  // console.log("This is ItemDataReducer : \n", ItemDataReducer);
  // console.log("This is ItemData : \n", ItemData);

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

  const handleAfterScannedAdd = () => {
    console.log(' Scan kro add kro : ');
    // setScanResult(result);
    // onCloseBarCodeScan();
  }

  const handleAfterScannedUsed = () => {
    console.log(' Scan kro Use karo : ');
    // setScanResult(result);
    // onCloseBarCodeScan();
  }



  return (
    <div style={{ marginTop: '5vw' }} >
      <Box
        display="flex"
        flexDirection={'row'}
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <div >
          <button
            className={styles.addbtn}
            onClick={() => setShowOptions(!showOptions)}
          >
            Add Itemss
          </button>
          {
            showOptions && (
              <Box className={styles.options} mt={4}>
                <Button
                  onClick={() => handleOptionClick(1)}
                  colorScheme="teal"
                  variant="solid"
                  mr={2}
                >
                  Manually
                </Button>
                <Button
                  onClick={() => handleOptionClick(2)}
                  colorScheme="orange"
                  variant="solid"
                >
                  Scan
                </Button>
              </Box>
            )}
        </div>
        <div>
          <button
            className={styles.addbtn}
            onClick={() => setUsedOptions(!showUsedOptions)}
          >
            Used Itemss
          </button>
          {
            showUsedOptions && (
              <Box className={styles.options} mt={4}>
                <Button
                  onClick={
                    () =>
                      handleUsedOptionClick(1)
                  }
                  colorScheme="teal"
                  variant="solid"
                  mr={2}
                >
                  Manually
                </Button>
                <Button
                  onClick={
                    () =>
                      handleUsedOptionClick(2)
                  }
                  colorScheme="orange"
                  variant="solid"
                >
                  Scan
                </Button>
              </Box>
            )}
        </div>
      </Box>

      <Box>
        {/* Desktop View */}
        <Box display={{ base: 'none', lg: 'block' }} mt="40px">
          <Grid templateColumns="repeat(8, 1fr)" gap={4} className={styles.tableHeader}>
            <GridItem>Item Name</GridItem>
            <GridItem>Unit</GridItem>
            <GridItem>Available</GridItem>
            <GridItem>Low Stock</GridItem>
            <GridItem>Barcode No.</GridItem>
            <GridItem>Replenished</GridItem>
            <GridItem>Expiry Date</GridItem>
            <GridItem>Action</GridItem>
          </Grid>

          {itemDataArray?.map((item, index) => (
            <Grid templateColumns="repeat(8, 1fr)" gap={4} className={styles.tableRow} key={index}>
              <GridItem className={`${styles.truncate} ${styles.tableCell}`}>{item.item_name}</GridItem>
              <GridItem className={`${styles.truncate} ${styles.tableCell}`}>{item.item_unit}</GridItem>
              <GridItem className={`${styles.truncate} ${styles.tableCell}`}>{item.available_quantity}</GridItem>
              <GridItem className={`${styles.truncate} ${styles.tableCell}`}>{item.minimum_quantity}</GridItem>
              <GridItem className={`${styles.truncate} ${styles.tableCell}`}>{item.barcode_no ? item.barcode_no : '--'}</GridItem>
              <GridItem className={`${styles.truncate} ${styles.tableCell}`}>{item.updatedAt.split('T')[0]}</GridItem>
              <GridItem className={`${styles.truncate} ${styles.tableCell}`}>{item.expiry_date ? item.expiry_date.split('T')[0] : '--'}</GridItem>
              <GridItem className={styles.tableCell}>
                <IconButton
                  aria-label="Delete Item"
                  colorScheme="red"
                  size="xs"
                  icon={<IoMdTrash />}
                  onClick={() => handleDeleteItem(item._id)}
                />
                <IconButton
                  aria-label="Edit Item"
                  colorScheme="yellow"
                  size="xs"
                  icon={<IoPencil />}
                  onClick={() => {
                    const inputPin = prompt('Enter your pin');
                    setPencilIconSelectedId(item._id);
                    setOverlay(<OverlayOne />);
                    onOpenThree();
                  }}
                />
                <IconButton
                  aria-label="View Item"
                  colorScheme="green"
                  size="xs"
                  icon={<IoMdEye />}
                  onClick={() => {
                    setEyeIconSelectedId(item._id);
                    setOverlay(<OverlayOne />);
                    onOpenTwo();
                  }}
                />
                <IconButton
                  aria-label="Generate Barcode"
                  colorScheme="blue"
                  size="xs"
                  icon={<BiBarcodeReader />}
                  onClick={() => {
                    handleGenerateBarcode(item);
                    setbarCodeData(item);
                    onOpenBarCode();
                  }}
                />
                <IconButton
                  aria-label="Analytics"
                  colorScheme="teal"
                  size="xs"
                  icon={<IoMdAnalytics />}
                  onClick={() => {
                    setAnalyticsSelectedId(item._id);
                    onOpenAnalytics();
                  }}
                />
              </GridItem>
            </Grid>
          ))}
        </Box>

        {/* Mobile View */}
        <Box display={{ base: 'block', lg: 'none' }} mt="20px">
          <Grid
            templateColumns={{
              base: '1fr',
              sm: 'repeat(1, 1fr)',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(2, 1fr)',
              xl: 'repeat(2, 1fr)',
            }}
            gap={4}
          // Adjust for width below 700px
          // sx={{
          //   '@media (max-width: 700px)': {
          //     templateColumns: '1fr'
          //   }
          // }}
          >
            {itemDataArray?.map((item, index) => (
              <Box
                key={index}
                p={4}
                borderWidth="1px"
                borderRadius="lg"
                boxShadow="md"
                bg="white"
                _hover={{ boxShadow: 'lg' }}
              >
                <Grid
                  templateColumns="auto 1fr"
                  columnGap={2}
                  rowGap={1}
                  alignItems="center"
                >
                  <Box fontWeight="bold">Item Name:</Box>
                  <Box className={styles.truncate}>{item.item_name}</Box>

                  <Box fontWeight="bold">Unit:</Box>
                  <Box className={styles.truncate}>{item.item_unit}</Box>

                  <Box fontWeight="bold">Available:</Box>
                  <Box className={styles.truncate}>{item.available_quantity}</Box>

                  <Box fontWeight="bold">Low Stock:</Box>
                  <Box className={styles.truncate}>{item.minimum_quantity}</Box>

                  <Box fontWeight="bold">Barcode No.:</Box>
                  <Box className={styles.truncate}>{item.barcode_no || '--'}</Box>

                  <Box fontWeight="bold">Replenished:</Box>
                  <Box className={styles.truncate}>{item.updatedAt.split('T')[0]}</Box>

                  <Box fontWeight="bold">Expiry Date:</Box>
                  <Box className={styles.truncate}>{item.expiry_date ? item.expiry_date.split('T')[0] : '--'}</Box>
                </Grid>

                <Box mt={4} display="flex" justifyContent="space-between" alignItems="center">
                  <IconButton
                    aria-label="Delete Item"
                    colorScheme="red"
                    size="xs"
                    icon={<IoMdTrash />}
                    onClick={() => handleDeleteItem(item._id)}
                  />
                  <IconButton
                    aria-label="Edit Item"
                    colorScheme="yellow"
                    size="xs"
                    icon={<IoPencil />}
                    onClick={() => {
                      const inputPin = prompt('Enter your pin');
                      setPencilIconSelectedId(item._id);
                      setOverlay(<OverlayOne />);
                      onOpenThree();
                    }}
                  />
                  <IconButton
                    aria-label="View Item"
                    colorScheme="green"
                    size="xs"
                    icon={<IoMdEye />}
                    onClick={() => {
                      setEyeIconSelectedId(item._id);
                      setOverlay(<OverlayOne />);
                      onOpenTwo();
                    }}
                  />
                  <IconButton
                    aria-label="Generate Barcode"
                    colorScheme="blue"
                    size="xs"
                    icon={<BiBarcodeReader />}
                    onClick={() => {
                      handleGenerateBarcode(item);
                      setbarCodeData(item);
                      onOpenBarCode();
                    }}
                  />
                  <IconButton
                    aria-label="Analytics"
                    colorScheme="teal"
                    size="xs"
                    icon={<IoMdAnalytics />}
                    onClick={() => {
                      setAnalyticsSelectedId(item._id);
                      onOpenAnalytics();
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* Add Modal Start */}
      <AddItemModal
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        itemName={itemName}
        setItemName={setItemName}
        unit={unit}
        setUnit={setUnit}
        unitValue={unitValue}
        setUnitValue={setUnitValue}
        available={available}
        setAvailable={setAvailable}
        minimum={minimum}
        setMinimum={setMinimum}
        usageRateValue={usageRateValue}
        setUsageRateValue={setUsageRateValue}
        usageRateUnit={usageRateUnit}
        setUsageRateUnit={setUsageRateUnit}
        pin={pin}
        setPin={setPin}
        existingBarcodeNo={existingBarcodeNo}
        setExistingBarcodeNo={setExistingBarcodeNo}
        expiryDate={expiryDate}
        setExpiryDate={setExpiryDate}
        handleSubmit={handleSubmit}
        handleAutoAddVals={handleAutoAddVals}
      />


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

      <BarCodeScan
        isOpen={isOpenBarCodeScan}
        onOpen={onOpenBarCodeScan}
        onClose={onCloseBarCodeScan}
        handleAfterScanned={handlerFunction}
      />
        {/* // handleAfterScanned={handleAfterScannedAdd}
        // handleAfterScannedUsed={handleAfterScannedUsed}
      // handleScanResult={handleScanResult}
      // scanResult={scanResult}
      // /> */}
    </div >
  )
}
