import { FaEllipsisV } from "react-icons/fa";
import PropTypes from "prop-types";
import BarCodePrinter from "./BarCodePrinter";
import { formatDateForUI } from "../../../../../utils/utils";
import DropdownActionButton from "../../../../../components/UI/DropdownActionButton";
import { IoMdAnalytics, IoMdTrash } from "react-icons/io";
import { MdBarcodeReader } from "react-icons/md";
import { Dialog_Boxes } from "../../../../../utils/constant";
import { IoPencil } from "react-icons/io5";

export default function InventoryDetailCard({
  item,
  index,
  isOpen,
  dropdownRef,
  setRowActionId,
  handleEditButton,
  handleDeleteItem,
  handleGenerateBarCode,
  analyticsModal,
  setSelectedItem,
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 w-full relative my-4">
      {/* Top Row */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="!font-semibold text-primary">{item?.itemName}</h2>
        <FaEllipsisV
          className="text-gray-500"
          onClick={() =>
            setRowActionId((prevId) => (prevId === index ? null : index))
          }
        />
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className={`absolute z-20 right-5 top-10 w-54 bg-white !border !border-gray-200 rounded-lg shadow-md p-2 flex flex-col`}
        >
          <DropdownActionButton
            onClick={() => handleEditButton(item)}
            icon={<IoPencil className="w-4 h-4" />}
            className="!text-yellow-600"
          >
            Edit
          </DropdownActionButton>
          <DropdownActionButton
            onClick={() =>
              Dialog_Boxes.showDeleteConfirmation(() =>
                handleDeleteItem(item._id)
              )
            }
            icon={<IoMdTrash className="w-4 h-4" />}
            className="!text-red-600"
          >
            Delete
          </DropdownActionButton>
          <DropdownActionButton
            onClick={() => handleGenerateBarCode(item)}
            icon={<MdBarcodeReader className="w-4 h-4" />}
            className="!text-blue-600"
          >
            Generate BarCode
          </DropdownActionButton>
          <DropdownActionButton
            onClick={() => {
              analyticsModal.onOpen();
              setSelectedItem(item);
            }}
            icon={<IoMdAnalytics className="w-4 h-4" />}
            className="!text-teal-600"
          >
            View Analytics
          </DropdownActionButton>
        </div>
      )}

      <div className="flex flex-wrap items-start justify-between">
        {/* Image */}
        <img
          src="https://www.foodiesfeed.com/wp-content/uploads/2023/05/juicy-cheeseburger.jpg"
          alt="Onion"
          className="w-22 h-22``` rounded-xl border object-cover"
        />

        {/* Circular Progress */}
        <div className="flex gap-6">
          <CircleProgress
            value={Math.min(
              (item.availableQuantity / item.lowStockQuantity) * 100,
              100
            )}
            isLow={item.availableQuantity > item.lowStockQuantity}
            label={`Available:${
              item?.availableQuantity != null && item.itemUnit
                ? `${item.availableQuantity}/${item?.lowStockQuantity} ${
                    item.itemUnit === "Piece" ? "pcs" : item.itemUnit
                  }`
                : "-"
            }`}
          />
        </div>
      </div>

      {/* Details Section */}
      <div className="grid grid-cols-2 mt-6 text-sm gap-y-1">
        <p className="text-gray-500 col-span-2">
          Last Replenished:{" "}
          <span className="text-black font-medium">
            {formatDateForUI(item?.updatedAt)}
          </span>
        </p>
        <p className="col-span-2 text-gray-500">
          Expiry Date:{" "}
          <span className="text-gray-800 font-medium">
            {formatDateForUI(item?.expiryDate)}
          </span>
        </p>
        <p className="text-black col-span-2 mt-1 font-medium">
          BARCODE: <span className=" ">{item?.barCode || "--"}</span>
        </p>
      </div>

      {/* Print Button */}
      <div className="absolute bottom-4 right-4 bg-white !border-2 !border-primary !px-1.5 !pt-1 rounded-lg  transition">
        <BarCodePrinter barCodeValue={item?.barCode} />
      </div>
    </div>
  );
}

InventoryDetailCard.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  isOpen: PropTypes.bool.isRequired,
  dropdownRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  handleEditButton: PropTypes.func.isRequired,
  setRowActionId: PropTypes.func.isRequired,
  handleDeleteItem: PropTypes.func.isRequired,
  handleGenerateBarCode: PropTypes.func.isRequired,
  analyticsModal: PropTypes.shape({
    onOpen: PropTypes.func.isRequired,
  }).isRequired,
  setSelectedItem: PropTypes.func.isRequired,
};

const CircleProgress = ({ value, isLow, label }) => {
  const circumference = 2 * Math.PI * 30;
  const offset = circumference * (1 - value / 100);

  return (
    <div className="flex flex-col items-center gap-1">
      <svg
        width="66"
        height="66"
        viewBox="0 0 72 72"
        className="rotate-[-90deg]"
      >
        <circle
          cx="36"
          cy="36"
          r="30"
          stroke="#cfeeff"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx="36"
          cy="36"
          r="30"
          stroke={isLow ? "green" : "red"}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          fill="none"
          strokeLinecap="round"
        />
        <text
          x="38"
          y="-30"
          textAnchor="middle"
          className="fill-gray-700 text-md font-semibold rotate-90 "
        >
          {value}%
        </text>
      </svg>
      <p
        className={`text-sm font-medium ${
          isLow ? "text-primary" : "text-red-500"
        }`}
      >
        {label}
      </p>
    </div>
  );
};

CircleProgress.propTypes = {
  value: PropTypes.number.isRequired,
  isLow: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
};
