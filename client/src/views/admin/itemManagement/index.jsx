// Import necessary libraries and components
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import bwipjs from "bwip-js";
import {
  Box,
  Button,
  useDisclosure,
  IconButton,
  Flex,
  Grid,
  GridItem,
  Spinner,
} from "@chakra-ui/react";

import { IoMdQrScanner, IoMdTrash } from "react-icons/io";
import { IoPencil } from "react-icons/io5";
import { BiBarcodeReader } from "react-icons/bi";
import { IoMdAnalytics } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";

import {
  addItemAction,
  getAllItemsAction,
  deleteSingleItemAction,
  updateSingleItemAction,
} from "../../../redux/action/Items";
// import ViewItem from "./components/ViewItem";
// import EdiItem from "./components/EditItem";
import ViewCode from "./components/ViewCode";
import ViewAnalytics from "./components/ViewAnalytics";
import ItemManagementModal from "./components/itemModal";
import BarCodePrinter from "./components/BarCodePrinter";
import BarcodeScanner from "./components/BarCodeScan";
import ItemUseModal from "./components/ItemUseModal";
import ForbiddenPage from "../../../components/forbiddenPage/ForbiddenPage";
import { useToast } from "../../../contexts/useToast";
import { localStorageData } from "../../../utils/constant";

export default function ItemManagement() {
  const dispatch = useDispatch();
  const showToast = useToast();

  // Manage modal states
  const {
    isOpen: isAddItemModalOpen,
    onOpen: handleAddItemModalOpen,
    onClose: handleAddItemModalClose,
  } = useDisclosure();
  const {
    isOpen: isOpenBarCode,
    onOpen: onOpenBarCode,
    onClose: onCloseBarCode,
  } = useDisclosure();
  const {
    isOpen: isOpenAnalytics,
    onOpen: onOpenAnalytics,
    onClose: onCloseAnalytics,
  } = useDisclosure();

  // Mode Modal
  const {
    isOpen: isModeModalOpen,
    onOpen: handleModeModalOpen,
    onClose: handleModeModalClose,
  } = useDisclosure();

  //Barcode Scanner Modal
  const {
    isOpen: isScannerModalOpen,
    onOpen: handleScannerModalOpen,
    onClose: handleScannerModalClose,
  } = useDisclosure();

  // Item use modal state
  const {
    isOpen: isItemUseModalOpen,
    onOpen: handleItemUseModalOpen,
    onClose: handleItemUseModalClose,
  } = useDisclosure();

  // State variables
  const [itemDataArray, setItemDataArray] = useState([]);
  const [actionType, setActionType] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [analyticsId, setAnalyticsId] = useState(null);
  const [selectedItemData, setSelectedItemData] = useState(null);
  const [barCodeData, setbarCodeData] = useState("");
  const [barcodeDataUrl, setBarcodeDataUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPermitted, setIsPermitted] = useState(true);

  // Get item data from Redux store
  const ItemData = useSelector((state) => state.itemsReducer.items);
  // Get user ID from local storage
  const userId = JSON.parse(localStorage.getItem(localStorageData.PROFILE_DATA))
    ?.result?._id;

  // Generate barcode for an item
  const handleGenerateBarcode = (item) => {
    try {
      let canvas = bwipjs.toCanvas("mycanvas", {
        bcid: "code128", // Barcode type
        text: item.bar_code, // Text to encode
        scale: 3, // 3x scaling factor
        height: 10, // Bar height, in millimeters
        includetext: true, // Show human-readable text
        textxalign: "center", // Always good to set this
      });
      // Convert the canvas to a data URL and save it in the state
      let dataUrl = canvas.toDataURL();
      setBarcodeDataUrl(dataUrl);
    } catch (e) {
      console.log("Error in generating barcode", e);
    }
  };

  // Handle item submission
  const handleSubmit = async (formData) => {
    formData.created_by = userId;
    try {
      const res = await dispatch(addItemAction(formData));
      if (res.success) {
        handleOnItemModalClose();
        showToast(res.message, "success");
      } else {
        throw new Error("Error Adding Item");
      }
    } catch (e) {
      showToast(e.message, "error");
      // console.error(e);
    }
  };

  const handleUpdate = async (formData) => {
    formData.created_by = userId;
    try {
      const res = await dispatch(
        updateSingleItemAction(selectedItemId, formData)
      );
      if (res.success) {
        handleOnItemModalClose();
        showToast(res.message, "success");
      } else {
        throw new Error("Error Updating Item");
      }
    } catch (e) {
      showToast(e.message, "error");
      console.error(e);
    }
  };

  // Confirm item deletion
  const handleDeleteItem = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const deleteItemPromise = dispatch(deleteSingleItemAction(id)).then(
          (res) => {
            if (res.success) {
              dispatch(getAllItemsAction(userId));
              return res.message;
            } else {
              throw new Error("Error Deleting Item");
            }
          }
        );
        toast.promise(deleteItemPromise, {
          pending: "Deleting Item...",
          success: "Item Deleted Successfully",
          error: "Error in Deleting Item",
        });
      }
    });
  };
  const handleAddMode = () => {
    setActionType("add");
    handleAddItemModalOpen();
  };

  const handleUpdateMode = () => {
    setActionType("edit");
    handleAddItemModalOpen();
  };

  const handleEditItem = (item) => {
    setActionType("edit");
    setSelectedItemId(item?._id);
    setSelectedItemData(item);
    handleAddItemModalOpen();
  };

  const handleOnItemModalClose = () => {
    handleAddItemModalClose();
    handleItemUseModalClose();
    setActionType(null);
    setSelectedItemId(null);
    setSelectedItemData(null);
  };

  const handleAfterScanned = (value) => {
    const item = ItemData.find((item) => item.bar_code === value);
    setSelectedItemData(item ? item : { bar_code: value });
    setSelectedItemId(item?._id);
    toast.info(
      item
        ? "Item already exists, you can edit it"
        : "Item does not exist, you can add it"
    );
    handleModeModalOpen();
  };

  useEffect(() => {
    // Fetch all items when the component mounts
    dispatch(getAllItemsAction(userId))
      .then((res) => {
        if (!res.success) {
          showToast(res.message, "error");
          if (res.status === 403) {
            setIsPermitted(false);
          }
        }
      })
      .finally(() => setLoading(false));
  }, [dispatch, userId]);

  useEffect(() => {
    setItemDataArray(ItemData);
  }, [ItemData]);

  if (!isPermitted) {
    return <ForbiddenPage isPermitted={isPermitted} />;
  }

  // Loader component to show while data is being fetched
  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="50vh">
        <Spinner size="xl" color="var(--primary)" />
      </Flex>
    );
  }

  return (
    <div style={{ marginTop: "5vw", padding: "0 2vw" }}>
      <Box overflowX="auto">
        <Box px={{ base: 4, md: 8 }} py={6}>
          <ToastContainer />
          <Flex justify="space-between" mb={2}>
            <Button
              leftIcon={<IoMdQrScanner />}
              colorScheme="teal"
              variant="solid"
              p={4}
              onClick={handleScannerModalOpen}
              w={{ base: "100%", md: "auto" }}
              mx={2}
            >
              Open Scanner
            </Button>
          </Flex>

          <Box overflowX="auto">
            {/* Table Header */}
            <Box display={{ base: "none", lg: "block" }} mt="10px">
              <Grid
                templateColumns="repeat(8, 1fr)"
                gap={6}
                bg="gray.100"
                p={2}
                borderRadius="md"
                textAlign="center"
                fontWeight="bold"
                fontSize="md"
                className="tableHeader"
              >
                <GridItem>Item Name</GridItem>
                <GridItem>Unit</GridItem>
                <GridItem>Available</GridItem>
                <GridItem>Minimum</GridItem>
                <GridItem>Barcode No.</GridItem>
                <GridItem>Last Replenished</GridItem>
                <GridItem>Expiry Date</GridItem>
                <GridItem>Action</GridItem>
              </Grid>

              {/* Table Rows */}
              {itemDataArray?.map((item, index) => (
                <Grid
                  templateColumns="repeat(8, 1fr)"
                  gap={2}
                  my={1}
                  key={index}
                  bg={index % 2 === 0 ? "white" : "gray.50"}
                  py={2}
                  borderRadius="md"
                  alignItems="center"
                  className="tableRow"
                  textAlign="center"
                  fontWeight={500}
                >
                  <GridItem mx={1}>
                    {item.item_name.length > 18
                      ? `${item.item_name.substring(0, 18)}...`
                      : item.item_name}
                  </GridItem>
                  <GridItem>{item.item_unit ?? "-"}</GridItem>
                  <GridItem>{item.available_quantity ?? "-"}</GridItem>
                  <GridItem>{item.minimum_quantity ?? "-"}</GridItem>
                  <GridItem>
                    <BarCodePrinter barCodeValue={item?.bar_code} /> <br />
                    {item.existing_barcode_no || item.bar_code || "--"}
                  </GridItem>
                  <GridItem>
                    {new Date(item.updatedAt).toLocaleDateString("en-GB")}{" "}
                    {/* Converts to DD-MM-YYYY */}
                  </GridItem>
                  <GridItem>
                    {item.expiry_date
                      ? new Date(item.expiry_date).toLocaleDateString("en-GB")
                      : "--"}
                  </GridItem>

                  <Grid templateColumns={"repeat(2, 0fr)"} mx={3} gap={1}>
                    <GridItem display="flex" justifyContent="center">
                      <IconButton
                        aria-label="Delete Item"
                        colorScheme="red"
                        size="sm"
                        icon={<IoMdTrash />}
                        onClick={() => handleDeleteItem(item._id)}
                      />
                    </GridItem>
                    <GridItem>
                      <IconButton
                        aria-label="Edit Item"
                        colorScheme="yellow"
                        size="sm"
                        icon={<IoPencil />}
                        onClick={() => handleEditItem(item)}
                      />
                    </GridItem>

                    <GridItem>
                      <IconButton
                        aria-label="Generate Barcode"
                        colorScheme="blue"
                        size="sm"
                        icon={<BiBarcodeReader />}
                        onClick={() => {
                          handleGenerateBarcode(item);
                          setbarCodeData(item);
                          onOpenBarCode();
                        }}
                      />
                    </GridItem>
                    <GridItem>
                      <IconButton
                        aria-label="Analytics"
                        colorScheme="teal"
                        size="sm"
                        icon={<IoMdAnalytics />}
                        onClick={() => {
                          setAnalyticsId(item._id);
                          onOpenAnalytics();
                        }}
                      />
                    </GridItem>
                  </Grid>
                </Grid>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Mobile View */}
        <Box display={{ base: "block", lg: "none" }} mt="10px">
          {itemDataArray?.map((item, index) => (
            <Box
              key={index}
              mb={4}
              p={4}
              borderWidth="1px"
              borderRadius="lg"
              bg="white"
            >
              <Box>
                <strong>Item Name:</strong> {item.item_name}
              </Box>
              <Box>
                <strong>Unit:</strong> {item.item_unit}
              </Box>
              <Box>
                <strong>Available:</strong> {item.available_quantity}
              </Box>
              <Box>
                <strong>Minimum:</strong> {item.minimum_quantity}
              </Box>
              <Box>
                <strong>Barcode No.:</strong>{" "}
                {item.existing_barcode_no || item.bar_code || "--"}
              </Box>
              <Box>
                <strong>Last Replenished:</strong>{" "}
                {new Date(item.updatedAt).toLocaleDateString("en-GB")}{" "}
              </Box>
              <Box>
                <strong>Expiry Date:</strong>{" "}
                {item.expiry_date
                  ? new Date(item.expiry_date).toLocaleDateString("en-GB")
                  : "--"}
              </Box>

              <Box mt={2}>
                <Flex justifyContent="center">
                  <IconButton
                    aria-label="Delete Item"
                    colorScheme="red"
                    size="md"
                    icon={<IoMdTrash />}
                    onClick={() => handleDeleteItem(item._id)}
                    mr={2}
                  />
                  <IconButton
                    aria-label="Edit Item"
                    colorScheme="yellow"
                    size="md"
                    icon={<IoPencil />}
                    onClick={() => {
                      setSelectedItemData(item._id);
                      setActionType("edit");
                      handleAddItemModalOpen();
                    }}
                    mr={2}
                  />
                  <IconButton
                    aria-label="Generate Barcode"
                    colorScheme="blue"
                    size="md"
                    icon={<BiBarcodeReader />}
                    onClick={() => {
                      handleGenerateBarcode(item);
                      setbarCodeData(item);
                      onOpenBarCode();
                    }}
                    mr={2}
                  />
                  <IconButton
                    aria-label="Analytics"
                    colorScheme="teal"
                    size="md"
                    icon={<IoMdAnalytics />}
                    onClick={() => {
                      setAnalyticsId(item._id);
                      onOpenAnalytics();
                    }}
                    mr={2}
                  />
                  <BarCodePrinter
                    barCodeValue={item?.bar_code}
                    isMobile={true}
                  />
                </Flex>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
      {/* Modal of button */}
      <Modal isOpen={isModeModalOpen} onClose={handleModeModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select method</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex justifyContent="space-around">
              <Button
                colorScheme="teal"
                onClick={() => {
                  /* Handle add item */
                  !selectedItemId ? handleAddMode() : handleUpdateMode();
                  handleModeModalClose();
                }}
              >
                {!selectedItemId ? "Add Item" : "Update Item"}
              </Button>
              <Button
                colorScheme="blue"
                onClick={() => {
                  /* Handle scan input */
                  handleItemUseModalOpen();
                  handleModeModalClose();
                }}
              >
                Use Item
              </Button>
            </Flex>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
      <canvas id="mycanvas" style={{ display: "none" }}></canvas>

      {isAddItemModalOpen && (
        <ItemManagementModal
          isOpen={isAddItemModalOpen}
          onClose={handleOnItemModalClose}
          actionType={actionType}
          handleSubmit={actionType === "add" ? handleSubmit : handleUpdate}
          itemData={actionType === "edit" ? selectedItemData : selectedItemData}
        />
      )}
      {isScannerModalOpen && (
        <BarcodeScanner
          isOpen={isScannerModalOpen}
          onClose={handleScannerModalClose}
          handleAfterScanned={handleAfterScanned}
          handleAfterManually={handleModeModalOpen}
        />
      )}
      {isOpenBarCode && (
        <ViewCode
          isOpen={isOpenBarCode}
          onOpen={onOpenBarCode}
          onClose={onCloseBarCode}
          barCodeData={barCodeData}
          barcodeDataUrl={barcodeDataUrl}
        />
      )}
      {isOpenAnalytics && (
        <ViewAnalytics
          isOpen={isOpenAnalytics}
          onOpen={onOpenAnalytics}
          onClose={onCloseAnalytics}
          AnalyticsSelectedId={analyticsId}
        />
      )}
      {isItemUseModalOpen && (
        <ItemUseModal
          isOpen={isItemUseModalOpen}
          onClose={handleOnItemModalClose}
          itemData={selectedItemData}
          handleUpdate={handleUpdate}
          itemsList={!selectedItemId ? itemDataArray : null}
        />
      )}
    </div>
  );
}
