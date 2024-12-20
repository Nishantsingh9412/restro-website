import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-fullscreen";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const containerStyle = {
  width: "100%",
  height: "700px",
};

const RoutingMachine = ({ waypoints }) => {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    // Remove previous routing control if it exists
    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
      routingControlRef.current = null;
    }

    // Initialize routing control
    routingControlRef.current = L.Routing.control({
      waypoints: waypoints.map((point) => L.latLng(point.lat, point.lng)),
      lineOptions: { styles: [{ color: "#4a90e2", weight: 6 }] },
      createMarker: (i, waypoint, n) =>
        L.marker(waypoint.latLng).bindPopup(
          i === 0 ? "You" : i === n - 1 ? "Deliver" : "Pickup"
        ),
      addWaypoints: false,
      draggableWaypoints: false,
      routeWhileDragging: false,
    }).addTo(map);

    // Cleanup on unmount
    return () => {
      if (routingControlRef.current) {
        map?.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }
    };
  }, [map, waypoints]);

  return null;
};

const RecenterControl = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const recenterControl = L.control({ position: "bottomright" });

    recenterControl.onAdd = () => {
      const button = L.DomUtil.create("button", "leaflet-bar");
      button.title = "Recenter Map";

      const icon = document.createElement("div");
      icon.style.cssText = `
        width: 30px; height: 30px; background: #fff; border: none;
        border-radius: 4px; cursor: pointer; padding: 5px;
      `;
      icon.innerHTML = `<img src="https://static.thenounproject.com/png/2819186-200.png" alt="Recenter" class="react-icon" />`;
      button.appendChild(icon);
      button.onclick = () => map.setView(center, 16);
      return button;
    };

    recenterControl.addTo(map);

    return () => {
      map.removeControl(recenterControl);
    };
  }, [map, center]);

  return null;
};

const DeliveryMap = ({ origin, destination, waypoints = [], center }) => {
  const allPoints = [origin, ...waypoints, destination];

  return (
    <div>
      <MapContainer
        center={center}
        zoom={13}
        style={{ ...containerStyle, position: "relative", zIndex: 0 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {origin && <Marker position={[origin.lat, origin.lng]} />}
        <RoutingMachine waypoints={allPoints} />
        <RecenterControl center={center} />
      </MapContainer>
    </div>
  );
};

export default DeliveryMap;
