import PropTypes from "prop-types";
import {
  getDeliveryBoys,
  sendDeliveryOfferAPI,
} from "../../../../../api/index";
import { useEffect, useState } from "react";
import { FiCheckCircle, FiCircle } from "react-icons/fi";
import { CircleLoader } from "react-spinners";
import { useToast } from "../../../../../contexts/useToast";
import { Dialog_Boxes } from "../../../../../utils/constant";
import Modal from "../../../../../components/UI/Modal";
import PrimaryActionButton from "../../../../../components/UI/PrimaryActionButton";

export default function DeliveryAssignmentModal({
  isOpen,
  onClose,
  ref,
  onSubmit,
  orderId,
}) {
  const showToast = useToast();
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const isAllSelected = selectedIds.length === deliveryBoys.length;
  const canAllotSingle = selectedIds.length === 1;
  const canSendBulkOffer = selectedIds.length >= 2;

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedIds(isAllSelected ? [] : deliveryBoys.map((d) => d._id));
  };

  const handleSingleAllotment = () => {
    const delBoy = deliveryBoys?.find((boy) => boy._id === selectedIds[0]);
    console.log(delBoy);
    onSubmit(delBoy);
    // onClose();
  };

  const handleBulkDeliveryOffer = () => {
    sendDeliveryOfferAPI({ id: orderId, deliveryBoyIds: selectedIds }).then(
      () => {
        showToast("Delivery offer sent", "success");
      }
    );
    onClose();
  };

  useEffect(() => {
    const fetchDeliveryBoys = async () => {
      try {
        setIsLoading(true);
        const res = await getDeliveryBoys(orderId);
        setDeliveryBoys(res?.data?.result || []);
      } catch (err) {
        showToast(
          err?.response?.data?.error || "Failed to fetch delivery boys",
          "info"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchDeliveryBoys();
      setSelectedIds([]);
    }
  }, [isOpen, orderId, showToast]);

  return (
    <Modal
      modalRef={ref}
      isOpen={isOpen}
      onClose={onClose}
      title="Allot Delivery Boys"
      maxWidth="max-w-xs sm:max-w-md"
      showCloseIcon={true}
      innerClassName="px-6 py-4"
    >
      <div className="flex justify-start mb-2">
        <PrimaryActionButton
          onClick={handleSelectAll}
          className={` 
            ${
              isAllSelected
                ? "bg-green-100 border-green-500 text-green-700"
                : "bg-gray-50 border-gray-300 text-gray-700 hover:border-blue-400"
            }`}
          disabled={isLoading || !deliveryBoys.length}
        >
          {isAllSelected ? (
            <FiCheckCircle className="text-green-500" />
          ) : (
            <FiCircle className="text-gray-400" />
          )}
          Select All
        </PrimaryActionButton>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center my-12 gap-3">
          <CircleLoader size={40} color="#3b82f6" />
          <span className="text-gray-500 mt-2">Loading...</span>
        </div>
      ) : deliveryBoys.length ? (
        <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
          {deliveryBoys.map((d, idx) => (
            <div
              key={d._id}
              className={`flex items-center gap-4 ${
                idx % 2 == 0 ? "bg-[#f0f0fd]" : ""
              } p-2 `}
            >
              <button
                type="button"
                onClick={() => handleToggleSelect(d._id)}
                role="checkbox"
                aria-checked={selectedIds.includes(d._id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition font-medium
                  ${
                    selectedIds.includes(d._id)
                      ? "bg-green-100 border-green-500 text-green-700"
                      : "bg-gray-50 border-gray-300 text-gray-700 hover:border-blue-400"
                  }`}
              >
                {selectedIds.includes(d._id) ? (
                  <FiCheckCircle className="text-green-500" />
                ) : (
                  <FiCircle className="text-gray-400" />
                )}
                {d.name}
              </button>
              <span
                className={`text-sm ${
                  selectedIds.includes(d._id)
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              >
                Distance: {d?.distance?.toFixed(1)} KM
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center my-12">
          <span className="text-gray-400 text-center">
            No delivery boys are available at this moment
          </span>
        </div>
      )}

      {!isLoading && (
        <div className="flex justify-end gap-2 mt-12">
          <PrimaryActionButton
            onClick={onClose}
            disabled={isLoading}
            bgColor="!bg-red-500 text-white hover:!bg-red-600"
          >
            Cancel
          </PrimaryActionButton>

          <PrimaryActionButton
            bgColor={
              canAllotSingle
                ? "!bg-blue-500 text-white hover:!bg-blue-600"
                : "!bg-gray-300 text-gray-400"
            }
            disabled={!canAllotSingle}
            onClick={handleSingleAllotment}
          >
            Allot
          </PrimaryActionButton>

          {canSendBulkOffer && (
            <PrimaryActionButton
              className="!bg-teal-500 text-white hover:!bg-teal-600"
              onClick={() => {
                Dialog_Boxes.showCustomAlert(
                  "Send Delivery Offer",
                  "Are you sure you want to send delivery offer to all delivery boys?",
                  "center",
                  handleBulkDeliveryOffer
                );
              }}
            >
              Allot All
            </PrimaryActionButton>
          )}
        </div>
      )}
    </Modal>
  );
}

DeliveryAssignmentModal.propTypes = {
  ref: PropTypes.any,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  orderId: PropTypes.string,
};
