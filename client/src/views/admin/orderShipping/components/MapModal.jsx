import React, { useEffect, useRef, useMemo, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  IconButton,
} from "@chakra-ui/react";
import tt from "@tomtom-international/web-sdk-maps";
import * as services from "@tomtom-international/web-sdk-services";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import { IoLocate } from "react-icons/io5";
import { getActiveDelivery } from "../../../../api";
import { useSelector } from "react-redux";

const MergedMapModal = ({ isOpen, onClose, delEmpId, lastLocation }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const liveMarkerRef = useRef(null);
  const routeLayerRef = useRef(null);
  const [activeDelivery, setActiveDelivery] = useState(null);
  const [distanceTraveled, setDistanceTraveled] = useState(0);
  const TOMTOM_API_KEY = import.meta.env.VITE_APP_TOMTOM_API_KEY;

  // Redux Selector for delivery boy location
  const deliveryBoyLocation = useSelector((state) =>
    state.location.deliveryBoyLocations.find((emp) => emp._id === delEmpId)
  );

  const liveLocation = useMemo(() => {
    if (deliveryBoyLocation) {
      return {
        lat: deliveryBoyLocation.location.latitude,
        lng: deliveryBoyLocation.location.longitude,
      };
    }
    return {
      lat: lastLocation?.lat ?? 22.5678,
      lng: lastLocation?.lng ?? 88.372,
    };
  }, [deliveryBoyLocation, lastLocation]);

  const [dropLocation, deliveryLocation, waypoints = []] = useMemo(() => {
    return [activeDelivery?.dropLocation, activeDelivery?.deliveryLocation];
  }, [activeDelivery]);

  // Fetch active delivery details
  const fetchActiveDelivery = async () => {
    try {
      const { data } = await getActiveDelivery(delEmpId);
      if (data) {
        setActiveDelivery(data.result);
      }
    } catch (error) {
      console.error("Error fetching active delivery:", error);
    }
  };

  useEffect(() => {
    if (delEmpId) fetchActiveDelivery();
  }, [delEmpId]);

  useEffect(() => {
    if (isOpen) {
      activeDelivery ? initializeMap() : setTimeout(initializeMap, 500);
    }

    function initializeMap() {
      if (mapRef.current && !mapInstance.current) {
        mapInstance.current = tt.map({
          key: TOMTOM_API_KEY, // Replace with your API key
          container: mapRef.current,
          center: [liveLocation.lng, liveLocation.lat],
          zoom: 13,
        });

        // Add live marker
        liveMarkerRef.current = new tt.Marker().setLngLat([
          liveLocation.lng,
          liveLocation.lat,
        ]);
        liveMarkerRef.current.addTo(mapInstance.current);

        initializeRoute();
      }
    }

    // Cleanup map
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        liveMarkerRef.current = null;
        routeLayerRef.current = null;
        setDistanceTraveled(0);
      }
    };
  }, [isOpen, activeDelivery]);

  useEffect(() => {
    if (mapInstance.current && liveLocation) {
      liveMarkerRef.current.setLngLat([liveLocation.lng, liveLocation.lat]);
      mapInstance.current.flyTo({
        center: [liveLocation.lng, liveLocation.lat],
      });

      if (activeDelivery?.dropLocation) {
        const distance = calculateDistance(
          activeDelivery.dropLocation,
          liveLocation
        );
        setDistanceTraveled((prev) => prev + distance);
      }
    }
  }, [liveLocation]);

  const initializeRoute = () => {
    if (!dropLocation || !deliveryLocation) return;
    const routePoints = [dropLocation, ...waypoints, deliveryLocation];

    services.services
      .calculateRoute({
        key: TOMTOM_API_KEY,
        locations: routePoints.map((p) => `${p.lng},${p.lat}`).join(":"),
      })
      .then((response) => {
        const route = response.routes[0].legs.flatMap((leg) =>
          leg.points.map((point) => [point.lng, point.lat])
        );

        // Check if the layer and source exist, and remove them
        if (mapInstance.current.getLayer("route-layer")) {
          mapInstance.current.removeLayer("route-layer");
        }
        if (mapInstance.current.getSource("route-layer")) {
          mapInstance.current.removeSource("route-layer");
        }

        // Add the new route as a GeoJSON layer
        mapInstance.current.addSource("route-layer", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: route,
            },
          },
        });

        mapInstance.current.addLayer({
          id: "route-layer",
          type: "line",
          source: "route-layer",
          paint: {
            "line-color": "#4a90e2",
            "line-width": 5,
          },
        });

        // Add markers for origin and destination
        new tt.Marker({ color: "green" })
          .setLngLat([dropLocation.lng, dropLocation.lat])
          .addTo(mapInstance.current);

        new tt.Marker({ color: "red" })
          .setLngLat([deliveryLocation.lng, deliveryLocation.lat])
          .addTo(mapInstance.current);
      })
      .catch((err) => console.error("Error fetching route:", err));
  };

  const calculateDistance = (point1, point2) => {
    const R = 6371000; // Earth radius in meters
    const toRad = (x) => (x * Math.PI) / 180;

    const dLat = toRad(point2.lat - point1.lat);
    const dLng = toRad(point2.lng - point1.lng);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(point1.lat)) *
        Math.cos(toRad(point2.lat)) *
        Math.sin(dLng / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Live Tracking & Route Guidance</ModalHeader>
        <ModalBody>
          <div ref={mapRef} style={{ width: "100%", height: "400px" }} />
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <IconButton
              onClick={() =>
                mapInstance.current.flyTo({
                  center: [liveLocation.lng, liveLocation.lat],
                })
              }
              icon={<IoLocate />}
            />
            <p>Distance Traveled: {(distanceTraveled / 1000).toFixed(2)} km</p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MergedMapModal;
