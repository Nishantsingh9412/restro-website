import { useDeliveryDashboard } from "../../../../hooks/employee/delivery/useDeliveryDB";
import DeliveryMap from "./components/DeliveryMap";
import PermissionModal from "./components/PermissionModal";
import PhotoCaptureModal from "./components/PhotoCaptureModal";
import OdometerCaptureModal from "./components/PhotoCaptureModal";
import { MdKeyboardArrowUp } from "react-icons/md";
import { useState } from "react";
import QuickActionModal from "./components/QuickActionModal";
import AvailableDeliveriesModal from "./components/AvailableDeliveriesModal";
import { useSelector } from "react-redux";
import { CompletedOrderDetailModal } from "../history/CompletedOrderDetailModal";

function DeliveryDashboard() {
  const {
    modals,
    handleLogout,
    handleToggleStatus,
    onlineStatus,
    handleCameraCapture,
    handleTakePhoto,
    capturedPhoto,
    setCapturedPhoto,
    setCameraPreview,
    handleRetake,
    capturedOdometerPhoto,
    handleOdometerCapture,
    setCapturedOdometerPhoto,
    handleLocationPermission,
    handleOdometerSubmission,
    handleConfirmPhoto,
    odometerReading,
    setOdometerReading,
    handleDiscardLivePhoto,
    handleDiscardOdometer,
  } = useDeliveryDashboard();

  const {
    locationModal,
    cameraModal,
    livePhotoModal,
    odometerModal,
    quickActionModal,
  } = modals;

  // 🆕 State for Deliveries & Map
  const [showDeliveries, setShowDeliveries] = useState(false);
  const [pickupLocation, setPickupLocation] = useState({ lat: 0, lng: 0 });
  const [dropLocations, setDropLocations] = useState([]);
  const [orderColor, setOrderColor] = useState({});
  const [currentLocation, setCurrentLocation] = useState({
    lat: 50.9375,
    lng: 6.9603,
  });

  const userData = useSelector((state) => state.userReducer.data);

  return (
    <div className="relative bg-[#8b8a8a47] min-h-screen">
      {/* Delivery Map */}
      <DeliveryMap
        currentLocation={currentLocation}
        pickupLocation={pickupLocation}
        dropPoints={dropLocations}
        setOrderColor={setOrderColor}
      />

      {/* Location Permission Modal */}
      <PermissionModal
        isOpen={locationModal.isOpen}
        onClose={locationModal.onClose}
        modalRef={locationModal.ref}
        onAllow={() => {
          handleLocationPermission();
          cameraModal.onOpen();
        }}
        onDiscard={locationModal.onClose}
        title="Location"
      />

      {/* Camera Permission Modal */}
      <PermissionModal
        isOpen={cameraModal.isOpen}
        onClose={cameraModal.onClose}
        modalRef={cameraModal.ref}
        onAllow={() => {
          handleCameraCapture();
          livePhotoModal.onOpen();
        }}
        onDiscard={cameraModal.onClose}
        title="Camera"
      />

      {/* Live Photo Capture Modal */}
      <PhotoCaptureModal
        header="Live"
        cameraPreview={(el) => setCameraPreview(el)}
        isOpen={livePhotoModal.isOpen}
        onClose={livePhotoModal.onClose}
        handleCapture={handleTakePhoto}
        onDiscard={handleDiscardLivePhoto}
        capturedImage={capturedPhoto}
        handleConfirm={handleConfirmPhoto}
        handleRetake={() => handleRetake(setCapturedPhoto)}
      />

      {/* Odometer Capture Modal */}
      <OdometerCaptureModal
        header="Odometer"
        cameraPreview={(el) => setCameraPreview(el)}
        isOpen={odometerModal.isOpen}
        onClose={odometerModal.onClose}
        onDiscard={handleDiscardOdometer}
        handleCapture={handleOdometerCapture}
        capturedImage={capturedOdometerPhoto}
        handleConfirm={handleOdometerSubmission}
        handleRetake={() => handleRetake(setCapturedOdometerPhoto)}
        inputField={{ value: odometerReading, onChange: setOdometerReading }}
      />

      {/* Quick Actions Modal */}
      {quickActionModal.isOpen && (
        <QuickActionModal
          onLogout={handleLogout}
          onClose={quickActionModal.onClose}
        />
      )}

      {/* 🆕 Deliveries Modal */}
      {showDeliveries && (
        <AvailableDeliveriesModal
          setShowDeliveries={setShowDeliveries}
          setPickupLocation={setPickupLocation}
          setDropLocations={setDropLocations}
          setCurrentLocation={setCurrentLocation}
          onToggleOffline={handleToggleStatus}
          orderColor={orderColor}
        />
      )}
      {/* 🆕 Order Details Modal */}
      <CompletedOrderDetailModal />

      {/* Online/Offline Button */}
      {onlineStatus === false ? (
        <div
          className="rounded-full bg-black absolute bottom-10 md:left-[45%] left-1/2 -translate-x-1/2 w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 z-[100] text-white flex items-center justify-center animate-bounce cursor-pointer"
          style={{ boxShadow: "0px 0px 5px 5px rgba(0,0,0,1)" }}
          onClick={handleToggleStatus}
        >
          Let&#39;s Roll
        </div>
      ) : (
        <div
          className="absolute bottom-10 md:left-[45%] left-1/2 -translate-x-1/2 cursor-pointer z-[150] flex flex-col items-center text-gray-500"
          onClick={() => setShowDeliveries(true)}
        >
          <MdKeyboardArrowUp className="text-6xl animate-bounce" />
          <span className="text-lg">Available Deliveries</span>
        </div>
      )}

      {/* Profile Button */}
      <div
        className="absolute top-10 right-10 h-10 w-10 rounded-2xl bg-gray-300 z-[100] p-1 cursor-pointer hover:opacity-90 active:scale-95"
        onClick={quickActionModal.onOpen}
      >
        <img
          src={
            userData?.profile_picture ??
            "https://plus.unsplash.com/premium_photo-1689977927774-401b12d137d6?q=80&w=2070&auto=format&fit=crop"
          }
          alt="Profile"
          className="object-cover !h-8 w-8 rounded-2xl"
        />
      </div>
    </div>
  );
}

export default DeliveryDashboard;
