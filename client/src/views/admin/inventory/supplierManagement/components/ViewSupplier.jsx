import { IoMail, IoLocation } from "react-icons/io5";
import { FaPhoneAlt } from "react-icons/fa";
import {
  Box,
  Text,
  Flex,
  Image,
  Modal,
  Button,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
} from "@chakra-ui/react";
import PropTypes from "prop-types";

const ViewSupplier = ({ supplierData, isOpen, onClose }) => (
  <Modal isCentered isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent maxW="lg" borderRadius="lg" boxShadow="xl">
      <ModalHeader>
        <Flex align="center">
          <Image
            borderRadius="full"
            boxSize="50px"
            src={supplierData?.pic}
            alt={supplierData?.name || "Supplier"}
            fallbackSrc="https://via.placeholder.com/150"
            mr={3}
          />
          <Text fontSize="lg" fontWeight="bold" color="blue.600">
            {supplierData?.name || "Supplier"}
          </Text>
        </Flex>
      </ModalHeader>
      <ModalCloseButton />

      <ModalBody>
        <Text fontSize="sm" color="gray.500" mb={2}>
          Last Updated: {supplierData?.updatedAt?.split("T")[0] || "--"}
        </Text>
        {supplierData?.email && (
          <Flex align="center" mt={2} fontSize="sm" color="gray.700">
            <IoMail size={18} />
            <Text ml={2}>{supplierData.email}</Text>
          </Flex>
        )}
        {supplierData?.phone && (
          <Flex align="center" mt={2} fontSize="sm" color="gray.700">
            <FaPhoneAlt size={16} />
            <Text ml={2}>
              +{supplierData.countryCode} - {supplierData.phone}
            </Text>
          </Flex>
        )}
        {supplierData?.location && (
          <Flex align="center" mt={2} fontSize="sm" color="gray.700">
            <IoLocation size={18} />
            <Text ml={2}>{supplierData.location}</Text>
          </Flex>
        )}

        <Text fontSize="md" fontWeight="bold" mt={5} color="blue.600">
          Items
        </Text>
        <Flex wrap="wrap" mt={2}>
          {supplierData?.items?.length ? (
            supplierData.items.map((item, idx) => (
              <Box
                key={idx}
                m={1}
                px={3}
                py={1}
                bg="gray.50"
                borderRadius="md"
                fontSize="sm"
                color="gray.700"
                border="1px solid"
                borderColor="gray.200"
              >
                {item}
              </Box>
            ))
          ) : (
            <Text color="gray.400" fontSize="sm" ml={1}>
              No items listed.
            </Text>
          )}
        </Flex>
      </ModalBody>

      <ModalFooter>
        <Button colorScheme="blue" onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);
ViewSupplier.propTypes = {
  supplierData: PropTypes.shape({
    pic: PropTypes.string,
    name: PropTypes.string,
    updatedAt: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    countryCode: PropTypes.string,
    location: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.string),
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ViewSupplier;
