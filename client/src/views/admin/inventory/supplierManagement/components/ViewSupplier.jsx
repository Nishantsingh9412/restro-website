import PropTypes from "prop-types";
import { IoMail, IoLocation } from "react-icons/io5";
import { FaPhoneAlt } from "react-icons/fa";
import Modal from "../../../../../components/UI/Modal";

const ViewSupplier = ({ supplierData, isOpen, onClose, modalRef }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      modalRef={modalRef}
      maxWidth="max-w-xs sm:max-w-lg"
      innerClassName="px-6 py-4"
    >
      {/* Header */}
      <div className="w-full max-w-md mx-auto py-2 text-center">
        {/* Image */}
        <div className="flex justify-center">
          <div className="w-32  h-25 !border !border-gray-200 rounded-md overflow-hidden">
            <img
              className="w-full h-full !object-cover"
              src={supplierData?.pic || "https://via.placeholder.com/150"}
              alt={supplierData?.name || "Supplier"}
            />
          </div>
        </div>

        {/* Name */}
        <h2 className="mt-4 text-xl font-bold text-blue-600">
          {supplierData?.name || "Supplier"}
        </h2>

        {/* Role Tag */}
        <div className="mt-1 inline-block px-3 py-1 text-xs font-medium text-white bg-blue-500 rounded-full">
          Supplier
        </div>

        {/* Details */}
        <div className="mt-6 text-sm text-gray-700 text-left space-y-3">
          {supplierData?.updatedAt && (
            <div className="text-gray-500">
              <span className="font-medium">Last Updated:</span>{" "}
              {supplierData?.updatedAt?.split("T")[0]}
            </div>
          )}

          {supplierData?.email && (
            <div className="flex items-center">
              <IoMail className="text-blue-500 mr-2" size={18} />
              <span>{supplierData.email}</span>
            </div>
          )}

          {supplierData?.phone && (
            <div className="flex items-center">
              <FaPhoneAlt className="text-blue-500 mr-2" size={16} />
              <span>
                +{supplierData.countryCode} - {supplierData.phone}
              </span>
            </div>
          )}

          {supplierData?.location && (
            <div className="flex items-center">
              <IoLocation className="text-blue-500 mr-2" size={18} />
              <span>{supplierData.location}</span>
            </div>
          )}
        </div>

        {/* Items */}
        <div className="mt-6 text-left">
          <h3 className="text-md font-bold text-blue-600 mb-2">Items</h3>
          <div className="flex flex-wrap gap-2">
            {supplierData?.items?.length ? (
              supplierData.items.map((item, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1 bg-gray-100 rounded-md text-sm text-gray-700 !border !border-blue-300"
                >
                  {item}
                </div>
              ))
            ) : (
              <span className="text-gray-400 text-sm">No items listed.</span>
            )}
          </div>
        </div>
      </div>
      {/* Footer */}
      {/* <div className="flex justify-end pt-6">
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          onClick={onClose}
        >
          Close
        </button>
      </div> */}
    </Modal>
  );
};

ViewSupplier.propTypes = {
  supplierData: PropTypes.shape({
    pic: PropTypes.string,
    name: PropTypes.string,
    updatedAt: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    countryCode: PropTypes.string,
    location: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.string),
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  modalRef: PropTypes.any,
};

export default ViewSupplier;
