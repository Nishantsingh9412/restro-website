import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Flex,
  Icon,
  Box,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
const ThankYouModal = ({ isOpen, onClose, onBack }) => {
  const [timer, setTimer] = useState(5);
  const navigate = useNavigate();

  // Unified close handler to ensure `onBack` is called
  const handleClose = () => {
    onClose(); // Close the modal
    onBack(); // Navigate back to orders
    navigate(0); // Reload the page
  };

  useEffect(() => {
    if (isOpen) {
      setTimer(5); // Reset timer when modal opens
      const countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            handleClose(); // Call the unified close handler
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdown); // Cleanup interval on unmount
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent borderRadius="lg" boxShadow="lg" p={6}>
        <ModalHeader>
          <Flex align="center" justify="center" direction="column" gap={4}>
            <Icon as={FaCheckCircle} boxSize={16} color="green.500" />
            <Text fontSize="2xl" fontWeight="bold" color="green.500">
              Thank You!
            </Text>
          </Flex>
        </ModalHeader>
        <ModalBody>
          <Box textAlign="center">
            <Text fontSize="lg" color="gray.600">
              Your order has been placed successfully.
            </Text>
            <Text fontSize="sm" color="gray.500" mt={2}>
              Redirecting in{" "}
              <Text as="span" fontWeight="bold">
                {timer}
              </Text>{" "}
              seconds...
            </Text>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            onClick={handleClose}
            width="full"
            size="lg"
            _hover={{ bg: "blue.600" }}
          >
            Back to Create Orders
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

ThankYouModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default ThankYouModal;
