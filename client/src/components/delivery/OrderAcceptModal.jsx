import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Box,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { hideDeliveryOffer } from "../../redux/action/Employees/deliveryBoy";
import { socket } from "../../api/socket";

const OrderAcceptModal = () => {
  const dispatch = useDispatch();
  const deliveryOfferState = useSelector(
    (state) => state.deliveryBoy?.deliveryOffer
  );
  const userData = useSelector((state) => state.userReducer.data);
  const { isOfferModalOpen, orderOfferDetails, supplierId } =
    deliveryOfferState;
  const { orderId, name, dropLocationName, noteFromCustomer } =
    orderOfferDetails;

  const [countdown, setCountdown] = useState(10);

  const onModalClose = () => {
    dispatch(hideDeliveryOffer());
  };

  const handleAccept = () => {
    // Handle accept logic here
    socket.emit("acceptOrder", {
      delEmpId: userData?._id,
      supplierId,
      orderId,
    });
    onModalClose();
  };

  const handleReject = () => {
    // Handle reject logic here
    onModalClose();
  };

  useEffect(() => {
    if (isOfferModalOpen) {
      setCountdown(10);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onModalClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOfferModalOpen]);

  return (
    <Modal isOpen={isOfferModalOpen} onClose={onModalClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delivery Order</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box mb={4}>
            <Text fontWeight="bold">
              Order ID:{" "}
              <Text as="span" fontWeight="normal">
                {orderId}
              </Text>
            </Text>
          </Box>
          <Box mb={4}>
            <Text fontWeight="bold">
              Customer Name:{" "}
              <Text as="span" fontWeight="normal">
                {name}
              </Text>
            </Text>
          </Box>
          <Box mb={4}>
            <Text fontWeight="bold">
              Drop Location:{" "}
              <Text as="span" fontWeight="normal">
                {dropLocationName}
              </Text>
            </Text>
          </Box>
          <Box mb={4}>
            <Text fontWeight="bold">
              Customer Note:{" "}
              <Text as="span" fontWeight="normal">
                {noteFromCustomer}
              </Text>
            </Text>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="green" mr={3} onClick={handleAccept}>
            Accept ({countdown}s)
          </Button>
          <Button colorScheme="red" onClick={handleReject}>
            Reject
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default OrderAcceptModal;
