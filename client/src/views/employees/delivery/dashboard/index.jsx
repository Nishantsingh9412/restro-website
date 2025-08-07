import DeliveryMap from "../../../delivery/availableDeliveries/components/DeliveryMap";

function DeliveryDashboard() {
  const currentLocation = {
    lat: 50.9375,
    lng: 6.9603,
  };
  return (
    <div className="relative">
      <DeliveryMap currentLocation={currentLocation} dropPoints={[]} />
      <div
        className="rounded-full bg-black absolute bottom-10 left-[40%] w-32 h-32 z-100 text-white flex items-center justify-center animate-bounceY cursor-pointer"
        style={{ boxShadow: "0px 0px 5px 5px rgba(0,0,0,1)" }}
        onClick={() => {}}
      >
        Let&#39;s Roll
      </div>
    </div>
  );
}

export default DeliveryDashboard;
