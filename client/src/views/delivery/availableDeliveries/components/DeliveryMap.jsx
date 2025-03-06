import { useEffect, useRef } from "react";
import tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import ttServices from "@tomtom-international/web-sdk-services";
import PropTypes from "prop-types";

const TOMTOM_API_KEY = import.meta.env.VITE_APP_TOMTOM_API_KEY;

const containerStyle = {
  width: "100%",
  height: "500px",
};

const isValidLocation = (location) => {
  return (
    location &&
    typeof location.lat === "number" &&
    typeof location.lng === "number"
  );
};

const DeliveryMap = ({ currentLocation, pickupLocation, dropPoints }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const currentMarker = useRef(null);
  const dropMarkers = useRef({});

  const initializeMap = () => {
    const map = tt.map({
      key: TOMTOM_API_KEY,
      container: mapRef.current,
      center: [currentLocation.lng, currentLocation.lat],
      zoom: 14,
    });

    mapInstance.current = map;

    map.on("load", updateMap);
  };

  const generateRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    color =
      "#" + "012345".charAt(Math.floor(Math.random() * 6)) + color.slice(2);
    return color;
  };

  const addMarker = (map, position, text, color) => {
    if (!isValidLocation(position)) return;

    const dropMarkerElement = document.createElement("div");
    dropMarkerElement.style.backgroundColor = color;
    dropMarkerElement.style.width = "20px";
    dropMarkerElement.style.height = "20px";
    dropMarkerElement.style.borderRadius = "50%";
    dropMarkerElement.style.border = "2px solid white";

    const pickupMarkerElement = document.createElement("div");
    const pickupIcon = document.createElement("img");
    pickupIcon.src = "https://img.icons8.com/ios-filled/50/FF0000/marker.png";
    pickupIcon.style.width = "30px";
    pickupIcon.style.height = "30px";
    pickupMarkerElement.appendChild(pickupIcon);

    const icon = text.includes("Pickup")
      ? pickupMarkerElement
      : dropMarkerElement;
    const marker = new tt.Marker({ element: icon })
      .setLngLat([position.lng, position.lat])
      .setPopup(new tt.Popup().setHTML(text))
      .addTo(map);

    dropMarkers.current[position.orderId] = marker;
  };
  
  const removeUnusedMarkers = (activeOrderIds) => {
    Object.keys(dropMarkers.current).forEach((orderId) => {
      if (!activeOrderIds.includes(orderId)) {
        dropMarkers.current[orderId].remove();
        delete dropMarkers.current[orderId];
      }
    });
  };

  const drawRoute = async (map, start, end, color) => {
    if (!isValidLocation(start) || !isValidLocation(end)) return;

    try {
      const response = await ttServices.services.calculateRoute({
        key: TOMTOM_API_KEY,
        locations: [`${start.lng},${start.lat}`, `${end.lng},${end.lat}`],
        traffic: false,
      });

      const points = response.routes[0].legs[0].points;
      const coordinates = points.map((point) => [point.lng, point.lat]);
      const geoJson = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates,
            },
          },
        ],
      };

      const routeId = `route-${end.orderId}`;

      if (map.getSource(routeId)) {
        map.getSource(routeId).setData(geoJson);
      } else {
        map.addSource(routeId, { type: "geojson", data: geoJson });
        map.addLayer({
          id: routeId,
          type: "line",
          source: routeId,
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": color,
            "line-width": 6,
            "line-opacity": 0.8,
          },
        });
      }
    } catch (error) {
      console.error("Failed to draw route", error);
    }
  };

  const updateMap = () => {
    if (!mapInstance.current) return;

    const map = mapInstance.current;

    if (!map || !map.getStyle() || !map.getStyle().layers) return;

    addMarker(map, pickupLocation, "Pickup Location", "#FFA500");

    dropPoints.forEach((point) => {
      const color = generateRandomColor();
      if (!dropMarkers.current[point.orderId]) {
        addMarker(map, point, `Drop Point (Order ID: ${point.orderId})`, color);
      }
      drawRoute(map, currentLocation ?? pickupLocation, point, color);
    });

    // Remove any existing routes that are no longer needed
    const routeIds = dropPoints.map((point) => `route-${point.orderId}`);
    const activeOrderIds = dropPoints.map((point) => point.orderId);
    removeUnusedMarkers(activeOrderIds);
    const mapLayers = map.getStyle().layers || [];
    mapLayers.forEach((layer) => {
      if (layer.id.includes("route-") && !routeIds.includes(layer.id)) {
        map.removeLayer(layer.id);
        map.removeSource(layer.id);
      }
    });
  };

  useEffect(() => {
    if (
      !isValidLocation(currentLocation) ||
      !isValidLocation(pickupLocation) ||
      !Array.isArray(dropPoints)
    ) {
      console.error("Invalid locations provided");
      return;
    }

    if (!mapInstance.current) {
      initializeMap();
    } else if (mapInstance.current?.loaded()) {
      updateMap();
    }
  }, [pickupLocation, dropPoints, currentLocation]);

  useEffect(() => {
    if (!mapInstance.current) return;

    const map = mapInstance.current;

    if (currentMarker.current) {
      currentMarker.current.setLngLat([
        currentLocation.lng,
        currentLocation.lat,
      ]);
    } else {
      const currentLocMarker = document.createElement("div");
      const currentLocIcon = document.createElement("img");
      currentLocIcon.src =
        "https://img.icons8.com/?size=100&id=HZC1E42sHiI3&format=png&color=000000";
      currentLocIcon.style.width = "30px";
      currentLocIcon.style.height = "30px";
      currentLocMarker.appendChild(currentLocIcon);

      currentMarker.current = new tt.Marker({ element: currentLocMarker })
        .setLngLat([currentLocation.lng, currentLocation.lat])
        .setPopup(new tt.Popup().setHTML("Current Location"))
        .addTo(map);
    }

    map.setCenter([currentLocation.lng, currentLocation.lat]);
  }, [currentLocation]);

  return <div ref={mapRef} style={containerStyle}></div>;
};

export default DeliveryMap;

DeliveryMap.propTypes = {
  currentLocation: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
  pickupLocation: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
  dropPoints: PropTypes.arrayOf(
    PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired,
      orderId: PropTypes.string.isRequired,
    })
  ).isRequired,
};
