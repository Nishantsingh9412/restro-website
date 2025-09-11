import { useDispatch, useSelector } from "react-redux";
import { hideOrderDetailsAction } from "../../../../redux/action/delivery";
import {
  MdClose,
  MdConfirmationNumber,
  MdAccessTime,
  MdDateRange,
  MdCheckCircle,
  MdPhone,
  MdLocationCity,
  MdPerson,
} from "react-icons/md";

export function CompletedOrderDetailModal() {
  const dispatch = useDispatch();
  const { isVisible, orderData } = useSelector(
    (state) => state.deliveryReducer?.showOrderDetails
  );

  if (!isVisible && !orderData) return null;


  return (
    <div className="fixed inset-0 z-[201] flex items-center justify-center bg-gray-800/40 backdrop-blur-xs">
      <div className="bg-gray-100 rounded-xl shadow-xl w-[75vw] sm:w-full  max-w-md mx-auto p-6 relative flex flex-col items-center !border !border-gray-300 h-[70vh] overflow-y-auto ">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={() => dispatch(hideOrderDetailsAction())}
          aria-label="Close"
        >
          <MdClose size={24} />
        </button>

        <h2 className="!text-2xl !font-semibold !mb-3 text-gray-700">
          📋 Order Details
        </h2>

        <div className="w-full space-y-3">
          {[
            {
              label: "Order ID",
              value: orderData.title,
              icon: (
                <MdConfirmationNumber size={24} className="text-gray-600" />
              ),
            },
            {
              label: "Customer",
              value: orderData.customerName,
              icon: <MdPerson size={24} className="text-gray-600" />,
            },
            {
              label: "Delivery Address",
              value: orderData.dropAddress,
              icon: <MdLocationCity size={24} className="text-gray-600" />,
            },
            {
              label: "Contact Number",
              value: orderData.customerPhone,
              icon: <MdPhone size={24} className="text-gray-600" />,
            },
            {
              label: "Status",
              value: orderData.status,
              icon: <MdCheckCircle size={24} className="text-green-500" />,
            },
            {
              label: "Created Time",
              value: orderData.createdTime,
              icon: <MdAccessTime size={24} className="text-gray-600" />,
            },
            {
              label: "Completed Time",
              value: orderData.completedTime || "—",
              icon: <MdAccessTime size={24} className="text-gray-600" />,
            },
            {
              label: "Date",
              value: orderData.date,
              icon: <MdDateRange size={24} className="text-gray-600" />,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 bg-gray-200 p-3 rounded-md shadow-sm"
            >
              {item.icon}
              <div>
                <div className="text-sm text-gray-500">{item.label}</div>
                <div className="font-medium text-gray-700">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
