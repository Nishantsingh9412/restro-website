import PropTypes from "prop-types";
import { IoMdClose } from "react-icons/io";
import { useScreen } from "../../hooks/useScreen";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-md",
  border = "!border !border-gray-200",
  showCloseIcon = true,
  innerClassName = "",
  modalRef = null,
  center = true, // new prop
  topPos = 15,
}) => {
  const { isLargeScreen } = useScreen();

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className={`bg-white rounded-xl shadow-2xl w-full ${maxWidth} ${border} animate-fadeIn max-h-4/5 overflow-y-auto ${
        isLargeScreen
          ? center
            ? // If centered
              "top-[50%] left-[55%] translate-x-[-50%] translate-y-[-50%] fixed z-200"
            : // If not centered → vertically center, slightly lower horizontally
              `top-[${topPos}%] left-[55%] translate-x-[-50%] translate-y-[-50%] fixed z-200`
          : center
          ? "fixed z-200 top-[20%] left-[50%] translate-x-[-50%] translate-y-[0%]"
          : "fixed z-200 top-[30%] left-[50%] translate-x-[-50%] translate-y-[0%]"
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
      <div className={innerClassName}>{children}</div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  maxWidth: PropTypes.string,
  center: PropTypes.bool, // added
  border: PropTypes.string,
  showCloseIcon: PropTypes.bool,
  innerClassName: PropTypes.string,
  modalRef: PropTypes.any,
  topPos: PropTypes.number,
};

export default Modal;
