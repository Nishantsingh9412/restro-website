import { formatToGermanCurrency } from "../../../../../utils/utils";
import PropTypes from "prop-types";
import PrimaryActionButton from "../../../../../components/UI/PrimaryActionButton";
import { FaMinus, FaPlus } from "react-icons/fa";
import { FaX } from "react-icons/fa6";

const CartItem = ({ item, onUpdate, onRemove }) => {
  return (
    <div className="relative mb-5">
      <button
        className="absolute !bg-red-500 rounded-2xl !p-0.5 !text-white !text-xs top-0.5 left-0.5"
        onClick={() => onRemove(item.cartItemId)}
      >
        <FaX />
      </button>
      <div
        key={item?.cartItemId}
        className="flex gap-2 bg-white rounded-xl not-first: p-1 max-w-full md:max-w-md w-full"
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
              bgColor="!bg-green-500 hover:!bg-green-600"
              onClick={() => onUpdate(item.cartItemId, 1)}
            >
              <FaPlus />
            </PrimaryActionButton>
          </div>

          <div className="flex justify-between">
            <div className="px-2 py-1 bg-gray-200 rounded-lg text-center text-sm text-gray-500">
              {item?.totalQuantity} <span className="text-red-500 mx-1">X</span>{" "}
              {formatToGermanCurrency(item?.price)}
            </div>
            <div className="px-2 py-1 bg-gray-200 rounded-lg text-center text-sm text-gray-500">
              {formatToGermanCurrency(item?.totalPrice)}
            </div>
            <PrimaryActionButton
              bgColor="!bg-red-500 hover:!bg-red-600"
              onClick={() => onUpdate(item.cartItemId, -1)}
            >
              <FaMinus />
            </PrimaryActionButton>
          </div>
        </div>
      </div>
    </div>
  );
};
CartItem.propTypes = {
  item: PropTypes.shape({
    pic: PropTypes.string,
    itemName: PropTypes.string,
    totalQuantity: PropTypes.number,
    price: PropTypes.number,
    cartItemId: PropTypes.string,
    selectedCustomizations: PropTypes.arrayOf(
      PropTypes.shape({
        selectedOptions: PropTypes.arrayOf(
          PropTypes.shape({
            name: PropTypes.string,
          })
        ),
      })
    ),
    totalPrice: PropTypes.number,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default CartItem;
