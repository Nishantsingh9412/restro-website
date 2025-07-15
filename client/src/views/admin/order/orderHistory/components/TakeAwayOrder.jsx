import PropTypes from "prop-types";
import { IoEye } from "react-icons/io5";
import { MdRestaurant } from "react-icons/md";
import OrderDetailsModal from "./OrderDetailsModal";
import { InfoRow, OrderStatus } from "./OrderStatus";
import { useModal } from "../../../../../hooks/useModal";
import { formatToGermanCurrency } from "../../../../../utils/utils";
import PrimaryActionButton from "../../../../../components/UI/PrimaryActionButton";
import { employeesRoles } from "../../../../../utils/constant";

const TakeAwayOrder = ({ orderData, handleAllotOrder }) => {
  const { isOpen, onOpen, onClose, ref } = useModal();
  const {
    _id,
    orderId,
    customerName,
    orderItems,
    totalPrice,
    assignedChef,
    completedAt,
  } = orderData;

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
          assignedChef={assignedChef}
          orderId={orderId}
          onAllot={() => handleAllotOrder(employeesRoles.CHEF)}
          icon={<MdRestaurant />}
        />
        <div className="!border-b mb-2" />
        <div className="space-y-2 mb-4">
          <InfoRow label="Customer">{customerName || "N/A"}</InfoRow>
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
          ref={ref}
          isOpen={isOpen}
          onClose={onClose}
          order={orderData}
          orderItems={orderItems}
          grouped={false}
          metaInfo={[
            { label: "Customer", value: customerName },
            { label: "Total Price", value: formatToGermanCurrency(totalPrice) },
          ]}
        />
      )}
    </>
  );
};

TakeAwayOrder.propTypes = {
  orderData: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    orderId: PropTypes.string.isRequired,
    customerName: PropTypes.string,
    orderItems: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        quantity: PropTypes.number,
        total: PropTypes.number,
        item: PropTypes.shape({
          itemName: PropTypes.string,
        }),
        selectedCustomizations: PropTypes.arrayOf(
          PropTypes.shape({
            selectedOptions: PropTypes.arrayOf(
              PropTypes.shape({
                name: PropTypes.string,
              })
            ),
          })
        ),
      })
    ),
    totalPrice: PropTypes.number,
    assignedChef: PropTypes.shape({
      name: PropTypes.string,
    }),
    completedAt: PropTypes.string,
  }).isRequired,
  handleAllotOrder: PropTypes.func.isRequired,
};

export default TakeAwayOrder;
