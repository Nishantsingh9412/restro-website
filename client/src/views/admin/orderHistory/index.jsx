/* eslint-disable no-unused-vars */
import {
  Badge,
  Box,
  Divider,
  Flex,
  Heading,
  IconButton,
  ListItem,
  SimpleGrid,
  Spinner,
  Stack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { useCallback, useEffect, useMemo } from "react";
import { MdLocalShipping } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { getCompleteOrderAction } from "../../../redux/action/completeOrder.js";
// import { singleUserDataAction } from "../../../redux/action/user.js";
import { useState } from "react";
import ForbiddenPage from "../../../components/forbiddenPage/ForbiddenPage.jsx";
import { useToast } from "../../../contexts/ToastContext.jsx";
import { allotDeliveryBoyAction } from "../../../redux/action/completeOrder.js";
import { getDineInOrderAction } from "../../../redux/action/dineInOrder.js";
import { getTakeAwayOrderAction } from "../../../redux/action/takeAwayOrder.js";
import AllotDeliveryBoyModal from "./components/AllotDeliveryModal.jsx";
import DineInOrder from "./components/DineInOrder.jsx";
import TakeAwayOrder from "./components/TakeAwayOrder.jsx";
import DeliveryOrders from "./components/DeliveryOrders.jsx";

const OrderHistory = () => {
  const dispatch = useDispatch();
  const showToast = useToast();
  const user = useSelector((state) => state?.userReducer?.user);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState("");

  const compOrderData = useSelector((state) => state?.compOrder?.data);
  const dineInOrderData = useSelector((state) => state?.dineInOrder?.order);
  const takeAwayOrderData = useSelector((state) => state?.takeAwayOrder?.order);

  const [isPermitted, setIsPermitted] = useState(true);
  const [loading, setLoading] = useState(true);

  const localUserData = useMemo(
    () => JSON.parse(localStorage.getItem("ProfileData")),
    []
  );
  const localUserId = localUserData?.result?._id;

  const fetchCompleteOrders = useCallback(() => {
    dispatch(getDineInOrderAction())
      .then((res) => {
        if (!res?.success) {
          showToast(res?.message, "error");
          if (res.status === 403) setIsPermitted(false);
        }
      })
      .finally(() => {
        setLoading(false);
      });
    dispatch(getCompleteOrderAction())
      .then((res) => {
        if (!res?.success) {
          showToast(res?.message, "error");
          if (res.status === 403) setIsPermitted(false);
        }
      })
      .finally(() => {
        setLoading(false);
      });
    dispatch(getTakeAwayOrderAction()).then((res) => {
      if (!res?.success) {
        showToast(res?.message, "error");
        if (res.status === 403) setIsPermitted(false);
      }
    });
  }, [dispatch, showToast]);

  useEffect(() => {
    fetchCompleteOrders();
    // dispatch(singleUserDataAction(localUserId));
  }, [fetchCompleteOrders]);

  const handleAllotDeliveryBoy = useCallback((orderId) => {
    // console.log("Allot Delivery Boy Pending .........");
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  }, []);

  const handleModalSubmit = useCallback(
    (data) => {
      dispatch(
        allotDeliveryBoyAction({
          orderId: selectedOrderId,
          deliveryBoy: data,
        })
      );
    },
    [dispatch, selectedOrderId]
  );

  if (!isPermitted) return <ForbiddenPage isPermitted={isPermitted} />;

  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.500" />
      </Flex>
    );
  }

  return (
    <>
      <AllotDeliveryBoyModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onSubmit={handleModalSubmit}
        personnelType={"Waiter"}
      />
      <Box mt="8" px="4">
        <Tabs variant="soft-rounded" colorScheme="blue">
          <TabList>
            <Tab>Delivery</Tab>
            <Tab>Dine-In</Tab>
            <Tab>TakeAway</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Box maxW="1200px" mx="auto" p="4">
                <Heading as="h1" size="xl" mb="6" textAlign="center">
                  Delivery Orders
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {compOrderData?.map((order) => (
                    <DeliveryOrders
                      key={order._id}
                      orderData={order}
                      handleAllotDeliveryBoy={handleAllotDeliveryBoy}
                    />
                  ))}
                </SimpleGrid>
              </Box>
            </TabPanel>
            <TabPanel>
              <Box maxW="1200px" mx="auto" p="4">
                <Heading as="h2" size="lg" mb="6" textAlign="center">
                  Dine-In Orders
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {dineInOrderData?.map((order) => (
                    <DineInOrder key={order._id} orderData={order} />
                  ))}
                </SimpleGrid>
              </Box>
            </TabPanel>
            <TabPanel>
              <Box maxW="1200px" mx="auto" p="4">
                <Heading as="h2" size="lg" mb="6" textAlign="center">
                  Takeaway Orders
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {takeAwayOrderData?.map((order) => (
                    <TakeAwayOrder key={order._id} orderData={order} />
                  ))}
                </SimpleGrid>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </>
  );
};

export default OrderHistory;
