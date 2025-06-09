import { useRef, useEffect } from "react";
import bwipjs from "bwip-js";
import printJS from "print-js";
import { MdLocalPrintshop } from "react-icons/md";
import { IconButton } from "@chakra-ui/react";
import PropTypes from "prop-types";

const BarCodePrinter = ({ barCodeValue, isMobile = false }) => {
  const barcodeCanvasRef = useRef(null);

  // Generate the barcode using bwip-js when the barCodeValue changes
  useEffect(() => {
    if (barcodeCanvasRef.current && barCodeValue) {
      try {
        // Generate barcode and render it on canvas
        bwipjs.toCanvas(barcodeCanvasRef.current, {
          bcid: "code128", // Barcode type (Code128)
          text: barCodeValue, // Barcode value to encode
          scale: 3, // Scale factor for better resolution
          height: 10, // Height of barcode
          includetext: true, // Include human-readable text
          textxalign: "center", // Center the text below the barcode
        });
      } catch (error) {
        console.error("Error generating barcode:", error);
      }
    }
  }, [barCodeValue]);

  // Print the barcode canvas using print-js
  const handlePrint = () => {
    if (barcodeCanvasRef.current) {
      const barcodeDataUrl = barcodeCanvasRef.current.toDataURL("image/png");
      printJS({
        printable: barcodeDataUrl,
        type: "image",
        style: `
          @page { margin: 0; }
          body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
          img { max-width: 100%; max-height: 100%; width: auto; height: auto; }
        `,
      });
    }
  };

  return (
    <>
      {/* Hidden canvas where the barcode will be rendered */}
      <canvas ref={barcodeCanvasRef} style={{ display: "none" }}></canvas>
      {/* Button to trigger the print functionality */}
      <IconButton
        aria-label="Generate Barcode"
        colorScheme="pink"
        size={isMobile ? "md" : "sm"}
        marginRight="4px"
        icon={<MdLocalPrintshop />}
        onClick={handlePrint}
      />
    </>
  );
};
BarCodePrinter.propTypes = {
  barCodeValue: PropTypes.string.isRequired,
  isMobile: PropTypes.bool,
};

export default BarCodePrinter;
