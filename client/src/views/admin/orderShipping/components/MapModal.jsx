import React, { useEffect, useRef, useMemo } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import { useSelector } from "react-redux";

const MapModal = ({ isOpen, onClose, delEmpId }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const TOMTOM_API_KEY = import.meta.env.VITE_APP_TOMTOM_API_KEY;

  const deliveryBoyLocation = useSelector((state) =>
    state.location.deliveryBoyLocations.find((emp) => emp._id === delEmpId)
  );

  const locationData = useMemo(
    () =>
      deliveryBoyLocation?.location || {
        latitude: 22.5678,
        longitude: 88.372,
      },
    [deliveryBoyLocation]
  );

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (mapRef.current && !mapInstance.current) {
          mapInstance.current = tt.map({
            key: TOMTOM_API_KEY,
            container: mapRef.current,
            center: [locationData.longitude, locationData.latitude],
            zoom: 16,
          });

          markerRef.current = new tt.Marker()
            .setLngLat([locationData.longitude, locationData.latitude])
            .addTo(mapInstance.current);
        }
      }, 1000); // Brief delay to allow for DOM update
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        markerRef.current = null;
      }
    };
  }, [isOpen]);

  useEffect(() => {
    console.log(mapRef, mapInstance);
    if (mapInstance.current && locationData) {
      const { latitude, longitude } = locationData;
      mapInstance.current.setCenter([longitude, latitude]);

      if (markerRef.current) {
        markerRef.current.setLngLat([longitude, latitude]);
      } else {
        markerRef.current = new tt.Marker()
          .setLngLat([longitude, latitude])
          .addTo(mapInstance.current);
      }
    }
  }, [locationData]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Live Location - Delivery Boy</ModalHeader>
        <ModalBody>
          <div
            ref={mapRef}
            style={{
              width: "100%",
              height: "400px",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MapModal;
