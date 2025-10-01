import PropTypes from "prop-types";
import PrimaryActionButton from "../../../../../components/UI/PrimaryActionButton";
import { formatToGermanCurrency } from "../../../../../utils/utils";
import { IoPencil, IoTrash } from "react-icons/io5";

const ItemMenuCard = ({ item, handleDeleteItem, handleEditItem }) => {
  return (
    <div
      key={item?._id}
      className="flex gap-2 bg-white rounded-xl shadow p-1 max-w-full md:max-w-md w-full"
    >
      {/* Image */}
      <img
        src={item?.pic || "https://placehold.co/80x80?text=No+Image"}
        alt={item?.itemName || "Item"}
        className="w-20 !h-20 object-cover rounded-lg flex-shrink-0"
      />

      {/* Title and Rating */}
      <div className="flex flex-col justify-between flex-1 p-1">
        <div className="flex justify-between">
          <h3
            className="text-sm md:text-base !font-medium text-gray-800 leading-tight break-words"
            title={item?.itemName}
          >
            {item?.itemName?.length > 20
              ? item?.itemName?.slice(0, 20) + "..."
              : item?.itemName || "Untitled Item"}
          </h3>
          <PrimaryActionButton
            className="rounded-lg h-6"
            bgColor="!bg-red-500 hover:!bg-red-600"
            onClick={handleDeleteItem}
          >
            <IoTrash />
          </PrimaryActionButton>
        </div>

        <div className="flex justify-between">
          <div className="px-2.5 py-1 bg-gray-200 rounded-lg text-center text-xs text-gray-700">
            {formatToGermanCurrency(item?.basePrice) || "0.00"}
          </div>
          <PrimaryActionButton
            className="rounded-lg h-6"
            onClick={handleEditItem}
          >
            <IoPencil />
          </PrimaryActionButton>
        </div>
      </div>
    </div>
  );
};

ItemMenuCard.propTypes = {
  item: PropTypes.object.isRequired,
  handleDeleteItem: PropTypes.func.isRequired,
  handleEditItem: PropTypes.func.isRequired,
};

export default ItemMenuCard;
