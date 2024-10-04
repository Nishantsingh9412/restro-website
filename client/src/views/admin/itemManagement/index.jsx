// Import necessary libraries and components
import { useEffect, useState } from "react";
import { FiPlusCircle } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
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

import { IoMdTrash } from "react-icons/io";
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

export default function ItemManagement() {
  const dispatch = useDispatch();

  // Manage modal states
  const { isOpen, onOpen, onClose } = useDisclosure();
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

  // State variables
  const [itemDataArray, setItemDataArray] = useState([]);
  const [actionType, setActionType] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [analyticsId, setAnalyticsId] = useState(null);
  const [selectedItemData, setSelectedItemData] = useState(null);
  const [barCodeData, setbarCodeData] = useState("");
  const [barcodeDataUrl, setBarcodeDataUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get item data from Redux store
  const ItemDataReducer = useSelector((state) => state.itemsReducer);
  const ItemData = ItemDataReducer?.items;

  // Get user ID from local storage
  const localData = JSON.parse(localStorage.getItem("ProfileData"));
  const userId = localData?.result?._id;

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
  const handleSubmit = (formData) => {
    formData.created_by = userId;
    try {
      const AddItemPromise = dispatch(addItemAction(formData)).then((res) => {
        if (res.success) {
          onClose();
          return res.message;
        } else {
          throw new Error("Error Adding Item");
        }
      });
      toast.promise(AddItemPromise, {
        pending: "Processing Addition of Item...",
        success: "Item Added Successfully",
        error: "Error in Adding Item",
      });
    } catch (e) {
      console.log("Error in adding item", e);
    }
  };

  // Handle item update
  const handleUpdate = (formData) => {
    formData.created_by = userId;
    try {
      const EditItemPromise = dispatch(
        updateSingleItemAction(selectedItemId, formData)
      ).then((res) => {
        if (res.success) {
          onClose();
          return res.message;
        } else {
          throw new Error("Error Adding Item");
        }
      });
      toast.promise(EditItemPromise, {
        pending: "Processing Update of Item...",
        success: "Item Updated Successfully",
        error: "Error in Updating Item",
      });
    } catch {
      console.log("Error in updating item");
    }
  };

  // Confirm item deletion
  const handleConfirmDelete = (deleteId) => {
    const deleteItemPromise = dispatch(deleteSingleItemAction(deleteId)).then(
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
  };

  // Handle item deletion
  const handleDeleteItem = (id) => {
    const style = document.createElement("style");
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
        popup: "swal-bg swal-border",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        handleConfirmDelete(id);
      }
    });
  };

  // Handle modal close
  const handleOnClose = () => {
    onClose();
    setActionType(null);
    setSelectedItemId(null);
    setSelectedItemData(null);
  };

  // Fetch all items on component mount
  useEffect(() => {
    dispatch(getAllItemsAction(userId));
    setLoading(false);
  }, []);

  // Update item data array when ItemData changes
  useEffect(() => {
    setItemDataArray(ItemData);
  }, [ItemData]);

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
          <Button
            leftIcon={<FiPlusCircle />}
            colorScheme="teal"
            variant="solid"
            onClick={() => {
              onOpen();
              setActionType("add");
            }}
            mb={2}
            w={{ base: "100%", md: "auto" }}
          >
            Add Item
          </Button>

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
                        onClick={() => {
                          onOpen();
                          setActionType("edit");
                          setSelectedItemId(item._id);
                          setSelectedItemData(item);
                        }}
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
        <Box display={{ base: "block", lg: "none" }} mt="40px">
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
                {item.existing_barcode_no ? item.existing_barcode_no : "--"}
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
                      onOpen();
                    }}
                    mr={2}
                  />
                  {/* <IconButton
                    aria-label="View Item"
                    colorScheme="green"
                    size="md"
                    icon={<IoMdEye />}
                    onClick={() => {
                      setSelectedItemData(item._id);
                      isOpen();
                    }}
                    mr={2}
                  /> */}
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
                  />
                </Flex>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
      <ItemManagementModal
        isOpen={isOpen}
        onClose={handleOnClose}
        actionType={actionType}
        handleSubmit={actionType === "add" ? handleSubmit : handleUpdate}
        itemData={actionType === "edit" ? selectedItemData : null}
      />

      <canvas id="mycanvas" style={{ display: "none" }}></canvas>

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
        AnalyticsSelectedId={analyticsId}
      />
    </div>
  );
}
