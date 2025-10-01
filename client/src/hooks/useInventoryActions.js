import { useEffect, useRef, useState } from "react";
import bwipjs from "bwip-js";
import { useToast } from "../contexts/useToast";

import {
  addInventoryItem,
  deleteInventoryItem,
  updateInventoryItem,
  reduceInventoryItem,
  getAllInventoryItems,
  getSupplierContactsAPI,
} from "../api";
import { useModal } from "./useModal";

export function useInventoryActions() {
  const showToast = useToast();
  const dropdownRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [rowActionId, setRowActionId] = useState(null);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [supplierData, setSupplierData] = useState([]);
  const [isPermitted, setIsPermitted] = useState(true);
  const [barCodeData, setBarCodeData] = useState(null);
  const [analyticsId, setAnalyticsId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // State For All Type Modals
  const modals = {
    scannerModal: useModal(),
    itemAddEditModal: useModal(),
    itemUseModal: useModal(),
    barCodeModal: useModal(),
    analyticsModal: useModal(),
    actionModeModal: useModal(),
  };

  // Generate barCodeData for an item
  const handleGenerateBarCode = (item) => {
    try {
      const canvas = document.getElementById("mycanvas");

      if (!canvas) {
        console.error("Canvas element not found!");
        return;
      }

      bwipjs.toCanvas(canvas, {
        bcid: "code128",
        text: item.barCode,
        scale: 3,
        height: 10,
        includetext: true,
        textxalign: "center",
      });

      const dataUrl = canvas.toDataURL();
      setBarCodeData({
        item: item,
        url: dataUrl,
      });
      modals.barCodeModal.onOpen();
    } catch (e) {
      console.log("Error in generating barCodeData", e);
    }
  };

  const handleEditButton = (item) => {
    setSelectedItem(item);
    modals.itemAddEditModal.onOpen();
  };

  const handleOnItemModalClose = () => {
    modals.itemAddEditModal.onClose();
    setSelectedItem(null);
  };

  const handleAfterScanned = async (value) => {
    const item = inventoryItems?.find((item) => item.barCode === value);
    if (item) {
      setSelectedItem(item);
      showToast("Item already exists, you can edit or use it", "info");
      modals.actionModeModal.onOpen();
      return;
    }

    // Fetch from OpenFoodFacts API
    try {
      const res = await fetch(
        `https://world.openfoodfacts.org/api/v2/product/${value}.json`
      );
      const data = await res.json();
      if (data && data.product) {
        // Map OpenFoodFacts fields to your form fields
        const product = data.product;
        const newItem = {
          // itemName: "",
          // category: "",
          // itemUnit: "",
          // availableQuantity: "",
          // lowStockQuantity: "",
          // barCode: "",
          // expiryDate: "",
          // purchasePrice: "",
          // supplierName: "",
          // supplierContact: "",
          // notes: "",
          // storedLocation: "",
          barCode: value,
          itemName: product.product_name || "",
          // brand: product.brands || "",
          // quantity: product.serving_quantity_unit || "",
          // image: product.image_url || "",
          category: product.categories || "",
          // nutriscore: product.nutriscore_grade || "",
          // Add more mappings as needed
        };
        setSelectedItem(newItem);
        showToast("Product info fetched from OpenFoodFacts!", "success");
      } else {
        setSelectedItem({ barCode: value });
        showToast("No product info found, you can add manually.", "info");
      }
    } catch (err) {
      setSelectedItem({ barCode: value });
      showToast(`Error fetching product info, ${err.message}`, "error");
    }
    modals.itemAddEditModal.onOpen();
  };

  // Handle item submission
  const handleAddItem = async (formData) => {
    try {
      const res = await addInventoryItem(formData);
      // Updating List Of Items
      if (res.status === 201) {
        setInventoryItems((prevItems) => [...prevItems, res?.data?.result]);
        showToast(res?.data?.message, "success");
        handleOnItemModalClose();
      } else {
        showToast(res?.data?.message, "error");
      }
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  const handleUpdateItem = async (formData) => {
    try {
      const res = await updateInventoryItem(selectedItem?._id, formData);
      if (res.status === 200) {
        // Updating List Of Items
        setInventoryItems((prevItems) =>
          prevItems.map((item) =>
            item._id === selectedItem?._id ? res?.data?.result : item
          )
        );
        showToast(res?.data?.message, "success");
        handleOnItemModalClose();
      } else {
        showToast(res?.data?.message, "error");
      }
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  // Confirm item deletion
  const handleDeleteItem = async (id) => {
    try {
      const res = await deleteInventoryItem(id);
      if (res?.data?.success) {
        showToast(res?.data?.message, "success");
        setInventoryItems((prevItems) =>
          prevItems.filter((item) => item._id !== id)
        );
      } else {
        showToast(res?.data?.message || "Error deleting item", "error");
      }
    } catch (error) {
      showToast(error?.message || "Error deleting item", "error");
    }
  };

  const handleUseItem = async (formData) => {
    try {
      const itemId = formData?.itemId || selectedItem?._id;
      const res = await reduceInventoryItem(itemId, formData);
      if (res.status === 200) {
        setInventoryItems((prevItems) =>
          prevItems.map((item) =>
            item._id === itemId ? res?.data?.result : item
          )
        );
        showToast(res?.data?.message, "success");
        modals.itemUseModal.onClose();
      } else showToast(res?.data?.message, "error");
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  const fetchSupplierData = async () => {
    try {
      const res = await getSupplierContactsAPI();
      if (res.status === 200) {
        setSupplierData(res?.data?.result);
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const fetchInventoryItems = async () => {
    try {
      const res = await getAllInventoryItems();
      if (res.status === 200) {
        setInventoryItems(res?.data?.result);
      } else if (res.status === 403) {
        showToast(res.data.message, "error");
        setIsPermitted(false);
      }
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setTimeout(() => setRowActionId(null), 50);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Fetch Inventory and Supplier Details.
    fetchSupplierData();
    fetchInventoryItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    modals,
    loading,
    dropdownRef,
    rowActionId,
    setRowActionId,
    inventoryItems,
    isPermitted,
    barCodeData,
    analyticsId,
    setAnalyticsId,
    selectedItem,
    setSelectedItem,
    supplierData,
    handleAddItem,
    handleUpdateItem,
    handleUseItem,
    handleDeleteItem,
    handleEditButton,
    handleAfterScanned,
    handleGenerateBarCode,
    handleOnItemModalClose,
  };
}
