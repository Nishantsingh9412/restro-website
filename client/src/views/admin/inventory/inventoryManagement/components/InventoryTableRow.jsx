import { BiDotsVertical } from "react-icons/bi";
import { IoPencil } from "react-icons/io5";
import { IoMdTrash, IoMdAnalytics } from "react-icons/io";
import { MdBarcodeReader } from "react-icons/md";
import BarCodePrinter from "../components/BarCodePrinter";
import DropdownActionButton from "../../../../../components/UI/DropdownActionButton";
import { Dialog_Boxes } from "../../../../../utils/constant";
import PropTypes from "prop-types";

export default function InventoryTableRow({
  item,
  index,
  isOpen,
  setRowActionId,
  dropdownRef,
  handleEditButton,
  handleDeleteItem,
  handleGenerateBarCode,
  analyticsModal,
  setSelectedItem,
  rowLength,
}) {
  return (
    <div
      className={`grid grid-cols-7  xl:gap-2 items-center text-center py-3 ${
        index % 2 === 0 ? "bg-[#f0f0fd]" : "bg-white"
      } !border-b border-gray-100 font-medium text-slate-700 text-sm`}
    >
      <div className="truncate">
        {item.itemName && item.itemName.length > 18
          ? `${item.itemName.substring(0, 18)}...`
          : item.itemName || "-"}
      </div>
      {/* <div>{item.itemUnit || "-"}</div> */}
      <div>
        {item.availableQuantity != null && item.itemUnit
          ? `${item.availableQuantity} ${
              item.itemUnit === "Piece" ? "pcs" : item.itemUnit
            }`
          : "-"}
      </div>
      <div>
        {item.lowStockQuantity != null && item.itemUnit
          ? `${item.lowStockQuantity} ${
              item.itemUnit === "Piece" ? "pcs" : item.itemUnit
            }`
          : "-"}
      </div>
      <div
        className={
          "flex justify-center-safe items-center font-mono gap-1 xl:gap-2 "
        }
      >
        <div className="font-medium">{item?.barCode || "--"}</div>
        <BarCodePrinter barCodeValue={item?.barCode} />
      </div>
      <div className="font-normal text-slate-600">
        {item.updatedAt
          ? new Date(item.updatedAt).toLocaleDateString("en-GB")
          : "--"}
      </div>
      <div className="font-normal text-slate-600">
        {item.expiryDate
          ? new Date(item.expiryDate).toLocaleDateString("en-GB")
          : "--"}
      </div>
      <div className="flex items-center justify-center gap-2">
        <div className="relative">
          <button
            className="p-2 rounded hover:bg-gray-200 border border-gray-300 flex items-center gap-1"
            onClick={() =>
              setRowActionId((prevId) => (prevId === index ? null : index))
            }
            title="Actions"
            type="button"
          >
            <BiDotsVertical className="w-5 h-5 text-gray-500" />
          </button>
          {isOpen && (
            <div
              ref={dropdownRef}
              className={`absolute z-20 right-5 ${
                rowLength > 2 && rowLength - index > 2 ? "top-2" : "bottom-2"
              } w-44 bg-white !border !border-gray-200 rounded-lg shadow-md p-2 flex flex-col`}
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
        </div>
      </div>
    </div>
  );
}

InventoryTableRow.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  isOpen: PropTypes.bool.isRequired,
  setRowActionId: PropTypes.func.isRequired,
  dropdownRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  handleEditButton: PropTypes.func.isRequired,
  handleDeleteItem: PropTypes.func.isRequired,
  handleGenerateBarCode: PropTypes.func.isRequired,
  analyticsModal: PropTypes.shape({
    onOpen: PropTypes.func.isRequired,
  }).isRequired,
  setSelectedItem: PropTypes.func.isRequired,
  rowLength: PropTypes.number.isRequired,
};
