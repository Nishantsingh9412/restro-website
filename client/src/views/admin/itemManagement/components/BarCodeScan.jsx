import { useState } from "react";
import {
  Text,
  Modal,
  Button,
  ModalBody,
  ModalHeader,
  ModalFooter,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

const BarcodeScanner = ({
  isOpen,
  onClose,
  onScanned,
  // handleAfterManually,
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

  // const handleManually = () => {
  //   handleClose();
  //   handleAfterManually();
  // };

  // Handle scan result
  const handleResultScanned = (result) => {
    if (result) {
      setScanResult(result.text);
      setIsScanning(false); // Stop scanning once a barcode is detected
      onScanned(result.text);
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
        {/* <Text
          mx={6}
          cursor="pointer"
          textDecoration="underline"
          textUnderlineOffset={2}
          color="teal.500"
          _hover={{ color: "teal.700" }}
          onClick={handleManually}
        >
          Add/Use Manually?
        </Text> */}
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
BarcodeScanner.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onScanned: PropTypes.func.isRequired,
  handleAfterManually: PropTypes.func.isRequired,
};

export default BarcodeScanner;
