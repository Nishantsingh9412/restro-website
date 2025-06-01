import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Flex,
} from "@chakra-ui/react";
import PropTypes from "prop-types";

export default function ActionModeModal({
  isOpen,
  onClose,
  selectedItemId,
  onAddUpdate,
  onUseItem,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select Action</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex justifyContent="space-around">
            <Button colorScheme="teal" onClick={onAddUpdate}>
              {!selectedItemId ? "Add Item" : "Update Item"}
            </Button>
            <Button colorScheme="blue" onClick={onUseItem}>
              Use Item
            </Button>
          </Flex>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}

ActionModeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedItemId: PropTypes.string,
  onAddUpdate: PropTypes.func.isRequired,
  onUseItem: PropTypes.func.isRequired,
};
