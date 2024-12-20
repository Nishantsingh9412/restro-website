import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
} from "@chakra-ui/react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

const BarcodeScanner = ({
  isOpen,
  onClose,
  handleAfterScanned,
  handleAfterManually,
}) => {
  const [scanResult, setScanResult] = useState("Not Found");
  const [isScanning, setIsScanning] = useState(true);

  // Handle modal close action
  const handleClose = () => {
    resetScanner();
    onClose();
  };

  // Reset scanner state
  const resetScanner = () => {
    setScanResult("Not Found");
    setIsScanning(true);
  };

  const handleManually = () => {
    handleClose();
    handleAfterManually();
  };

  // Handle scan result
  const handleResultScanned = (result) => {
    if (result) {
      console.log("Barcode scan result:", result);
      setScanResult(result.text);
      setIsScanning(false); // Stop scanning once a barcode is detected
      handleAfterScanned(result.text);
      handleClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Barcode Scanner</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isScanning ? (
            <BarcodeScannerComponent
              width={500}
              height={500}
              onUpdate={(err, result) => {
                if (err) {
                  console.error("Barcode scan error:", err);
                }
                if (result) {
                  handleResultScanned(result);
                }
              }}
            />
          ) : (
            <div>
              <Text>Scan Result: {scanResult}</Text>
              <Button colorScheme="blue" onClick={resetScanner}>
                Scan Again
              </Button>
            </div>
          )}
        </ModalBody>
        <Text
          mx={6}
          cursor="pointer"
          textDecoration="underline"
          textUnderlineOffset={2}
          color="teal.500"
          _hover={{ color: "teal.700" }}
          onClick={handleManually}
        >
          Add/Use Manually?
        </Text>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BarcodeScanner;
