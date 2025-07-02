import PropTypes from "prop-types";
import { IoMdClose } from "react-icons/io";
import { useScreen } from "../../hooks/useScreen";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-md",
  showCloseIcon = true,
  innerClassName = "",
  modalRef = null,
}) => {
  const { isLargeScreen } = useScreen();

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className={`bg-white rounded-xl shadow-2xl w-full  ${maxWidth}  animate-fadeIn  ${
        isLargeScreen
          ? "top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] absolute z-200 "
          : " fixed z-200 top-[20%] left-[50%] translate-x-[-50%] translate-y-[0%]"
      }`}
    >
      {/* Modal Header */}
      {title && (
        <div className="flex items-center justify-between px-6 py-2 !border-b">
          <h2 className="!text-lg !font-medium text-primary">{title}</h2>
          {showCloseIcon && (
            <button
              className="text-gray-400 hover:text-gray-700 !text-2xl !font-medium focus:outline-none"
              onClick={onClose}
              aria-label="Close"
            >
              <IoMdClose />
            </button>
          )}
        </div>
      )}

      {/* Modal Body */}
      <div className={`${innerClassName}`}>{children}</div>
      {/* Modal Footer */}
      {/* <div className="flex justify-end pt-6 border-t mt-4">
        <button
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
          onClick={handleClose}
        >
          Close
        </button>
      </div> */}
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  maxWidth: PropTypes.string,
  center: PropTypes.bool,
  showCloseIcon: PropTypes.bool,
  innerClassName: PropTypes.string,
  modalRef: PropTypes.any,
};

export default Modal;
