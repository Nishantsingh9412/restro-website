import Modal from "../../../../../components/UI/Modal";
import PropTypes from "prop-types";
import { InfoRow } from "./OrderStatus";
import PrimaryActionButton from "../../../../../components/UI/PrimaryActionButton";
import {
  camelCaseToSentenceCase,
  formatToGermanCurrency,
} from "../../../../../utils/utils";

const calculatePerItemPrice = (orderItems) => {
  if (!orderItems || !Array.isArray(orderItems)) return [];
  return orderItems.map(({ selectedCustomizations }) =>
    selectedCustomizations?.reduce(
      (acc, curr) =>
        acc +
        curr.selectedOptions.reduce((sum, option) => sum + option.price, 0),
      0
    )
  );
};

const ItemInfo = ({
  _id,
  item,
  selectedCustomizations,
  quantity,
  perItemPrice,
  total,
}) => (
  <li key={_id} className="flex gap-2 p-2">
    <img
      src={item?.pic || "https://placehold.co/80x80?text=No+Image"}
      alt={item?.itemName || "Item"}
      className="!w-16 !h-16 object-cover rounded-lg flex-shrink-0"
    />
    <div className="flex flex-col justify-between flex-1">
      <h3
        className="text-base text-gray-800 truncate max-w-[160px]"
        title={item?.itemName}
      >
        {item?.itemName || "Untitled Item"}
      </h3>
      {selectedCustomizations?.length > 0 && (
        <div className="text-xs text-gray-500">
          (
          {selectedCustomizations
            .flatMap((c) => c.selectedOptions.map((option) => option.name))
            .join(", ")}
          )
        </div>
      )}
      <div className="flex justify-between items-center mt-1">
        <div className="flex items-center gap-2">
          <span className="px-1 py-0.5 bg-gray-200 rounded text-sm text-gray-700 font-medium">
            {quantity} X{" "}
            {formatToGermanCurrency(item?.basePrice + perItemPrice)}
          </span>
        </div>
        <span className="px-2 py-0.5 bg-blue-50 rounded text-sm text-blue-700 font-semibold">
          {formatToGermanCurrency(total)}
        </span>
      </div>
    </div>
  </li>
);

ItemInfo.propTypes = {
  _id: PropTypes.string,
  item: PropTypes.object,
  selectedCustomizations: PropTypes.array,
  quantity: PropTypes.number,
  perItemPrice: PropTypes.number,
  total: PropTypes.number,
};

const OrderDetailsModal = ({
  isOpen,
  onClose,
  ref,
  order,
  orderItems = [],
  grouped = false,
  metaInfo = [],
}) => {
  const perItemPrice = calculatePerItemPrice(
    grouped ? Object.values(orderItems).flat() : orderItems
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      modalRef={ref}
      title={`Order #${order.orderId}`}
      showCloseIcon={false}
      maxWidth="max-w-xs sm:max-w-md"
    >
      <div className="p-4">
        <div className="space-y-2 mb-4">
          {metaInfo.map(({ label, value }) => (
            <InfoRow key={label} label={label}>
              {value || "N/A"}
            </InfoRow>
          ))}
        </div>

        <div className="font-medium mt-6">Order Items:</div>
        <div className="max-h-54 overflow-y-auto">
          {!grouped ? (
            <ul>
              {orderItems?.map((item, index) => (
                <ItemInfo
                  key={item._id}
                  {...item}
                  perItemPrice={perItemPrice[index]}
                />
              ))}
            </ul>
          ) : (
            Object.entries(orderItems).map(([guestName, items]) => (
              <div key={guestName} className="mb-1">
                <h2 className="font-medium text-sm">
                  {camelCaseToSentenceCase(guestName)}:
                </h2>
                <ul>
                  {items.map((item, index) => (
                    <ItemInfo
                      key={item._id}
                      {...item}
                      perItemPrice={perItemPrice[index]}
                    />
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-center mt-4">
          <PrimaryActionButton onClick={onClose}>Close</PrimaryActionButton>
        </div>
      </div>
    </Modal>
  );
};

OrderDetailsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  ref: PropTypes.any,
  order: PropTypes.object.isRequired,
  orderItems: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  grouped: PropTypes.bool,
  metaInfo: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.any,
    })
  ).isRequired,
};

export default OrderDetailsModal;
