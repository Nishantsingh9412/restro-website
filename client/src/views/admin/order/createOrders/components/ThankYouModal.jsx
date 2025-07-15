import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const ThankYouModal = ({ isOpen, onClose, onBack }) => {
  const [timer, setTimer] = useState(5);
  const navigate = useNavigate();

  // Unified close handler to ensure `onBack` is called
  const handleClose = () => {
    onClose(); // Close the modal
    onBack(); // Navigate back to orders
    navigate(0); // Reload the page
  };

  useEffect(() => {
    if (isOpen) {
      setTimer(5); // Reset timer when modal opens
      const countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            handleClose(); // Call the unified close handler
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdown); // Cleanup interval on unmount
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto p-8 relative">
        {/* Icon and Heading */}
        <div className="flex flex-col items-center gap-4 mb-4">
          <FaCheckCircle className="text-green-500" size={64} />
          <div className="text-2xl font-bold text-green-500">Thank You!</div>
        </div>
        {/* Body */}
        <div className="text-center mb-6">
          <div className="text-lg text-gray-600 mb-2">
            Your order has been placed successfully.
          </div>
          <div className="text-sm text-gray-500 mt-2">
            Redirecting in <span className="font-bold">{timer}</span> seconds...
          </div>
        </div>
        {/* Footer */}
        <button
          className="w-full py-3 rounded-lg bg-blue-500 text-white font-semibold text-lg hover:bg-blue-600 transition"
          onClick={handleClose}
        >
          Back to Create Orders
        </button>
      </div>
    </div>
  );
};

ThankYouModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default ThankYouModal;
