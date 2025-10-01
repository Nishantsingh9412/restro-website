import PropTypes from "prop-types";
import {
  MdDeliveryDining,
  MdOutlineDinnerDining,
  MdTakeoutDining,
} from "react-icons/md";
import { orderTypes } from "../../../../../utils/constant";

const OrderTypeCard = ({ type, setSelectedOrderType, isSelected }) => {
  const getDescriptionAndIcon = (type) => {
    switch (type) {
      case orderTypes.DINE_IN:
        return {
          description: "Enjoy your meal at our place",
          icon: MdOutlineDinnerDining,
        };
      case orderTypes.TAKE_AWAY:
        return {
          description: "Take your meal with you",
          icon: MdTakeoutDining,
        };
      case orderTypes.DELIVERY:
        return {
          description: "Get your meal delivered",
          icon: MdDeliveryDining,
        };
      default:
        return {
          description: "",
          icon: null,
        };
    }
  };

  const { description, icon: Icon } = getDescriptionAndIcon(type);

  return (
    <div
      key={type}
      className={`
        w-[230px] h-[280px] flex flex-col justify-around items-start px-6 py-7 rounded-xl shadow-md
        cursor-pointer transition-all duration-300
        ${
          isSelected
            ? "bg-primary !border-2 !border-primary text-white"
            : "bg-transparent !border !border-yellow-400 text-gray-600"
        }
        hover:scale-105 hover:shadow-lg text-xl
      `}
      onClick={() => setSelectedOrderType(type)}
    >
      <div className="font-bold  ">
        {type[0]?.toUpperCase() + type.slice(1)}
      </div>
      {Icon && <Icon className="w-14 h-14 text-yellow-400 mx-auto" />}
      <p className={`${isSelected ? "text-white" : "text-gray-500"}`}>
        {description}
      </p>
    </div>
  );
};

OrderTypeCard.propTypes = {
  type: PropTypes.string.isRequired,
  setSelectedOrderType: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
};

export default OrderTypeCard;
