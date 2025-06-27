import { useRef, useEffect } from "react";
import bwipjs from "bwip-js";
import printJS from "print-js";
import PropTypes from "prop-types";
import { FiPrinter } from "react-icons/fi";

const BarCodePrinter = ({ barCodeValue }) => {
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
      <button
        aria-label="Generate Barcode"
        type="button"
        className={`inline-flex items-center justify-start`}
        onClick={handlePrint}
      >
        <FiPrinter className="w-4 h-4 text-gray-700" />
      </button>
    </>
  );
};
BarCodePrinter.propTypes = {
  barCodeValue: PropTypes.string.isRequired,
};

export default BarCodePrinter;
