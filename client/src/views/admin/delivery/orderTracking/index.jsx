import DeliveryMap from "../../../delivery/availableDeliveries/components/DeliveryMap";
import { useOrderTracking } from "../../../../hooks/useOrderTracking";
import { PageHeading } from "../../../../components/UI/PageHeading";
import { SelectField } from "../../../../components/common/SelectField";
import PageLoader from "../../../../components/UI/Loader";

const OrderTracking = () => {
  const {
    loading,
    dropPoints,
    orderDetails,
    selectedBoyId,
    currentLocation,
    setSelectedBoyId,
    onlineDeliveryBoys,
  } = useOrderTracking();

  return (
    <>
      <PageHeading title={"Order Tracking"} />
      <div className="px-2 md:px-4 py-2 min-h-[80vh]">
        <SelectField
          id="deliveryBoySelect"
          label="Select Delivery Boy"
          value={selectedBoyId}
          onChange={(e) => setSelectedBoyId(e.target.value)}
          options={[
            ...onlineDeliveryBoys.map((boy) => ({
              value: boy._id,
              label: boy.name,
            })),
          ]}
          required
          className="w-full"
        />
        {loading ? (
          <PageLoader />
        ) : (
          <div>
            {currentLocation && dropPoints.length > 0 && (
              <DeliveryMap
                currentLocation={currentLocation}
                dropPoints={dropPoints}
              />
            )}
            <div className="my-5">
              <h2 className="!font-semibold mb-2 !text-lg">Assigned Orders</h2>
              {orderDetails.length === 0 ? (
                <div className="text-gray-500 text-center mt-10">
                  No assigned orders.
                </div>
              ) : (
                <div>
                  {orderDetails.map((order) => (
                    <div
                      key={order.orderId}
                      className="p-3 mb-2 rounded-md bg-teal-50 border border-teal-100"
                    >
                      <div className="font-medium">Order #{order.orderId}</div>
                      <div className="text-sm text-gray-700">
                        Customer: {order.customer}
                      </div>
                      <div className="text-sm text-gray-700">
                        Address: {order.address}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default OrderTracking;
