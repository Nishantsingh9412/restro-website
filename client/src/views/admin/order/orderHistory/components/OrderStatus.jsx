import PropTypes from "prop-types";
import { MdSendToMobile } from "react-icons/md";
import { orderTypes } from "../../../../../utils/constant";
// Reusable label-value pair
export const InfoRow = ({ label, children }) => (
  <div>
    <span className="inline-block bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold mr-2">
      {label}
    </span>
    {children}
  </div>
);

export const OrderStatus = ({
  completedAt,
  assignedTo,
  orderId,
  onAllot,
  icon,
  handleSendLink,
  orderType,
}) => {
  if (completedAt)
    return (
      <div className="bg-green-100 text-center mb-2 p-2 rounded">
        <h2 className="text-md !font-semibold text-green-700">Completed</h2>
      </div>
    );
  if (assignedTo)
    return (
      <div className="bg-blue-100 mb-2 p-2 rounded flex justify-between items-center">
        <h2 className="text-md !font-semibold text-blue-700">
          Assigned to {assignedTo.name}
        </h2>
        {/* Notify User */}
        {orderType === orderTypes.DELIVERY && (
          <div
            className="rounded-full p-1 !border-[2px] !border-white text-blue-700 cursor-pointer"
            onClick={handleSendLink}
          >
            <MdSendToMobile />
          </div>
        )}
      </div>
    );
  return (
    <div className="flex justify-between items-center mb-2 bg-blue-100 p-2">
      <h2 className="text-md !font-semibold text-blue-700 ">
        Order #{orderId}
      </h2>
      <button
        onClick={onAllot}
        aria-label="Allot Delivery Boy"
        title="Allot Delivery Boy"
        className="!p-1 rounded-full !border !border-blue-400 !text-blue-500 hover:!bg-blue-50 transition"
      >
        {icon}
      </button>
    </div>
  );
};

const InfoRowPropTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node,
};

InfoRow.propTypes = InfoRowPropTypes;

OrderStatus.propTypes = {
  completedAt: PropTypes.string,
  assignedTo: PropTypes.shape({ name: PropTypes.string }),
  orderId: PropTypes.string,
  onAllot: PropTypes.func,
  icon: PropTypes.node.isRequired,
  handleSendLink: PropTypes.func,
  orderType: PropTypes.string,
};
