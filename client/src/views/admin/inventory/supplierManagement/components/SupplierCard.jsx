import PropTypes from "prop-types";
import { RxDotsVertical } from "react-icons/rx";
import { IoArrowForward, IoPencil } from "react-icons/io5";
import PrimaryActionButton from "../../../../../components/UI/PrimaryActionButton";
import DropdownActionButton from "../../../../../components/UI/DropdownActionButton";
import { IoMdTrash } from "react-icons/io";
import { useModal } from "../../../../../hooks/useModal";

const SupplierCard = ({ supplier, onView, onEdit, onDelete }) => {
  const { isOpen, ref, onToggle } = useModal();
  const itemCount = supplier?.items?.length || 0;
  const visibleItems = supplier?.items?.slice(0, 4).join(", ");
  const extraCount = itemCount > 4 ? itemCount - 4 : 0;

  return (
    <div className="!border !border-gray-300 rounded-2xl p-2 sm:p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 my-2 w-full">
      {/* For Mobile Devices Only */}
      <div className="flex items-center justify-between !border-b border-gray-200 py-2 px-1 sm:hidden">
        {/* Avatar and Info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-full border overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
            <img
              src={
                supplier?.pic ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt="person"
              className="w-full h-full object-cover"
              style={{ minWidth: 0, minHeight: 0 }}
            />
          </div>
          <div className="flex flex-col min-w-0">
            <p className="font-semibold truncate">{supplier?.name}</p>
            <p className="text-xs text-gray-600 truncate">{supplier?.phone}</p>
          </div>
        </div>
        {/* Dots Icon */}
        <button
          onClick={onToggle}
          className="text-gray-500 hover:text-gray-700 flex-shrink-0"
          title="More Actions"
          type="button"
        >
          <RxDotsVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Avatar */}
      <div className="flex-shrink-0 hidden sm:block">
        <div className="w-12 h-12 rounded-full border overflow-hidden bg-gray-100 flex items-center justify-center">
          <img
            src={
              supplier?.pic ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            alt="person"
            className="w-full h-full object-cover"
            style={{ minWidth: 0, minHeight: 0 }}
          />
        </div>
      </div>
      {/* Supplier Info */}
      <div className="flex-1 text-sm   flex-col justify-between gap-1 hidden sm:flex">
        <p className="font-semibold truncate">{supplier?.name}</p>
        <p className="text-xs text-gray-600 truncate">{supplier?.phone}</p>
      </div>
      {/* Items */}
      <div className="flex-1 text-xs flex flex-col gap-1 min-w-[150px]">
        <p className="font-semibold text-slate-700 truncate">{visibleItems}</p>
        {extraCount > 0 && (
          <div className="rounded px-2 py-0.5 bg-gray-400 text-white text-[11px] w-fit">
            +{extraCount} more item{extraCount > 1 && "s"}
          </div>
        )}
      </div>
      {/* Action Button */}
      <div className="sm:w-auto w-full !border-t !border-gray-200 py-2">
        <PrimaryActionButton
          onClick={() => onView(supplier?._id)}
          className="w-full sm:w-auto text-sm flex justify-center items-center gap-1"
        >
          View Details <IoArrowForward />
        </PrimaryActionButton>
      </div>
      {/* Dots Menu Icon */}
      <button
        onClick={onToggle}
        className="text-gray-500 hover:text-gray-700 self-start sm:self-auto hidden sm:block"
        title="More Actions"
        type="button"
      >
        <RxDotsVertical className="w-5 h-5" />
      </button>
      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={ref}
          className={`absolute z-20 right-8 mt-10 sm:mt-15 sm:right-12 w-44 bg-white !border !border-gray-200 rounded-lg shadow-md p-2 flex flex-col`}
        >
          <DropdownActionButton
            onClick={() => onEdit(supplier?._id)}
            icon={<IoPencil className="w-4 h-4" />}
            className="!text-yellow-600"
          >
            Edit
          </DropdownActionButton>
          <DropdownActionButton
            onClick={() => onDelete(supplier?._id)}
            icon={<IoMdTrash className="w-4 h-4" />}
            className="!text-red-600"
          >
            Delete
          </DropdownActionButton>
        </div>
      )}
    </div>
  );
};

SupplierCard.propTypes = {
  supplier: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    pic: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  onView: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};

export default SupplierCard;
