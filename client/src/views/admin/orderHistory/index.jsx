import { forwardRef } from "react";
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
  Input,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../../contexts/useToast.jsx";
import { getDeliveryOrderAction } from "../../../redux/action/deliveryOrder.js";
import { allotDeliveryBoyAction } from "../../../redux/action/deliveryOrder.js";
import { employeesRoles } from "../../../utils/constant.js";
import {
  allotDineInOrderToWaiterAction,
  getDineInOrderAction,
} from "../../../redux/action/dineInOrder.js";
import {
  allotTakeAwayOrderToChefAction,
  getTakeAwayOrderAction,
} from "../../../redux/action/takeAwayOrder.js";
import ForbiddenPage from "../../../components/forbiddenPage/ForbiddenPage.jsx";
import AllotPersonnelModal from "./components/AllotOrderModal.jsx";
import AllotDeliveryModal from "./components/AllotDeliveryModal.jsx";
import DineInOrder from "./components/DineInOrder.jsx";
import TakeAwayOrder from "./components/TakeAwayOrder.jsx";
import DeliveryOrders from "./components/DeliveryOrders.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const OrderHistory = () => {
  const dispatch = useDispatch();
  const showToast = useToast();
  const [isPermitted, setIsPermitted] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [selectedPersonnel, setSelectedPersonnel] = useState("");
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const deliveryOrderData = useSelector((state) => state?.deliveryOrder?.data);
  const dineInOrderData = useSelector((state) => state?.dineInOrder?.order);
  const takeAwayOrderData = useSelector((state) => state?.takeAwayOrder?.order);

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

  // Filter orders based on search query and date range
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
          <Flex alignItems={"center"} justifyContent={"space-between"} mb="4">
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
            <Flex alignItems="center">
              <DatePicker
                selected={startDate}
                onChange={(date) => {
                  if (endDate && date > endDate) {
                    setEndDate(null); // Reset endDate if it becomes invalid
                  }
                  setStartDate(date);
                }}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText="Start Date"
                isClearable
                dateFormat="dd/MM/yyyy"
                customInput={<ChakraDateInput />}
              />
              <Text mx="2" fontWeight={"medium"}>
                TO
              </Text>
              <DatePicker
                selected={endDate}
                onChange={(date) => {
                  if (!date) setEndDate(null);
                  else if (startDate && date < startDate) {
                    showToast(
                      "End date cannot be earlier than start date",
                      "error"
                    );
                    return;
                  }
                  setEndDate(date);
                }}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                placeholderText="End Date"
                isClearable
                dateFormat="dd/MM/yyyy"
                customInput={<ChakraDateInput />}
              />

              <Input
                ml={4}
                placeholder="Search by customer name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                backgroundColor={"white"}
                width={["100%", "100%", "50%"]}
              />
            </Flex>
          </Flex>
          <TabPanels>
            <TabPanel>
              <Box maxW="1200px" mx="auto" p="4">
                <Heading as="h1" size="xl" mb="6" textAlign="center">
                  <b>Delivery Orders</b>
                </Heading>
                {filterOrders(deliveryOrderData)?.length ? (
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {filterOrders(deliveryOrderData).map((order) => (
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
                {filterOrders(dineInOrderData)?.length ? (
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {filterOrders(dineInOrderData).map((order) => (
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
                {filterOrders(takeAwayOrderData)?.length ? (
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {filterOrders(takeAwayOrderData).map((order) => (
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

import PropTypes from "prop-types";
const ChakraDateInput = forwardRef(({ value, onClick, placeholder }, ref) => (
  <Input
    onClick={onClick}
    ref={ref}
    value={value}
    readOnly
    placeholder={placeholder}
    padding="1rem"
    borderRadius="md"
    border="1px solid"
    borderColor="gray.200"
    _hover={{ borderColor: "gray.400" }}
    _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px blue.400" }}
    cursor="pointer"
    background="white"
  />
));

ChakraDateInput.displayName = "ChakraDateInput";

ChakraDateInput.propTypes = {
  value: PropTypes.string,
  onClick: PropTypes.func,
  placeholder: PropTypes.string,
};

export default OrderHistory;
