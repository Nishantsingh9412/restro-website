import PropTypes from "prop-types";
import Modal from "../../../../../components/UI/Modal";

const ViewCode = ({ isOpen, onClose, barCodeData, ref }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={barCodeData?.item?.itemName}
      modalRef={ref}
      maxWidth="max-w-sm"
      innerClassName="px-4 py-5"
    >
      <div className="flex flex-col items-center">
        <img
          src={barCodeData?.url}
          alt="Barcode"
          className="max-w-full h-auto"
        />
      </div>
    </Modal>
  );
};
ViewCode.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  barCodeData: PropTypes.shape({
    url: PropTypes.string,
    item: PropTypes.shape({
      itemName: PropTypes.string,
    }),
  }),
  ref: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
};

export default ViewCode;
