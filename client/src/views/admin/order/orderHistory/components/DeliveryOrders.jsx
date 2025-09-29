import { MdLocalShipping } from "react-icons/md";
import PropTypes from "prop-types";
import { IoEye } from "react-icons/io5";
import { formatToGermanCurrency } from "../../../../../utils/utils";
import { InfoRow, OrderStatus } from "./OrderStatus";
import PrimaryActionButton from "../../../../../components/UI/PrimaryActionButton";
import OrderDetailsModal from "./OrderDetailsModal";
import { useModal } from "../../../../../hooks/useModal";
import { employeesRoles, orderTypes } from "../../../../../utils/constant";
import { generateLocationLink } from "../../../../../api";

const DeliveryOrders = ({ orderData, handleAllotOrder }) => {
  const { isOpen, onOpen, onClose, ref } = useModal();

  const {
    _id,
    orderId,
    customerName,
    phoneNumber,
    paymentMethod,
    address,
    zip,
    noteFromCustomer,
    totalPrice,
    orderItems,
    assignedTo,
    completedAt,
  } = orderData;

  const handleSendLink = async () => {
    try {
      const req = {
        orderId,
        delEmpId: assignedTo._id,
      };
      const res = await generateLocationLink(req);

      if (res.status === 200 || res.status === 201) {
        console.log(res.data.result);
      } else {
        alert("Error");
      }
    } catch (e) {
      console.error(e.message);
    }
  };

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
          assignedTo={assignedTo}
          orderId={orderId}
          onAllot={() => handleAllotOrder(employeesRoles.DELIVERY_BOY)}
          icon={<MdLocalShipping />}
          orderType={orderTypes.DELIVERY}
          handleSendLink={handleSendLink}
        />
        <div className="!border-b mb-2" />
        <div className="space-y-2 mb-4">
          <InfoRow label="Customer">{customerName || "N/A"}</InfoRow>
          <InfoRow label="Address">{address || "N/A"}</InfoRow>
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

      {isOpen && (
        <OrderDetailsModal
          isOpen={isOpen}
          onClose={onClose}
          ref={ref}
          order={orderData}
          orderItems={orderItems}
          grouped={false}
          metaInfo={[
            { label: "Customer", value: customerName },
            { label: "Phone", value: phoneNumber },
            { label: "Payment Method", value: paymentMethod },
            { label: "Address", value: address },
            { label: "Zip Code", value: zip },
            { label: "Note from Customer", value: noteFromCustomer },
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

DeliveryOrders.propTypes = {
  orderData: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    orderId: PropTypes.string.isRequired,
    customerName: PropTypes.string,
    phoneNumber: PropTypes.string,
    paymentMethod: PropTypes.string,
    deliveryMethod: PropTypes.string,
    address: PropTypes.string,
    zip: PropTypes.string,
    noteFromCustomer: PropTypes.string,
    totalPrice: PropTypes.number,
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
      })
    ),
    assignedTo: PropTypes.shape({
      _id: PropTypes.number,
      name: PropTypes.string,
    }),
    completedAt: PropTypes.string,
  }).isRequired,
  handleAllotOrder: PropTypes.func.isRequired,
};

export default DeliveryOrders;
