import { useState } from "react";
import PropTypes from "prop-types";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import Modal from "../../../../../components/UI/Modal";

const BarcodeScanner = ({ isOpen, onClose, onScanned, modalRef }) => {
  const [scanResult, setScanResult] = useState("Not Found");
  const [isScanning, setIsScanning] = useState(true);

  const handleClose = () => {
    resetScanner();
    onClose();
  };

  const resetScanner = () => {
    setScanResult("Not Found");
    setIsScanning(true);
  };

  const handleResultScanned = (result) => {
    if (result) {
      setScanResult(result.text);
      setIsScanning(false);
      onScanned(result.text);
      handleClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Barcode Scanner"
      modalRef={modalRef}
      innerClassName="py-2"
      maxWidth="max-w-sm md:max-w-md"
    >
      {isScanning ? (
        <div className="flex justify-center items-center">
          <div className="w-full aspect-[5/1] overflow-hidden px-0.5">
            <BarcodeScannerComponent
              width={"100%"}
              height={"100%"}
              onUpdate={(err, result) => {
                if (err) console.error("Barcode scan error:", err);
                if (result) handleResultScanned(result);
              }}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <span className="text-base font-medium text-gray-700">
            Scan Result:{" "}
            <span className="font-semibold text-primary">{scanResult}</span>
          </span>
          <button
            className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition"
            onClick={resetScanner}
          >
            Scan Again
          </button>
        </div>
      )}
    </Modal>
  );
};

BarcodeScanner.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onScanned: PropTypes.func.isRequired,
  modalRef: PropTypes.any,
};

export default BarcodeScanner;
