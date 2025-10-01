import { MdRestaurant } from "react-icons/md";
import PropTypes from "prop-types";
import { formatToGermanCurrency } from "../../../../../utils/utils";
import { InfoRow, OrderStatus } from "./OrderStatus";
import PrimaryActionButton from "../../../../../components/UI/PrimaryActionButton";
import { IoEye } from "react-icons/io5";
import OrderDetailsModal from "./OrderDetailsModal";
import { useModal } from "../../../../../hooks/useModal";
import { employeesRoles } from "../../../../../utils/constant";

// import { IoEye } from "react-icons/io5";

const DineInOrder = ({ orderData, handleAllotOrder }) => {
  const { isOpen, onOpen, onClose, ref } = useModal();

  const {
    _id,
    orderId,
    totalPrice,
    completedAt,
    customerName,
    assignedWaiter,
    numberOfGuests,
    guests,
    orderItems,
  } = orderData;

  // Group items by guest
  const categorizedOrderItems = orderItems?.reduce((acc, item) => {
    const guestName = item.guestName || "";
    if (!acc[guestName]) acc[guestName] = [];
    acc[guestName].push(item);
    return acc;
  }, {});

  return (
    <>
      <div
        key={_id}
        className={`!border ${
          completedAt ? "!border-green-500" : "!border-blue-500"
        } rounded-lg overflow-hidden p-5 bg-white shadow-md transition-transform duration-200 hover:scale-[1.02]`}
      >
        <OrderStatus
          completedAt={completedAt}
          assignedWaiter={assignedWaiter}
          orderId={orderId}
          onAllot={() => handleAllotOrder(employeesRoles.WAITER)}
          icon={<MdRestaurant />}
        />
        <div className="!border-b mb-2" />
        <div className="space-y-2 mb-4">
          <InfoRow label="Customer">{customerName || "N/A"}</InfoRow>
          <InfoRow label="Guests">{numberOfGuests || "N/A"}</InfoRow>
          <InfoRow label="Total">
            {formatToGermanCurrency(totalPrice) || "N/A"}
          </InfoRow>
        </div>
        <PrimaryActionButton
          onClick={onOpen}
          className="w-full flex justify-center"
        >
          View Full Details
          <IoEye />
        </PrimaryActionButton>
      </div>
      {/* Modal for Full Details */}
      {isOpen && (
        <OrderDetailsModal
          isOpen={isOpen}
          onClose={onClose}
          ref={ref}
          order={orderData}
          orderItems={categorizedOrderItems}
          grouped={true}
          metaInfo={[
            { label: "Customer", value: customerName },
            { label: "Number of Guests", value: numberOfGuests },
            {
              label: "Guests List",
              value: guests?.map((g) => g.name).join(", "),
            },
            {
              label: "Total Price",
              value: formatToGermanCurrency(totalPrice),
            },
          ]}
        />
      )}
    </>
  );
};

DineInOrder.propTypes = {
  orderData: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    completedAt: PropTypes.string,
    assignedWaiter: PropTypes.shape({
      name: PropTypes.string,
    }),
    orderId: PropTypes.string.isRequired,
    customerName: PropTypes.string,
    numberOfGuests: PropTypes.number,
    specialRequests: PropTypes.string,
    paymentMethod: PropTypes.string,
    totalPrice: PropTypes.number.isRequired,
    tableNumber: PropTypes.number,
    guests: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      })
    ),
    orderItems: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        total: PropTypes.number.isRequired,
        item: PropTypes.shape({
          itemName: PropTypes.string.isRequired,
        }),
        selectedCustomizations: PropTypes.arrayOf(
          PropTypes.shape({
            selectedOptions: PropTypes.arrayOf(
              PropTypes.shape({
                name: PropTypes.string.isRequired,
              })
            ),
          })
        ),
        guestName: PropTypes.string,
      })
    ),
  }).isRequired,
  handleAllotOrder: PropTypes.func.isRequired,
};

export default DineInOrder;
