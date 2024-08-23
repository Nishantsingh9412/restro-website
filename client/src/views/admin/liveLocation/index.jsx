import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import tt from "@tomtom-international/web-sdk-maps";
import { socket } from "api/socket";

export default function LiveLocation() {
  const { deliveryBoyId } = useParams(); // Assuming the route is something like /delivery-boy/:id
  const [location, setLocation] = useState(null);
  const [map, setMap] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Initialize TomTom map
    const mapInstance = tt.map({
      key: process.env.REACT_APP_TOMTOM_API_KEY,
      container: "map",
      center: [0, 0],
      zoom: 15,
    });

    setMap(mapInstance);

    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, []);

  useEffect(() => {
    // Request the delivery boy's location from the server
    const requestDeliveryBoyLocation = async () => {
      try {
        socket.emit("requestLocation", { deliveryBoyId });

        socket.on("locationUpdate", (coords) => {
          setLocation(coords);
          map.setCenter([coords.lng, coords.lat]);

          // Add or update marker on the map
          new tt.Marker().setLngLat([coords.lng, coords.lat]).addTo(map);
        });

        socket.on("locationError", (message) => {
          setError(message);
        });
        socket.on("error", (message) => {
          setError(message);
        });
      } catch (err) {
        setError("Failed to connect to the server.");
      }
    };

    if (id && map) {
      requestDeliveryBoyLocation();
    }

    return () => {
      socket.off("locationUpdate");
      socket.off("locationError");
    };
  }, [deliveryBoyId, map]);

  return (
    <div>
      <h1>Delivery Boy Location</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div id="map" style={{ height: "500px", width: "100%" }}></div>
    </div>
  );
}
