/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { IoMail, IoLocation } from "react-icons/io5";
import { FaPhoneAlt } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
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
  Flex,
  Box,
  Image,
} from "@chakra-ui/react";
import {
  clearSelectedSupplierAction,
  getSingleSupplierAction,
} from "../../../../redux/action/supplier.js";

const ViewSupplier = ({ selectedId, isOpen, onClose }) => {
  const dispatch = useDispatch();

  // Fetch supplier data when modal opens or selectedId changes
  useEffect(() => {
    if (isOpen && selectedId) {
      dispatch(getSingleSupplierAction(selectedId));
    }
  }, [dispatch, selectedId, isOpen]);

  const selectedSupplier = useSelector(
    (state) => state.supplierReducer.seletectedSupplier
  );

  // Clear supplier data when modal closes
  const handleClose = () => {
    onClose();
    dispatch(clearSelectedSupplierAction());
  };

  return (
    <Modal isCentered isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent
        maxW="45rem"
        background="#FFFFFF"
        color="#ee7213"
        borderRadius="lg"
        boxShadow="xl"
      >
        {/* Modal Header: Supplier Image and Name */}
        <ModalHeader>
          <Flex align="center">
            <Image
              borderRadius="full"
              boxSize="50px"
              src={selectedSupplier?.pic}
              alt={selectedSupplier?.name || "Supplier Image"}
              fallbackSrc="https://via.placeholder.com/150"
              mr={3}
            />
            <Text fontSize="lg" fontWeight="bold" color={"blue"}>
              {selectedSupplier?.name}
            </Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />

        {/* Modal Body: Supplier Details */}
        <ModalBody>
          {/* Last Updated Date */}
          <Text fontSize="sm" color="gray.600">
            Last Updated: {selectedSupplier?.updatedAt?.split("T")[0]}
          </Text>

          {/* Contact Information: Email, Phone, Location */}
          {selectedSupplier?.email && (
            <Flex align="center" mt={3} fontSize="sm" color={"black"}>
              <IoMail size="20" /> <Text ml={2}>{selectedSupplier?.email}</Text>
            </Flex>
          )}
          {selectedSupplier?.phone && (
            <Flex align="center" mt={3} fontSize="sm" color={"black"}>
              <FaPhoneAlt size="18" />{" "}
              <Text ml={2}>
                +{selectedSupplier?.countryCode} - {selectedSupplier?.phone}
              </Text>
            </Flex>
          )}
          {selectedSupplier?.location && (
            <Flex align="center" mt={3} fontSize="sm" color={"black"}>
              <IoLocation size="20" />{" "}
              <Text ml={2}>{selectedSupplier?.location}</Text>
            </Flex>
          )}

          {/* Supplier Items */}
          <Text fontSize="lg" fontWeight="bold" mt={6} color={"blue"}>
            Items
          </Text>
          <Flex wrap="wrap" mt={2}>
            {selectedSupplier?.items?.map((item, index) => (
              <Box
                key={index}
                m={1}
                px={3}
                py={1}
                bg="white"
                border="1px solid #ddd"
                borderRadius="md"
                fontSize="sm"
                color="gray.700"
                boxShadow="sm"
              >
                {item}
              </Box>
            ))}
          </Flex>
        </ModalBody>

        {/* Modal Footer */}
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ViewSupplier;
