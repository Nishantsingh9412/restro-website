// File: useOrderHistoryLogic.js
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "./useModal";
import { useToast } from "../contexts/useToast";
import { employeesRoles } from "../utils/constant";
import TakeAwayOrder from "../views/admin/order/orderHistory/components/TakeAwayOrder";
import DineInOrder from "../views/admin/order/orderHistory/components/DineInOrder";
import DeliveryOrders from "../views/admin/order/orderHistory/components/DeliveryOrders";
import {
  getDeliveryOrders,
  allotDeliveryBoy,
} from "../redux/action/deliveryOrder";
import {
  allotDineInOrderToWaiter,
  getDineInOrders,
} from "../redux/action/dineInOrder";
import {
  allotTakeAwayOrderToChef,
  getTakeAwayOrders,
} from "../redux/action/takeAwayOrder";

export const useOrderHistoryLogic = () => {
  const dispatch = useDispatch();
  const showToast = useToast();

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [endDate, setEndDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPermitted, setIsPermitted] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const fetchedTabs = useRef({ 0: false, 1: false, 2: false });

  const {
    isOpen: isDeliveryModalOpen,
    onClose: closeDeliveryModal,
    ref: deliveryModalRef,
    onOpen: openDeliveryModal,
  } = useModal();

  const {
    isOpen: isPersonnelModalOpen,
    onClose: closePersonnelModal,
    ref: personnelModalRef,
    onOpen: openPersonnelModal,
  } = useModal();

  const deliveryOrderData = useSelector((state) => state?.deliveryOrder?.data);
  const dineInOrderData = useSelector((state) => state?.dineInOrder?.order);
  const takeAwayOrderData = useSelector((state) => state?.takeAwayOrder?.order);

  const loadOrdersForTab = useCallback(
    async (tabIdx) => {
      setLoading(true);
      try {
        let res;
        if (tabIdx === 0) {
          res = await dispatch(getDeliveryOrders());
        } else if (tabIdx === 1) {
          res = await dispatch(getDineInOrders());
        } else if (tabIdx === 2) {
          res = await dispatch(getTakeAwayOrders());
        }
        if (res?.status === 403) setIsPermitted(false);
      } catch (err) {
        showToast(err.message, "error");
      } finally {
        setLoading(false);
      }
    },
    [dispatch, showToast]
  );

  useEffect(() => {
    if (!fetchedTabs.current[0]) {
      loadOrdersForTab(0);
      fetchedTabs.current[0] = true;
    }
  }, [loadOrdersForTab]);

  useEffect(() => {
    if (!fetchedTabs.current[activeTabIndex]) {
      loadOrdersForTab(activeTabIndex);
      fetchedTabs.current[activeTabIndex] = true;
    }
  }, [activeTabIndex, loadOrdersForTab]);

  const handleAllotOrder = useCallback(
    (orderId, role) => {
      setSelectedOrderId(orderId);
      setSelectedRole(role);
      if (role === employeesRoles.DELIVERY_BOY) {
        openDeliveryModal();
      } else {
        openPersonnelModal();
      }
    },
    [openDeliveryModal, openPersonnelModal]
  );

  const handlePersonnelSubmit = useCallback(
    (person) => {
      switch (person?.role) {
        case employeesRoles.WAITER:
          dispatch(
            allotDineInOrderToWaiter({
              orderId: selectedOrderId,
              waiter: person,
            }).then((res) => {
              showToast(res.message, res.success ? "success" : "error");
              closePersonnelModal();
            })
          );
          break;
        case employeesRoles.CHEF:
          dispatch(
            allotTakeAwayOrderToChef({
              orderId: selectedOrderId,
              chef: person,
            }).then((res) => {
              showToast(res.message, res.success ? "success" : "error");
              closePersonnelModal();
            })
          );
          break;
        default:
          console.warn(`Unhandled role: ${person?.role}`);
      }
    },
    [dispatch, selectedOrderId, closePersonnelModal, showToast]
  );

  const handleDeliverySubmit = (deliveryBoy) => {
    dispatch(
      allotDeliveryBoy({
        orderId: selectedOrderId,
        deliveryBoy,
      })
    )
      .then((res) => {
        showToast(res.message, res.success ? "success" : "error");
        closeDeliveryModal();
      })
      .catch((err) => {
        showToast(
          err?.response?.data?.error || "Failed to allot delivery boy",
          "error"
        );
      });
  };

  const filterOrders = (orders) => {
    if (!orders) return [];
    return orders.filter((order) => {
      const matchesSearchQuery =
        order?.customerName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        order?.address?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDateRange =
        (!startDate || new Date(order?.createdAt) >= startDate) &&
        (!endDate || new Date(order?.createdAt) <= endDate);
      return matchesSearchQuery && matchesDateRange;
    });
  };

  const getSelectedOrderType = () => {
    switch (activeTabIndex) {
      case 0:
        return {
          orderData: deliveryOrderData,
          tabKey: "delivery",
          component: DeliveryOrders,
        };
      case 1:
        return {
          orderData: dineInOrderData,
          tabKey: "dineIn",
          component: DineInOrder,
        };
      case 2:
        return {
          orderData: takeAwayOrderData,
          tabKey: "takeAway",
          component: TakeAwayOrder,
        };
      default:
        return {};
    }
  };

  return {
    loading,
    isPermitted,
    startDate,
    endDate,
    searchQuery,
    activeTabIndex,
    selectedOrderId,
    selectedRole,
    deliveryOrderData,
    dineInOrderData,
    takeAwayOrderData,
    isPersonnelModalOpen,
    personnelModalRef,
    openPersonnelModal,
    closePersonnelModal,
    isDeliveryModalOpen,
    deliveryModalRef,
    openDeliveryModal,
    closeDeliveryModal,
    setStartDate,
    setEndDate,
    setSearchQuery,
    setActiveTabIndex,
    handleAllotOrder,
    handlePersonnelSubmit,
    handleDeliverySubmit,
    filterOrders,
    getSelectedOrderType,
    showToast,
  };
};
