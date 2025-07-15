import PropTypes from "prop-types";
import { getOnlineEmployeesByRole } from "../../../../../api/index";
import { useEffect, useState } from "react";
import { FiCheckCircle, FiCircle } from "react-icons/fi";
import { CircleLoader } from "react-spinners";
import { useToast } from "../../../../../contexts/useToast";
import Modal from "../../../../../components/UI/Modal";
import PrimaryActionButton from "../../../../../components/UI/PrimaryActionButton";

export default function AllotPersonnelModal({
  ref,
  isOpen,
  onClose,
  onSubmit,
  personnelType,
}) {
  const showToast = useToast();
  const [personnels, setPersonnels] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleSubmit = () => {
    const selectedPersonnel = personnels.find((item) => item?._id === selected);
    onSubmit(selectedPersonnel);
    setSelected(null);
  };

  useEffect(() => {
    const fetchPersonnels = async () => {
      try {
        setIsLoading(true);
        const res = await getOnlineEmployeesByRole(personnelType);
        setPersonnels(res?.data?.result.length ? res.data.result : []);
      } catch (err) {
        showToast(
          err?.response?.data?.error || "Error fetching personnel",
          "error"
        );
        console.error(`Error in getting ${personnelType}`, err?.response);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchPersonnels();
    }
    setSelected(null);
  }, [isOpen, personnelType, showToast]);

  return (
    <Modal
      modalRef={ref}
      isOpen={isOpen}
      onClose={onClose}
      title={`Allot ${personnelType}`}
      maxWidth="max-w-xs sm:max-w-md"
      innerClassName="p-6"
    >
      {isLoading ? (
        <div className="flex flex-col items-center justify-center my-12 gap-3">
          <CircleLoader size={40} color="#3b82f6" />
          <span className="text-gray-500 mt-2">Loading...</span>
        </div>
      ) : personnels.length ? (
        <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
          {personnels.map((p, idx) => (
            <div
              key={p._id}
              className={`flex items-center gap-4 ${
                idx % 2 == 0 ? "bg-[#f0f0fd]" : ""
              } p-2 `}
            >
              <button
                type="button"
                onClick={() => setSelected(p._id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition font-medium
                    ${
                      selected === p._id
                        ? "bg-green-100 border-green-500 text-green-700"
                        : "bg-gray-50 border-gray-300 text-gray-700 hover:border-blue-400"
                    }`}
              >
                {selected === p._id ? (
                  <FiCheckCircle className="text-green-500" />
                ) : (
                  <FiCircle className="text-gray-400" />
                )}
                {p.name}
              </button>
              <span
                className={`text-sm ${
                  selected === p._id ? "text-green-600" : "text-gray-400"
                }`}
              >
                Completed: {p?.completedCount}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center my-12">
          <span className="text-gray-400 text-center">
            No {personnelType} is available at this moment
          </span>
        </div>
      )}

      <div className="flex justify-end gap-2 mt-8">
        <PrimaryActionButton
          onClick={onClose}
          disabled={isLoading}
          bgColor="!bg-red-500 text-white hover:!bg-red-600"
        >
          Cancel
        </PrimaryActionButton>

        <PrimaryActionButton
          bgColor={
            selected
              ? "!bg-blue-500 text-white hover:!bg-blue-600"
              : "!bg-gray-300 text-gray-400"
          }
          disabled={!selected}
          onClick={handleSubmit}
        >
          Allot
        </PrimaryActionButton>
      </div>
    </Modal>
  );
}

AllotPersonnelModal.propTypes = {
  ref: PropTypes.any,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  personnelType: PropTypes.string.isRequired,
};
