import { PageHeading } from "../../../../components/UI/PageHeading";
import { useRiderTrackingMap } from "../../../../hooks/useRiderTracking";

const RiderTrackingMap = () => {
  const { mapRef } = useRiderTrackingMap();

  return (
    <>
      <PageHeading title={"Rider Tracking"} />
      <div
        ref={mapRef}
        className="m-4 h-[85vh] sm:h-[80vh] rounded-lg shadow-md !border !border-gray-200 overflow-hidden"
      />
    </>
  );
};

export default RiderTrackingMap;
