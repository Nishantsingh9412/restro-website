import PropTypes from "prop-types";
import { MdClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FiFile, FiLogOut, FiSettings, FiUser } from "react-icons/fi";

function QuickActionModal({ onLogout, onClose }) {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg p-4 w-80 flex flex-col gap-2">
        <button
          className="mt-2 !text-xl text-gray-600 flex justify-end "
          onClick={onClose}
        >
          <MdClose />
        </button>

        <button
          className="flex items-center gap-2 !px-4 !py-2 rounded-lg !bg-[#8b8a8a47] hover:!bg-[#2563EB] hover:!text-white transition"
          onClick={() => {
            onClose();
            navigate("/employees/profile");
          }}
        >
          <FiUser className="text-xl" />
          Profile
        </button>
        <button
          className="flex items-center gap-2 !px-4 !py-2 rounded-lg !bg-[#8b8a8a47] hover:!bg-[#2563EB] hover:!text-white transition"
          onClick={() => {
            onClose();
            navigate("/employees/documents");
          }}
        >
          <FiFile className="text-xl" />
          Documents
        </button>
        <button
          className="flex items-center gap-2 !px-4 !py-2 rounded-lg !bg-[#8b8a8a47] hover:!bg-[#2563EB] hover:!text-white transition"
          onClick={() => {
            // onClose();
            // onToggleOffline();
          }}
        >
          <FiSettings />
          Settings
        </button>
        <button
          className="flex items-center gap-2 !px-4 !py-2 rounded-lg !bg-[#8b8a8a47] hover:!bg-[#2563EB] hover:!text-white transition"
          onClick={() => {
            onClose();
            onLogout();
          }}
        >
          <FiLogOut className="text-xl" />
          Logout
        </button>
      </div>
    </div>
  );
}
QuickActionModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default QuickActionModal;
