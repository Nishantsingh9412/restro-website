import { useDeliveryDashboard } from "../../../../hooks/employee/delivery/useDeliveryDB";
import DeliveryMap from "./components/DeliveryMap";
import PermissionModal from "./components/PermissionModal";
import PhotoCaptureModal from "./components/PhotoCaptureModal";
import OdometerCaptureModal from "./components/PhotoCaptureModal";

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

  const { locationModal, cameraModal, livePhotoModal, odometerModal } = modals;

  const currentLocation = { lat: 50.9375, lng: 6.9603 };

  return (
    <div className="relative bg-[#8b8a8a47] min-h-screen">
      <DeliveryMap currentLocation={currentLocation} dropPoints={[]} />

      {/* Location Permission Modal */}
      <PermissionModal
        isOpen={locationModal.isOpen}
        onClose={locationModal.onClose}
        modalRef={locationModal.ref}
        onAllow={() => {
          handleLocationPermission(); // ✅ Use hook function
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
          handleCameraCapture(); // ✅ Use hook function
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
        handleCapture={handleTakePhoto} // ✅ Proceed after photo
        onDiscard={handleDiscardLivePhoto}
        capturedImage={capturedPhoto}
        handleConfirm={handleConfirmPhoto}
        handleRetake={() => handleRetake(setCapturedPhoto)}
      />

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

      {/* Online Status Button */}
      {onlineStatus === false && (
        <div
          className="rounded-full bg-black absolute bottom-10 md:left-[45%] left-1/2 -translate-x-1/2 w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 z-[100] text-white flex items-center justify-center animate-bounceY cursor-pointer"
          style={{ boxShadow: "0px 0px 5px 5px rgba(0,0,0,1)" }}
          onClick={handleToggleStatus}
        >
          Let&#39;s Roll
        </div>
      )}

      {/* Profile Button */}
      <div
        className="absolute top-10 right-10 h-10 w-10 rounded-2xl bg-gray-300 z-[100] p-1 cursor-pointer hover:opacity-90 active:scale-95"
        onClick={handleLogout}
      >
        <img
          src="https://plus.unsplash.com/premium_photo-1689977927774-401b12d137d6?q=80&w=2070&auto=format&fit=crop"
          alt="Profile"
          className="object-cover !h-8 w-8 rounded-2xl"
        />
      </div>
    </div>
  );
}

export default DeliveryDashboard;
