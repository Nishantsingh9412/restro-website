import PropTypes from "prop-types";
import { useEffect } from "react";
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

// RoutingMachine component to handle routing on the map
const RoutingMachine = ({ waypoints }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Add fullscreen control to the map
    const fullScreenControl = L.control
      .fullscreen({
        position: "topright",
        title: {
          false: "View Fullscreen",
          true: "Exit Fullscreen",
        },
      })
      .addTo(map);

    // Add routing control to the map
    const routingControl = L.Routing.control({
      waypoints: waypoints.map((point) => L.latLng(point.lat, point.lng)),
      lineOptions: {
        styles: [{ color: "#4a90e2", weight: 6 }],
      },
      createMarker: (i, waypoint, n) =>
        L.marker(waypoint.latLng).bindPopup(
          i === 0 ? "You" : i === n - 1 ? "Deliver" : "Pickup"
        ),
      addWaypoints: false,
      draggableWaypoints: false,
      routeWhileDragging: false,
    }).addTo(map);

    // Cleanup on component unmount
    return () => {
      // Remove the routing control if it exists
      if (routingControl) {
        map.removeControl(routingControl); // Properly remove the routing control
      }

      // Remove fullscreen control
      if (fullScreenControl) {
        map.removeControl(fullScreenControl);
      }
    };
  }, [map, waypoints]);

  return null;
};

// RecenterControl component to handle recentering the map
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
      icon.style.background = "#fff";
      icon.style.border = "none";
      icon.style.borderRadius = "4px";
      icon.style.cursor = "pointer";
      icon.style.padding = "5px";
      icon.innerHTML = `<img src="https://static.thenounproject.com/png/2819186-200.png" alt="Recenter" class="react-icon" />`;
      button.appendChild(icon);
      button.onclick = () => map.setView(center, 16);
      return button;
    };

    recenterControl.addTo(map);

    // Cleanup on component unmount
    return () => {
      map.removeControl(recenterControl);
    };
  }, [map, center]);

  return null;
};

// DeliveryMap component to render the map with routing and recenter controls
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

// PropTypes validation
DeliveryMap.propTypes = {
  origin: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
  destination: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
  waypoints: PropTypes.arrayOf(
    PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired,
    })
  ),
  center: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
};

RoutingMachine.propTypes = {
  waypoints: PropTypes.arrayOf(
    PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired,
    })
  ).isRequired,
};

RecenterControl.propTypes = {
  center: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
};

export default DeliveryMap;
