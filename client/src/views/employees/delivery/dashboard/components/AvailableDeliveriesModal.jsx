import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  completeDeliveryAction,
  udpateDeliveryStatusAction,
  getAllAvailabelDeliveryAction,
} from "../../../../../redux/action/delivery";
import { statuses, Dialog_Boxes } from "../../../../../utils/constant";
import { toggleDeliveryPersonnelAvailability } from "../../../../../api";
import PageLoader from "../../../../../components/UI/Loader";
import { MdKeyboardArrowDown, MdLocationDisabled } from "react-icons/md";

export default function AvailableDeliveriesModal({
  setShowDeliveries,
  setPickupLocation,
  setDropLocations,
  setCurrentLocation,
  onToggleOffline,
  orderColor = {},
}) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [allPickedUp, setAllPickedUp] = useState(false);

  const delBoy = useSelector((state) => state.userReducer.data);

  const currentLocation = useSelector((state) => {
    const location = state.location.currentLocation;
    return location?.lat && location?.lng
      ? location
      : delBoy?.lastLocation || null;
  });

  const availableDeliveries = useSelector(
    (state) => state.deliveryReducer.deliveries || []
  );

  const handleCompleteDelivery = (id) => {
    if (availableDeliveries.length === 1) toggleDeliveryPersonnelAvailability();
    dispatch(completeDeliveryAction(id)).then(() =>
      Dialog_Boxes.showOrderCompleted()
    );
  };

  const handleUpdateStatus = (id, status) => {
    if (status === statuses.DELIVERED) return handleCompleteDelivery(id);
    dispatch(udpateDeliveryStatusAction(id, status));
  };

  const handleUpdateAllToOutForDelivery = () => {
    availableDeliveries.forEach((delivery) => {
      if (delivery?.currentStatus === statuses.PICKED_UP) {
        dispatch(
          udpateDeliveryStatusAction(delivery?._id, statuses.OUT_FOR_DELIVERY)
        );
      }
    });
    toggleDeliveryPersonnelAvailability();
  };

  // Load deliveries
  useEffect(() => {
    dispatch(getAllAvailabelDeliveryAction()).then(() => setLoading(false));
  }, [dispatch]);

  // Update pickup/drop locations whenever deliveries change
  useEffect(() => {
    if (availableDeliveries.length > 0) {
      const allPicked = availableDeliveries.every(
        ({ currentStatus }) => currentStatus === statuses.PICKED_UP
      );
      setAllPickedUp(allPicked);

      // Set pickup point
      setPickupLocation(availableDeliveries[0]?.pickupLocation);
      setCurrentLocation(currentLocation);

      // Collect drop points
      const drops = [];
      availableDeliveries.forEach((delivery) => {
        if (
          delivery?.currentStatus === statuses.PICKED_UP ||
          delivery?.currentStatus === statuses.OUT_FOR_DELIVERY
        ) {
          drops.push({
            orderId: delivery?.orderId,
            lat: delivery?.deliveryLocation?.lat,
            lng: delivery?.deliveryLocation?.lng,
          });
        }
      });
      setDropLocations(drops);
    } else {
      setPickupLocation(null);
      setDropLocations([]);
    }
  }, [
    availableDeliveries,
    setPickupLocation,
    setDropLocations,
    setCurrentLocation,
    currentLocation,
  ]);

  return (
    <div className="fixed inset-0 z-[200] flex flex-col justify-end bg-black/40">
      <div className="bg-white rounded-t-2xl p-6 h-[70%] overflow-y-auto animate-swipe-up">
        {/* Handle drag down */}
        <div className="flex justify-center  ">
          <div
            className="cursor-pointer"
            onClick={() => setShowDeliveries(false)}
          >
            <MdKeyboardArrowDown className="text-4xl md:text-6xl animate-bounce text-gray-400" />
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          {!availableDeliveries.length === 0 ? (
            <h2 className="!text-xl !font-semibold">Available Deliveries</h2>
          ) : null}
          {allPickedUp && (
            <button
              onClick={() =>
                Dialog_Boxes.showStatusChangeConfirm(
                  null,
                  statuses.OUT_FOR_DELIVERY,
                  handleUpdateAllToOutForDelivery
                )
              }
              className="!px-4 !py-2 rounded-md !bg-[#767680] hover:!bg-[#5e5e68] !text-white font-semibold"
            >
              Out for Delivery
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center">
            {" "}
            <PageLoader />
          </div>
        ) : availableDeliveries.length === 0 ? (
          <>
            <p className="bg-white/50 flex justify-center !text-[#767680] !py-8 text-lg font-medium">
              You don&apos;t have any delivery offer at this moment
            </p>
            <div className="fixed bottom-8 left-0 w-full flex justify-center z-50 pointer-events-none">
              <button
                className="flex gap-2 items-center pointer-events-auto !px-8 !py-3 rounded-full !bg-gradient-to-r !from-[#767680] !to-[#5e5e68] !text-white font-bold text-lg shadow-lg animate-bounce transition-all duration-300 hover:scale-105 !hover:from-[#5e5e68] !hover:to-[#767680]"
                onClick={() => {
                  onToggleOffline();
                  setShowDeliveries(false);
                }}
              >
                <MdLocationDisabled />
                Go Offline
              </button>
            </div>
          </>
        ) : (
          <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
            {availableDeliveries.map((delivery) => (
              <DeliveryCard
                key={delivery._id}
                data={delivery}
                color={orderColor[delivery.orderId] || "#767680"}
                handleUpdateStatus={(id, status) =>
                  Dialog_Boxes.showStatusChangeConfirm(
                    id,
                    status,
                    handleUpdateStatus
                  )
                }
                disabled={delivery?.currentStatus === statuses.PICKED_UP}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

AvailableDeliveriesModal.propTypes = {
  setShowDeliveries: PropTypes.func.isRequired,
  setPickupLocation: PropTypes.func.isRequired,
  setDropLocations: PropTypes.func.isRequired,
  setCurrentLocation: PropTypes.func.isRequired,
  onToggleOffline: PropTypes.func.isRequired,
  orderColor: PropTypes.object.isRequired,
};

function DeliveryCard({ data, handleUpdateStatus, disabled, color }) {
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
    <div className="max-w-full bg-white !border !border-[#767680]/30 shadow-md rounded-lg p-4">
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
            <div
              className="w-12 h-4 rounded-md !border !border-[#767680]/30"
              style={{ background: color }}
            ></div>
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
  color: PropTypes.string,
};
