import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { hideDeliveryOffer } from "../../redux/action/Employees/deliveryBoy";
import { socket } from "../../api/socket";

const OrderAcceptModal = () => {
  const dispatch = useDispatch();
  const deliveryOfferState = useSelector(
    (state) => state.deliveryBoy?.deliveryOffer
  );
  const [countdown, setCountdown] = useState(10);
  const userData = useSelector((state) => state.userReducer.data);
  const {
    isOfferModalOpen,
    orderOfferDetails = {},
    supplierId,
  } = deliveryOfferState || {};
  const { orderId, name, dropLocationName, noteFromCustomer } =
    orderOfferDetails || {};

  useEffect(() => {
    if (!isOfferModalOpen) return;
    setCountdown(10);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          handleReject();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line
  }, [isOfferModalOpen]);

  const handleAccept = () => {
    if (!orderId) return;
    socket.emit("acceptDeliveryOrder", {
      orderId,
      supplierId,
      deliveryBoyId: userData?._id,
    });
    dispatch(hideDeliveryOffer());
  };

  const handleReject = () => {
    dispatch(hideDeliveryOffer());
  };

  const onModalClose = () => {
    dispatch(hideDeliveryOffer());
  };

  if (!isOfferModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto relative">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl font-bold focus:outline-none"
          onClick={onModalClose}
          aria-label="Close"
          type="button"
        >
          &times;
        </button>
        {/* Modal Header */}
        <div className="text-xl font-semibold text-center py-4 border-b">
          Delivery Order
        </div>
        {/* Modal Body */}
        <div className="p-6">
          <div className="mb-4">
            <span className="font-bold">Order ID: </span>
            <span className="font-normal">{orderId}</span>
          </div>
          <div className="mb-4">
            <span className="font-bold">Customer Name: </span>
            <span className="font-normal">{name}</span>
          </div>
          <div className="mb-4">
            <span className="font-bold">Drop Location: </span>
            <span className="font-normal">{dropLocationName}</span>
          </div>
          <div className="mb-4">
            <span className="font-bold">Customer Note: </span>
            <span className="font-normal">{noteFromCustomer}</span>
          </div>
        </div>
        {/* Modal Footer */}
        <div className="flex justify-end gap-3 px-6 pb-6">
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md font-semibold transition"
            onClick={handleAccept}
            type="button"
          >
            Accept ({countdown}s)
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md font-semibold transition"
            onClick={handleReject}
            type="button"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderAcceptModal;
