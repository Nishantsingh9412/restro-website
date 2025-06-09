import { useRiderTrackingMap } from "../../../hooks/useRiderTracking";

const RiderTrackingMap = () => {
  const { mapRef } = useRiderTrackingMap();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        marginTop: "20px",
      }}
    >
      <h1
        style={{ marginBottom: "10px", fontWeight: "bold", fontSize: "20px" }}
      >
        Delivery Tracking Map
      </h1>
      <div
        ref={mapRef}
        style={{
          width: "95%",
          height: "600px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      />
    </div>
  );
};

export default RiderTrackingMap;
