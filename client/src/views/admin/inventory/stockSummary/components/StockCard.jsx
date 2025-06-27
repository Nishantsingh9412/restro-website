import PropTypes from "prop-types";
 
const StockSummaryCard = ({ item }) => {
  const percent = Math.min(
    (item.availableQuantity / item.lowStockQuantity) * 100,
    100
  );

  return (
    <div
      className={`!border px-2 py-3 rounded-xl w-full  ${
        percent < 30
          ? "!border-red-400"
          : percent < 70
          ? "!border-yellow-400"
          : "!border-green-400"
      }`}
    >
      <div className="flex gap-3 ">
        <img
          src={
            item?.image ||
            "https://www.foodiesfeed.com/wp-content/uploads/2023/05/juicy-cheeseburger.jpg"
          }
          alt={item?.itemName}
          className="w-16 h-16 rounded-xl border object-cover"
        />
        <div className="flex flex-col justify-between w-full my-[1px]">
          <h2 className="font-medium">{item?.itemName}</h2>
          <div className="bg-gray-300 rounded-md h-6 mt-1">
            <div
              className={`h-full rounded-md transition-all   ${
                percent < 30
                  ? "bg-red-500"
                  : percent < 70
                  ? "bg-yellow-500"
                  : "bg-green-600"
              } `}
              style={{ width: `${percent}%` }}
            ></div>
          </div>
        </div>
      </div>
      <div className="!border-t !border-gray-300 mt-3 pt-1">
        <p className="text-xs !mx-1 text-gray-600">
          {item?.availableQuantity}/{item?.lowStockQuantity} Total Quantity
        </p>
      </div>
    </div>
  );
};

StockSummaryCard.propTypes = {
  item: PropTypes.shape({
    itemName: PropTypes.string.isRequired,
    availableQuantity: PropTypes.number.isRequired,
    lowStockQuantity: PropTypes.number.isRequired,
    image: PropTypes.string,
  }).isRequired,
};

export default StockSummaryCard;
