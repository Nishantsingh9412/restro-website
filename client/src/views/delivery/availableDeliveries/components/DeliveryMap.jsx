import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-fullscreen";
import { Text, Heading, Button } from "@chakra-ui/react";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import { FaArrowAltCircleUp } from "react-icons/fa";

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const containerStyle = {
  width: "100%",
  height: "700px",
};

const RoutingMachine = ({ waypoints }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const fullScreenControl = L.control
      .fullscreen({
        position: "topright",
        title: {
          'false': 'View Fullscreen',
          'true': 'Exit Fullscreen'
        },
      })
      .addTo(map);

    const routingControl = L.Routing.control({
      waypoints: waypoints.map((point) => L.latLng(point.lat, point.lng)),
      lineOptions: {
        styles: [{ color: "#4a90e2", weight: 6 }],
      },
      createMarker: function (i, waypoint, n) {
        return L.marker(waypoint.latLng).bindPopup(
          i === 0 ? "You" : i === n - 1 ? "Deliver" : "Pickup"
        );
      },
      addWaypoints: false,
      draggableWaypoints: false,
      routeWhileDragging: false,
    }).addTo(map);

    return () => {
      try {
        if (routingControl) {
          routingControl.getPlan().setWaypoints([]);
          map.removeControl(routingControl);
        }
        if (fullScreenControl) map.removeControl(fullScreenControl);
        // map.remove()
      } catch (err) {
        console.error(err);
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

    recenterControl.onAdd = function () {
      const button = L.DomUtil.create("button", "leaflet-bar");
      button.title = "Recenter Map";

      // Add React Icon to the button
      const icon = document.createElement("div");
      icon.style.width = "30px";
      icon.style.height = "30px";
      icon.style.background = "#fff"; // Customize background color if needed
      icon.style.border = "none";
      icon.style.borderRadius = "4px";
      icon.style.cursor = "pointer";
      icon.style.padding = "5px";
      icon.innerHTML = `<img src="https://static.thenounproject.com/png/2819186-200.png" alt="Recenter" class="react-icon" />`;
      button.appendChild(icon);
      button.onclick = function () {
        map.setView(center, 16);
      };
      return button;
    };

    recenterControl.addTo(map);

    return () => {
      try {
        map.removeControl(recenterControl);
      } catch (err) {
        console.error(err);
      }
    };
  }, [map, center]);

  return null;
};

const DeliveryMap = ({ origin, destination, waypoints=[], center }) => {
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

      <script>L.map('map').setBearing(rotation);</script>
    </div>
  );
};

export default DeliveryMap;
