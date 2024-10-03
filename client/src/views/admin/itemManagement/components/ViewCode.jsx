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

const ViewCode = ({ isOpen, onClose, barCodeData, barcodeDataUrl }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>{barCodeData.item_name}</ModalHeader>
      <ModalCloseButton />
      <ModalBody marginTop="10px">
        <img src={barcodeDataUrl} alt="Barcode" />
        {/* <p>{barCodeData}</p> */}
      </ModalBody>
      <ModalFooter></ModalFooter>
    </ModalContent>
  </Modal>
);

export default ViewCode;
