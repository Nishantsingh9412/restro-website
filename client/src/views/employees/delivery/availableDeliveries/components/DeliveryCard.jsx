import { PropTypes } from "prop-types";
import { statuses } from "../../../../../utils/constant";

export default function DeliveryCard({ data, handleUpdateStatus, disabled }) {
  const primaryColor = "!bg-[#767680]";
  const primaryHover = "!hover:bg-[#5e5e68]";

  const getNextStatus = (current) => {
    switch (current) {
      case statuses.AVAILABLE:
        return {
          status: statuses.PICKED_UP,
          color: `${primaryColor} ${primaryHover}`,
        };
      case statuses.PICKED_UP:
      case statuses.OUT_FOR_DELIVERY:
        return {
          status: statuses.DELIVERED,
          color: `${primaryColor} ${primaryHover}`,
        };
      case statuses.DELIVERED:
        return {
          status: statuses.COMPLETED,
          color: `${primaryColor} ${primaryHover}`,
        };
      case statuses.CANCELLED:
        return {
          status: statuses.AVAILABLE,
          color: `${primaryColor} ${primaryHover}`,
        };
      default:
        return {
          status: "Completed",
          color: `${primaryColor} ${primaryHover}`,
        };
    }
  };

  const nextStatus = getNextStatus(data.currentStatus);

  return (
    <div className="max-w-xl bg-white !border !border-[#767680]/30 shadow-md rounded-lg p-4">
      <div className="flex flex-row gap-4">
        <div className="flex flex-col flex-1 gap-2">
          {/* Header */}
          <div className="flex justify-between">
            <div>
              <p className="text-lg font-bold text-[#767680]">
                {data.customerName}
              </p>
              <p className="text-sm text-[#767680]/80">Order #{data.orderId}</p>
              <span className="mt-2 inline-block bg-[#767680]/10 px-2 py-1 text-xs font-medium rounded-md text-[#767680]">
                {data.paymentType?.toUpperCase()}
              </span>
            </div>
            <div className="w-12 h-12 rounded-full overflow-hidden !border !border-[#767680]/30">
              <img
                src={
                  data.customerImage ??
                  "https://res.cloudinary.com/dezifvepx/image/upload/v1712570097/restro-website/dtqy5kkrwuuhamtp9gim.png"
                }
                alt={data.customerName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Distance & Time */}
          <div className="flex gap-4 mt-2">
            <div className="flex items-center !border !border-[#767680]/30 p-2 rounded-md flex-1 text-sm text-[#767680]">
              {/* Restaurant → Arrow → Location */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-[#767680]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M8 6v12a4 4 0 0 0 8 0V6"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-[#767680] mx-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-[#767680]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 22s8-4.5 8-10a8 8 0 10-16 0c0 5.5 8 10 8 10z"
                />
              </svg>
              <span className="ml-2">
                {(data.distance / 1000).toFixed(1)} km
              </span>
            </div>

            <div className="flex items-center !border !border-[#767680]/30 p-2 rounded-md flex-1 text-sm text-[#767680]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-[#767680]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="ml-2">
                {Math.ceil(data.estimatedTime / 60)} min.
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex gap-2 mt-4">
            <button
              className={`flex-1 !py-2 !px-3 !text-white text-sm font-medium rounded-md ${
                disabled
                  ? "!bg-[#767680]/50 !cursor-not-allowed"
                  : nextStatus.color
              }`}
              disabled={disabled}
              onClick={() =>
                !disabled && handleUpdateStatus(data._id, nextStatus.status)
              }
            >
              {nextStatus.status}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

DeliveryCard.propTypes = {
  data: PropTypes.object,
  handleUpdateStatus: PropTypes.func,
  disabled: PropTypes.bool,
};
