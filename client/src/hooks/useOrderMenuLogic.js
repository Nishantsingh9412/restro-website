// hooks/useOrderMenuLogic.js
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../contexts/useToast";
import { addToCart } from "../redux/action/cartItems";
import { getAllOrderItemsAction } from "../redux/action/OrderItems";
import { guestTypes, orderMethods, orderTypes } from "../utils/constant";
import { useModal } from "./useModal";

export const useOrderMenuLogic = () => {
  const dispatch = useDispatch();
  const showToast = useToast();

  const itemModal = useModal();
  const checkoutModal = useModal();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [allItemsData, setAllItemsData] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);

  const { orderMethod } = useSelector((state) => state.customerInfo.dineIn);
  const { currentGuest, orderType } = useSelector((state) => state.cart);

  const handleAddToCart = useCallback(
    (item) => {
      if (
        orderType === orderTypes.DINE_IN &&
        orderMethod === orderMethods.INDIVIDUAL &&
        currentGuest === guestTypes.GUEST
      ) {
        showToast("Please select a guest to add items to the cart", "info");
        return;
      }
      if (item) {
        dispatch(addToCart(item));
      }
    },
    [dispatch, showToast, orderMethod, orderType, currentGuest]
  );

  const handleShowItem = useCallback((item) => {
    if (item) {
      setSelectedItem(item);
      itemModal.onOpen();
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    itemModal.onClose();
    setSelectedItem(null);
  }, []);

  const groupByCategory = (data) => {
    return data.reduce((acc, item) => {
      const category = item.category || "Uncategorized";
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {});
  };

  const filteredMenu = Object.entries(allItemsData)
    .filter(
      ([category]) => filter === "all" || category.toLowerCase() === filter
    )
    // eslint-disable-next-line no-unused-vars
    .flatMap(([_, items]) =>
      items.filter((item) =>
        item.itemName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const allItemsRes = await dispatch(getAllOrderItemsAction());
        if (!allItemsRes.success) {
          showToast(allItemsRes.message, "error");
        } else {
          setAllItemsData(groupByCategory(allItemsRes.data));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        showToast("Failed to fetch data", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch, showToast]);

  return {
    loading,
    itemModal,
    checkoutModal,
    allItemsData,
    selectedItem,
    searchTerm,
    filter,
    filteredMenu,
    orderMethod,
    orderType,
    handleAddToCart,
    handleShowItem,
    handleCloseModal,
    setSearchTerm,
    setFilter,
  };
};
