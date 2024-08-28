// import React, { useState } from 'react';
// import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';
// import BarcodeScannerComponent from 'react-qr-barcode-scanner';

// const BarCodeScan = ({
//     isOpen,
//     onClose,
//     // handleScanResult,
//     // scanResult,
// }) => {

//     const [isScanning, setIsScanning] = useState(false);
//     const [scanResult, setScanResult] = useState(null);

//     const handleScanClick = () => {
//         setIsScanning(true);
//         console.log('Scanning...');
//     };

//     const handleScanResult = (err, result) => {
//         if (result) {
//             setScanResult(result.text);
//             console.log('Scan result:', result.text);
//         }
//         if (err) {
//             console.error(err);
//         }
//     };

//     const handleUpdate = (err, result) => {
//         if (isScanning) {
//             handleScanResult(err, result);
//             // Keep scanning for continuous results
//         }
//     };

//     return (
//         <div>
//             <Modal isOpen={isOpen} onClose={onClose}>
//                 <ModalOverlay />
//                 <ModalContent>
//                     <ModalHeader>Barcode Scanner</ModalHeader>
//                     <ModalCloseButton />
//                     <ModalBody>
//                         <BarcodeScannerComponent
//                             width={500}
//                             height={500}
//                             onUpdate={handleUpdate}
//                         />
//                         {scanResult && (
//                             <div>
//                                 <p>Scan Result: {scanResult}</p>
//                             </div>
//                         )}
//                     </ModalBody>
//                     <ModalFooter>
//                         <Button colorScheme="blue" mr={3} onClick={handleScanClick}>
//                             Scan
//                         </Button>
//                         <Button colorScheme="blue" mr={3} onClick={onClose}>
//                             Close
//                         </Button>
//                     </ModalFooter>
//                 </ModalContent>
//             </Modal>
//         </div>
//     );
// };

// export default BarCodeScan;

import React, { useState } from 'react';
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton
} from '@chakra-ui/react';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';

const BarcodeScanner = ({ isOpen, onClose }) => {
    const [scanResult, setScanResult] = useState("Not Found");
    const [isScanning, setIsScanning] = useState(true);

    const handleClose = () => {
        setScanResult("Not Found");
        setIsScanning(true);
        onClose();
    };

    const handleScanAgain = () => {
        setScanResult("Not Found");
        setIsScanning(true);
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
                                    console.log("Barcode scan result:", result);
                                    setScanResult(result.text);
                                    setIsScanning(false); // Stop scanning once a barcode is detected
                                }
                            }}
                        />
                    ) : (
                        <div>
                            <p>Scan Result: {scanResult}</p>
                            <Button colorScheme="blue" onClick={handleScanAgain}>Scan Again</Button>
                        </div>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" onClick={handleClose}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default BarcodeScanner;