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
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { useSelector } from "react-redux";
import { IoLocate } from "react-icons/io5";
import { getActiveDelivery } from "../../../../api";

const MergedMapModal = ({ isOpen, onClose, delEmpId, lastLocation }) => {
  // Refs to store map instance, live marker, and routing control
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const liveMarkerRef = useRef(null);
  const routingControlRef = useRef(null);

  // State to store distance traveled and active delivery details
  const [distanceTraveled, setDistanceTraveled] = useState(0);
  const [activeDelivery, setActiveDelivery] = useState(null);

  // Selector to get delivery boy's location from Redux store
  const deliveryBoyLocation = useSelector((state) =>
    state.location.deliveryBoyLocations.find((emp) => emp._id === delEmpId)
  );

  // Memoized values for origin, destination, and waypoints
  const [origin, destination, waypoints] = useMemo(() => {
    return [
      activeDelivery?.dropLocation,
      activeDelivery?.deliveryLocation,
      activeDelivery?.waypoints || [],
    ];
  }, [activeDelivery]);

  // Memoized value for live location
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

  // Function to fetch active delivery details
  const fetchActiveDelivery = async () => {
    try {
      const { data } = await getActiveDelivery(delEmpId);
      if (data) {
        setActiveDelivery(data?.result);
      } else {
        console.error("Failed to fetch active delivery", data.message);
      }
    } catch (error) {
      console.error("Error fetching active delivery:", error);
    }
  };

  // Effect to fetch active delivery when delEmpId changes
  useEffect(() => {
    if (delEmpId) {
      fetchActiveDelivery();
    }
  }, [delEmpId]);

  // Effect to initialize and clean up the map
  useEffect(() => {
    if (isOpen) {
      activeDelivery ? initializeMap() : setTimeout(initializeMap, 500);
    }
    function initializeMap() {
      if (!mapInstance.current && mapRef.current) {
        mapInstance.current = L.map(mapRef.current).setView(
          [liveLocation.lat, liveLocation.lng],
          13
        );

        // Add Tile Layer (OpenStreetMap)
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(mapInstance.current);

        // Add live tracking marker
        liveMarkerRef.current = L.marker([
          liveLocation.lat,
          liveLocation.lng,
        ]).addTo(mapInstance.current);

        initializeRoute();
      }
    }
    // Cleanup map on modal close
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        liveMarkerRef.current = null;
        routingControlRef.current = null;
        setDistanceTraveled(0);
      }
    };
  }, [isOpen, activeDelivery]);

  // Effect to update live location dynamically
  useEffect(() => {
    if (mapInstance.current && liveLocation) {
      liveMarkerRef.current?.setLatLng([liveLocation.lat, liveLocation.lng]);
      mapInstance.current.setView([liveLocation.lat, liveLocation.lng], 13);

      // Calculate distance traveled
      if (origin) {
        const distance = mapInstance.current.distance(
          [origin.lat, origin.lng],
          [liveLocation.lat, liveLocation.lng]
        );
        setDistanceTraveled((prev) => prev + distance);
      }
    }
  }, [liveLocation]);

  // Function to initialize route guidance
  const initializeRoute = () => {
    if (routingControlRef.current || !origin || !destination) return;
    const routePoints = [origin, ...waypoints, destination];

    routingControlRef.current = L.Routing.control({
      waypoints: routePoints.map((point) => L.latLng(point.lat, point.lng)),
      lineOptions: { styles: [{ color: "#4a90e2", weight: 5 }] },
      createMarker: (i, waypoint, n) =>
        L.marker(waypoint.latLng).bindPopup(
          i === 0 ? "Origin" : i === n - 1 ? "Destination" : `Stop ${i}`
        ),
      addWaypoints: false,
      draggableWaypoints: false,
      routeWhileDragging: false,
    }).addTo(mapInstance.current);
  };

  // Function to center the map on the live location
  const handleCenterMap = () => {
    if (mapInstance.current && liveLocation) {
      mapInstance.current.setView([liveLocation.lat, liveLocation.lng], 15);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Live Tracking & Route Guidance</ModalHeader>
        <ModalBody>
          <div
            ref={mapRef}
            style={{
              width: "100%",
              height: "400px",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          />
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <IconButton
              onClick={handleCenterMap}
              bg={"blue.300"}
              _hover={{ bg: "blue.400" }}
              icon={<IoLocate />}
            >
              Current Location
            </IconButton>
            <p style={{ fontSize: "16px", fontWeight: "bold" }}>
              Distance Traveled: {(distanceTraveled / 1000).toFixed(2)} km
            </p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="ghost"
            onClick={onClose}
            bg={"blue.200"}
            _hover={{ bg: "blue.400" }}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MergedMapModal;
