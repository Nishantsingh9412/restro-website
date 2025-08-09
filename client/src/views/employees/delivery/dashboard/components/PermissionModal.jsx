import PropTypes from "prop-types";
import Modal from "../../../../../components/UI/Modal";
import PrimaryActionButton from "../../../../../components/UI/PrimaryActionButton";

function PermissionModal({
  isOpen,
  onClose,
  modalRef,
  onAllow,
  onDiscard,
  title,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      modalRef={modalRef}
      center={false}
      maxWidth="max-w-sm sm:max-w-xl"
    >
      <div className="p-5">
        <h3 className="!font-semibold">{title} Permission</h3>
        <p className="!mt-5 !mb-3 text-gray-400">
          Please grant {title.toLowerCase()} access to proceed.
        </p>
        <div className="float-end mx-3 mb-5 flex gap-4">
          <PrimaryActionButton
            className={
              "h-8 w-28 rounded-lg flex items-center justify-center !border border-gray-500 "
            }
            textColor={"!text-slate-600"}
            bgColor="!bg-white hover:!bg-[#f0f0f0]"
            onClick={onDiscard}
          >
            Discard
          </PrimaryActionButton>
          <PrimaryActionButton
            className={"h-8 w-28 rounded-lg flex items-center justify-center"}
            bgColor="!bg-emp-button hover:!bg-[#25314CEC]"
            onClick={onAllow}
          >
            Allow
          </PrimaryActionButton>
        </div>
      </div>
    </Modal>
  );
}

export default PermissionModal;

PermissionModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.bool,
  modalRef: PropTypes.any,
  title: PropTypes.string,
  onAllow: PropTypes.func,
  onDiscard: PropTypes.func,
};
