import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import DeliveryCard from "./components/DeliveryCard";
import {
  completeDeliveryAction,
  udpateDeliveryStatusAction,
  getAllAvailabelDeliveryAction,
} from "../../../../redux/action/delivery";
import { statuses, Dialog_Boxes } from "../../../../utils/constant";
import { toggleDeliveryPersonnelAvailability } from "../../../../api";
import PageLoader from "../../../../components/UI/Loader";
import DeliveryMap from "../dashboard/components/DeliveryMap";

export default function AvailableDeliveries() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [allPickedUp, setAllPickedUp] = useState(false);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropLocations, setDropLocations] = useState([]);

  const delBoy = useSelector((state) => state.userReducer.data);
  const currentLocation = useSelector((state) => {
    const location = state.location.currentLocation;
    return location?.lat && location?.lng
      ? location
      : delBoy?.lastLocation || pickupLocation;
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

  useEffect(() => {
    Promise.all([dispatch(getAllAvailabelDeliveryAction())]).then(() =>
      setLoading(false)
    );
  }, [dispatch]);

  useEffect(() => {
    if (availableDeliveries.length > 0) {
      const allPicked = availableDeliveries.every(
        ({ currentStatus }) => currentStatus === statuses.PICKED_UP
      );
      setAllPickedUp(allPicked);
      setPickupLocation(availableDeliveries[0]?.pickupLocation);
      const dropLocations = [];
      availableDeliveries.map((delivery) => {
        if (
          delivery?.currentStatus === statuses.PICKED_UP ||
          delivery?.currentStatus === statuses.OUT_FOR_DELIVERY
        ) {
          dropLocations.push({
            orderId: delivery?.orderId,
            lat: delivery?.deliveryLocation?.lat,
            lng: delivery?.deliveryLocation?.lng,
          });
        }
      });
      setDropLocations(dropLocations);
      return () => {
        setDropLocations([]);
      };
    }
  }, [availableDeliveries]);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="p-5">
      {availableDeliveries.length === 0 ? (
        <p className="p-3 w-fit bg-white/50 mx-auto my-20 text-[#767680]">
          You don&apos;t have any delivery offer at this moment
        </p>
      ) : (
        <>
          <DeliveryMap
            currentLocation={currentLocation ?? pickupLocation}
            pickupLocation={pickupLocation}
            dropPoints={dropLocations}
          />

          <div className="flex justify-between items-center my-2">
            <h2 className="!text-lg !font-semibold text-[#767680]">
              Available Deliveries
            </h2>
            {allPickedUp && (
              <button
                onClick={() =>
                  Dialog_Boxes.showStatusChangeConfirm(
                    null,
                    statuses.OUT_FOR_DELIVERY,
                    handleUpdateAllToOutForDelivery
                  )
                }
                className="mb-5 px-4 py-2 rounded-md bg-[#767680] hover:bg-[#5e5e68] text-white font-semibold"
              >
                Out for Delivery
              </button>
            )}
          </div>

          <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {availableDeliveries?.map((delivery, i) => (
              <DeliveryCard
                data={delivery}
                key={i}
                handleUpdateStatus={(id, status) =>
                  Dialog_Boxes.showStatusChangeConfirm(
                    id,
                    status,
                    handleUpdateStatus
                  )
                }
                disabled={
                  delivery?.currentStatus === statuses.PICKED_UP ? true : false
                }
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
