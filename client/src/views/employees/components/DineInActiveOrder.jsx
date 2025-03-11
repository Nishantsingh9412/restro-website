import { Box, Heading, Text, List, ListItem, Button } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { statuses } from "../../../utils/constant";
import { allotDineInOrderToChefAction } from "../../../redux/action/dineInOrder";
import { useDispatch } from "react-redux";
import AllotOrderModal from "../../admin/orderHistory/components/AllotOrderModal";
import { useState } from "react";

const DineInActiveOrder = ({
  activeOrder,
  handleCancel,
  handleUpdateStatus,
}) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const orderId = activeOrder?.orderId;

  const handleAllotOrderToChef = (data) => {
    dispatch(allotDineInOrderToChefAction({ orderId: orderId, chef: data }))
      .then(() => {
        handleUpdateStatus(orderId, statuses.ASSIGNED_TO_CHEF);
      })
      .catch((error) => {
        console.error("Failed to allot order to chef:", error);
      });
  };

  const handleStatusChange = () => {
    const statusOrder = [
      "Assigned",
      "Accepted",
      "Assigned To Chef",
      "Accepted By Chef",
      "Preparing",
      "Completed",
    ];
    const currentIndex = statusOrder.indexOf(activeOrder?.currentStatus);
    if (currentIndex < statusOrder.length - 1) {
      const newStatus = statusOrder[currentIndex + 1];
      if (newStatus === statuses.ASSIGNED_TO_CHEF) {
        setIsModalOpen(true);
        console.log("Allot to chef");
        return; // Wait until the modal is open
      }
      handleUpdateStatus(orderId, newStatus);
    }
  };

  return (
    <>
      <AllotOrderModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onSubmit={handleAllotOrderToChef}
        personnelType="Chef"
      />
      <Box p={5} shadow="md" borderWidth="1px" borderRadius="md" mt={4}>
        <Heading fontSize="xl">Active Order</Heading>
        <Text mt={4}>
          <strong>Order ID:</strong> {orderId}
        </Text>
        <Text>
          <strong>Table Number:</strong> {activeOrder?.tableNumber || "N/A"}
        </Text>
        <Text>
          <strong>No Of Guest:</strong> {activeOrder?.numberOfGuests || "N/A"}
        </Text>
        <Text>
          <strong>Status:</strong> {activeOrder?.currentStatus}
        </Text>
        <Text mt={4}>
          <strong>Order Items:</strong>
        </Text>
        <List mt={1} ml={2}>
          {activeOrder.orderItems?.map((order, index) => (
            <ListItem key={index}>
              {order.item?.orderName} - {order.quantity}
            </ListItem>
          ))}
        </List>
        <Box mt={4} display="flex" justifyContent="center" gap={5}>
          <Button
            colorScheme="teal"
            onClick={handleStatusChange}
            isDisabled={
              activeOrder?.currentStatus === statuses.COMPLETED ||
              activeOrder?.currentStatus === statuses.ASSIGNED_TO_CHEF
            }
          >
            {activeOrder?.currentStatus === statuses.COMPLETED
              ? "Order Completed"
              : "Update Status"}
          </Button>
          <Button colorScheme="red" onClick={() => handleCancel(orderId)}>
            Cancel Order
          </Button>
        </Box>
      </Box>
    </>
  );
};

DineInActiveOrder.propTypes = {
  activeOrder: PropTypes.shape({
    orderId: PropTypes.number.isRequired,
    tableNumber: PropTypes.number.isRequired,
    numberOfGuests: PropTypes.number.isRequired,
    currentStatus: PropTypes.string.isRequired,
    orderItems: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleUpdateStatus: PropTypes.func.isRequired,
};

export default DineInActiveOrder;
