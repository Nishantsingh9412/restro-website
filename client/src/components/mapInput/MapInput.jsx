import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import tt from "@tomtom-international/web-sdk-maps";
import { setDeliveryInfo } from "../../redux/action/customerInfo";
import Modal from "../UI/Modal";

export default function MapInput({ data, isOpen, onClose }) {
  const TOMTOM_API_KEY = import.meta.env.VITE_APP_TOMTOM_API_KEY;
  const COUNTRY_CODE = import.meta.env.VITE_APP_COUNTRY_CODE || "DE";
  const dispatch = useDispatch();
  const [utils, setUtils] = useState({
    position: [
      data.dropLocation?.lat || 50.95042,
      data.dropLocation?.lng || 6.933551,
    ],
    locationName: data.dropLocationName || "",
    search: "",
    zoom: 13,
    suggestions: [],
    loading: false,
    error: null,
  });

  const updateUtils = (newUtils) =>
    setUtils((prev) => ({ ...prev, ...newUtils }));
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    updateUtils({ loading: true, suggestions: [], error: null });

    if (!utils.search.trim()) {
      updateUtils({ loading: false });
      return;
    }

    const url = `https://api.tomtom.com/search/2/search/${encodeURIComponent(
      utils.search
    )}.json?key=${TOMTOM_API_KEY}&countrySet=${COUNTRY_CODE}&radius=50000&typeahead=true`;

    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        const newSuggestions = data.results || [];
        updateUtils({
          suggestions: newSuggestions.length > 0 ? newSuggestions : [],
          error: newSuggestions.length ? null : "No results found.",
        });
      })
      .catch(() => {
        updateUtils({ suggestions: [], error: "Error fetching data." });
      })
      .finally(() => {
        updateUtils({ loading: false });
      });
  };

  const handleSearchByCoords = (lat, lng) => {
    const url = `https://api.tomtom.com/search/2/reverseGeocode/${lat},${lng}.json?key=${TOMTOM_API_KEY}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.addresses && data.addresses.length > 0) {
          updateUtils({
            locationName: data.addresses[0].address.freeformAddress,
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching reverse geocoding data:", error);
      });
  };

  const handleSuggestionClick = (suggestion) => {
    const newPosition = [suggestion.position.lat, suggestion.position.lon];

    updateUtils({
      position: newPosition,
      locationName: suggestion.address?.freeformAddress || suggestion.poi.name,
      suggestions: [],
      search: "",
    });

    if (mapRef.current) {
      if (!markerRef.current) {
        markerRef.current = new tt.Marker()
          .setLngLat([newPosition[1], newPosition[0]])
          .addTo(mapRef.current);
      } else {
        markerRef.current.setLngLat([newPosition[1], newPosition[0]]);
      }

      mapRef.current.setCenter([newPosition[1], newPosition[0]]);
    } else {
      console.error("Map is not initialized.");
    }
  };

  function splitAddress(address) {
    if (!address.includes(",")) {
      return { error: "Invalid format: Missing comma separator." };
    }

    const parts = address.split(",").map((part) => part.trim());
    if (parts.length < 2) {
      return { error: "Invalid format: Address missing ZIP and city." };
    }

    const street = parts[0];
    const zipCity = parts[1].split(/\s+/); // Split on spaces

    if (zipCity.length < 2 || isNaN(zipCity[0])) {
      return { error: "Invalid format: ZIP code missing or invalid." };
    }

    return {
      street,
      zip: zipCity[0],
      city: zipCity.slice(1).join(" "),
    };
  }

  const handleFinalSubmit = () => {
    const { street, zip, city } = splitAddress(utils.locationName);
    dispatch(
      setDeliveryInfo({
        dropLocation: {
          lat: utils.position[0],
          lng: utils.position[1],
        },
        dropLocationName: utils.locationName,
        address: street,
        city: city,
        zip: zip,
      })
    );
    // Close the modal
    onClose();
  };

  // Initialize map
  useEffect(() => {
    setTimeout(() => {
      if (isOpen && mapContainer.current) {
        if (!mapRef.current) {
          mapRef.current = tt.map({
            key: TOMTOM_API_KEY,
            container: mapContainer.current,
            center: [utils.position[1], utils.position[0]],
            zoom: utils.zoom,
          });

          markerRef.current = new tt.Marker()
            .setLngLat([utils.position[1], utils.position[0]])
            .addTo(mapRef.current);

          mapRef.current.on("click", (e) => {
            const [lng, lat] = e.lngLat.toArray();
            mapRef.current.panTo([lng, lat], { duration: 200 });

            if (markerRef.current) {
              markerRef.current.setLngLat([lng, lat]);
            }

            updateUtils({ position: [lat, lng] });
            handleSearchByCoords(lat, lng);
          });
        } else {
          mapRef.current.setCenter([utils.position[1], utils.position[0]]);
          mapRef.current.setZoom(utils.zoom);
          if (markerRef.current) {
            markerRef.current.setLngLat([utils.position[1], utils.position[0]]);
          }
        }
        return () => {
          if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current = null;
          }
        };
      }
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-sm sm:max-w-xl lg:max-w-4xl"
    >
      <div className="bg-white rounded-xl shadow-lg w-full">
        {/* Body */}
        <div className="flex flex-col gap-4 px-6 py-4">
          <form
            className="flex gap-2"
            onSubmit={handleSearch}
            autoComplete="off"
          >
            <input
              type="search"
              placeholder="Search places..."
              value={utils.search}
              onChange={(e) => updateUtils({ search: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-base"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-700 transition"
            >
              Search
            </button>
          </form>
          {utils.error && <p className="text-red-500 text-sm">{utils.error}</p>}
          <div className="max-h-40 overflow-y-auto !border !border-gray-200 rounded">
            {utils.suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-2 border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition"
              >
                {suggestion.address?.freeformAddress || suggestion.poi?.name}
              </div>
            ))}
          </div>
          <div
            ref={mapContainer}
            className="w-full h-[400px]"
            style={{ cursor: "crosshair" }}
          />
          <div className="flex gap-2 mx-20">
            <button
              className="!py-1 !px-5 rounded-md !bg-green-400 flex-5/6  font-semibold hover:!bg-green-500 transition"
              onClick={handleFinalSubmit}
              type="button"
            >
              Submit
            </button>
            <button
              className="!py-1 !px-5 rounded-md !bg-red-500 flex-2/6 !text-white font-semibold hover:!bg-red-600 transition"
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

MapInput.propTypes = {
  data: PropTypes.object,
  onSubmit: PropTypes.func,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};
