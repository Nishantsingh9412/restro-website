/* eslint-disable no-unused-vars */
import {
  Box,
  Flex,
  Heading,
  SimpleGrid,
  Spinner,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
} from "@chakra-ui/react";
import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDeliveryOrderAction } from "../../../redux/action/deliveryOrder.js";
import { useState } from "react";
import ForbiddenPage from "../../../components/forbiddenPage/ForbiddenPage.jsx";
import { useToast } from "../../../contexts/useToast.jsx";
import { allotDeliveryBoyAction } from "../../../redux/action/deliveryOrder.js";
import {
  allotDineInOrderToWaiterAction,
  getDineInOrderAction,
} from "../../../redux/action/dineInOrder.js";
import {
  allotTakeAwayOrderToChefAction,
  getTakeAwayOrderAction,
} from "../../../redux/action/takeAwayOrder.js";
import AllotPersonnelModal from "./components/AllotOrderModal.jsx";
import AllotDeliveryModal from "./components/AllotDeliveryModal.jsx";
import DineInOrder from "./components/DineInOrder.jsx";
import TakeAwayOrder from "./components/TakeAwayOrder.jsx";
import DeliveryOrders from "./components/DeliveryOrders.jsx";
import { set } from "date-fns";
import { employeesRoles } from "../../../utils/constant.js";

const OrderHistory = () => {
  const dispatch = useDispatch();
  const showToast = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [selectedPersonnel, setSelectedPersonnel] = useState("");

  const compOrderData = useSelector((state) => state?.compOrder?.data);
  const dineInOrderData = useSelector((state) => state?.dineInOrder?.order);
  const takeAwayOrderData = useSelector((state) => state?.takeAwayOrder?.order);

  const [isPermitted, setIsPermitted] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchCompleteOrders = useCallback(async () => {
    try {
      const [dineInRes, deliveryRes, takeAwayRes] = await Promise.all([
        dispatch(getDineInOrderAction()),
        dispatch(getDeliveryOrderAction()),
        dispatch(getTakeAwayOrderAction()),
      ]);

      [dineInRes, deliveryRes, takeAwayRes].forEach((res) => {
        if (res?.status === 403) {
          setIsPermitted(false);
        }
      });
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [dispatch, showToast]);

  useEffect(() => {
    fetchCompleteOrders();
  }, [fetchCompleteOrders]);

  const handleAllotOrder = useCallback((orderId, personnelType) => {
    setSelectedOrderId(orderId);
    setSelectedPersonnel(personnelType);
    if (personnelType.includes(employeesRoles.DELIVERY_BOY)) {
      setIsDeliveryModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  }, []);

  const handleModalSubmit = useCallback(
    (data) => {
      switch (data?.role) {
        case employeesRoles.WAITER:
          dispatch(
            allotDineInOrderToWaiterAction({
              orderId: selectedOrderId,
              waiter: data,
            })
          );
          break;
        case employeesRoles.CHEF:
          dispatch(
            allotTakeAwayOrderToChefAction({
              orderId: selectedOrderId,
              chef: data,
            })
          );
          break;
        default:
          console.warn(`Unhandled role: ${data?.role}`);
      }
    },
    [dispatch, selectedOrderId]
  );

  const handleDeliveryBoyModalSubmit = (data) => {
    data.map((delBoy) => {
      dispatch(
        allotDeliveryBoyAction({
          orderId: selectedOrderId,
          deliveryBoy: delBoy,
        })
      ).then((res) => {
        showToast(res.message, res.success ? "success" : "error");
      });
    });
  };

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
      <AllotPersonnelModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onSubmit={handleModalSubmit}
        personnelType={selectedPersonnel}
      />
      <AllotDeliveryModal
        isOpen={isDeliveryModalOpen}
        setIsOpen={setIsDeliveryModalOpen}
        onSubmit={handleDeliveryBoyModalSubmit}
        orderId={selectedOrderId}
      />
      <Box mt="8" px="4">
        <Tabs variant="soft-rounded" colorScheme="blue">
          <TabList>
            <Tab>
              <b>Delivery</b>
            </Tab>
            <Tab>
              <b>Dine-In</b>
            </Tab>
            <Tab>
              <b>TakeAway</b>
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Box maxW="1200px" mx="auto" p="4">
                <Heading as="h1" size="xl" mb="6" textAlign="center">
                  <b>Delivery Orders</b>
                </Heading>
                {compOrderData?.length ? (
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {compOrderData.map((order) => (
                      <DeliveryOrders
                        key={order._id}
                        orderData={order}
                        handleAllotDeliveryBoy={() =>
                          handleAllotOrder(
                            order?.orderId,
                            employeesRoles.DELIVERY_BOY
                          )
                        }
                      />
                    ))}
                  </SimpleGrid>
                ) : (
                  <Text textAlign="center" mt="4">
                    <b>No Delivery Orders</b>
                  </Text>
                )}
              </Box>
            </TabPanel>
            <TabPanel>
              <Box maxW="1200px" mx="auto" p="4">
                <Heading as="h2" size="lg" mb="6" textAlign="center">
                  <b>Dine-In Orders</b>
                </Heading>
                {dineInOrderData?.length ? (
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {dineInOrderData.map((order) => (
                      <DineInOrder
                        key={order._id}
                        orderData={order}
                        handleAllotWaiter={() =>
                          handleAllotOrder(
                            order?.orderId,
                            employeesRoles.WAITER
                          )
                        }
                      />
                    ))}
                  </SimpleGrid>
                ) : (
                  <Text textAlign="center" mt="4">
                    <b>No Dine-In Orders</b>
                  </Text>
                )}
              </Box>
            </TabPanel>
            <TabPanel>
              <Box maxW="1200px" mx="auto" p="4">
                <Heading as="h2" size="lg" mb="6" textAlign="center">
                  <b>Takeaway Orders</b>
                </Heading>
                {takeAwayOrderData?.length ? (
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {takeAwayOrderData.map((order) => (
                      <TakeAwayOrder
                        key={order._id}
                        orderData={order}
                        handleAllotChef={() =>
                          handleAllotOrder(order?.orderId, employeesRoles.CHEF)
                        }
                      />
                    ))}
                  </SimpleGrid>
                ) : (
                  <Text textAlign="center" mt="10">
                    <b>No Takeaway Orders</b>
                  </Text>
                )}
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </>
  );
};

export default OrderHistory;
