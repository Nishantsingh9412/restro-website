import PropTypes from "prop-types";
import Modal from "../../../../../components/UI/Modal";
import PrimaryActionButton from "../../../../../components/UI/PrimaryActionButton";
import { Input } from "../../../../../components/common/InputField";
function PhotoCaptureModal({
  isOpen,
  onClose,
  modalRef,
  onDiscard,
  cameraPreview,
  header = "",
  capturedImage,
  handleCapture,
  handleRetake,
  handleConfirm,
  inputField,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      modalRef={modalRef}
      center={false}
      maxWidth="max-w-sm sm:max-w-xl"
      topPos={"top-[30%]"}
    >
      <div className="p-5 flex flex-col items-center">
        {/* Heading */}
        <h3 className="!font-semibold !text-lg text-center">{header} Photo</h3>

        {/* Camera or Image Preview */}
        <div className="my-3 w-full h-64 bg-black overflow-hidden flex items-center justify-center">
          {capturedImage ? (
            <img
              src={URL.createObjectURL(capturedImage)}
              alt="Captured"
              className="w-full h-full object-cover"
            />
          ) : cameraPreview ? (
            <video
              ref={cameraPreview}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-400">Camera preview unavailable</span>
          )}
        </div>

        {inputField && capturedImage && (
          <Input
            type={"number"}
            label="Enter Odometer Reading"
            value={inputField.value}
            required={true}
            onChange={(e) => inputField.onChange(e.target.value)}
          />
        )}

        {/* Buttons */}
        <div className="flex gap-4 mt-2">
          {capturedImage ? (
            <>
              <PrimaryActionButton
                className="h-8 w-28 rounded-lg flex items-center justify-center !border border-gray-500"
                textColor="!text-slate-600"
                bgColor="!bg-white hover:!bg-[#f0f0f0]"
                onClick={handleRetake}
              >
                Retake
              </PrimaryActionButton>
              <PrimaryActionButton
                className="h-8 w-28 rounded-lg flex items-center justify-center"
                bgColor="!bg-emp-button hover:!bg-[#25314CEC]"
                onClick={handleConfirm}
              >
                Confirm
              </PrimaryActionButton>
            </>
          ) : (
            <>
              <PrimaryActionButton
                className="h-8 w-28 rounded-lg flex items-center justify-center !border border-gray-500"
                textColor="!text-slate-600"
                bgColor="!bg-white hover:!bg-[#f0f0f0]"
                onClick={onDiscard}
              >
                Discard
              </PrimaryActionButton>
              <PrimaryActionButton
                className="h-8 w-28 rounded-lg flex items-center justify-center"
                bgColor="!bg-emp-button hover:!bg-[#25314CEC]"
                onClick={handleCapture}
              >
                Capture
              </PrimaryActionButton>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}

PhotoCaptureModal.propTypes = {
  header: PropTypes.string,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  modalRef: PropTypes.any,
  handleCapture: PropTypes.func, // Called when confirmed with image data
  handleRetake: PropTypes.func, // Called when confirmed with image data
  handleConfirm: PropTypes.func, // Called when confirmed with image data
  onDiscard: PropTypes.func,
  capturedImage: PropTypes.any,
  cameraPreview: PropTypes.any, // video element ref for live preview
  inputField: PropTypes.shape({
    value: PropTypes.number,
    onChange: PropTypes.func,
  }),
};

export default PhotoCaptureModal;
