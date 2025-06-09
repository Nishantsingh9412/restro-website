/* eslint-disable react/prop-types */
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";

const ViewCode = ({ isOpen, onClose, barCodeData }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>{barCodeData?.item?.itemName}</ModalHeader>
      <ModalCloseButton />
      <ModalBody marginTop="10px">
        <img src={barCodeData?.url} alt="Barcode" />
      </ModalBody>
      <ModalFooter></ModalFooter>
    </ModalContent>
  </Modal>
);

export default ViewCode;
