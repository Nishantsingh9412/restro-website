import PropTypes from "prop-types";
import Modal from "../../../../../components/UI/Modal";
import { FaStar } from "react-icons/fa";
import { FaHeartPulse } from "react-icons/fa6";
import { GiRiceCooker } from "react-icons/gi";
import PrimaryActionButton from "../../../../../components/UI/PrimaryActionButton";
import { useCustomization } from "../../../../../hooks/useOrderCustomization";

const ShowItemModal = ({ item, isOpen, onClose, ref, handleAddToCart }) => {
  const {
    showToast,
    getFinalOrder,
    handleOptionChange,
    validateSelections,
    customizationSelections,
  } = useCustomization(item);

  const onAddToCart = () => {
    const isValid = validateSelections();

    if (!isValid) {
      showToast(
        "Please complete all required customizations and adhere to selection limits.",
        "error"
      );
      return;
    }

    const finalOrder = getFinalOrder();
    handleAddToCart(finalOrder);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-2xl"
      modalRef={ref}
    >
      <div className="bg-white rounded-2xl shadow-lg w-full mx-auto relative">
        {/* Body */}
        <div className="p-4">
          <div className="mb-4 bg-[#f9f4f2] flex items-start justify-center gap-4 p-4 rounded-md">
            {/* Image */}
            <img
              src={item?.pic}
              alt={item.itemName}
              className="w-64 !h-64 object-cover rounded-xl "
            />
            {/* Details */}
            <div className="flex flex-col flex-1 gap-2">
              <h3 className="font-bold !text-2xl text-gray-700">
                {item.itemName}
              </h3>
              <div className="flex w-full items-center justify-between gap-2">
                <div className="px-3 py-0.5 bg-yellow-300 rounded-lg text-center text-gray-500 text-sm ">
                  {"Lunch"}
                </div>
                <div className="text-gray-400 text-xs flex items-center gap-1">
                  <span className="text-yellow-500">
                    <FaStar />
                  </span>
                  <p> 4.8/5 (125 reviews)</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex gap-2">
                  <div className="bg-white p-2 rounded-md shadow-2xs">
                    <FaHeartPulse />
                  </div>
                  <div className="">
                    <p className="text-gray-400 !text-xs">Health Score</p>
                    <p className="font-semibold text-xs">85/100</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="bg-white p-2 rounded-md shadow-2xs">
                    <GiRiceCooker />
                  </div>
                  <div className="">
                    <p className="text-gray-400 !text-xs">Cook Duration</p>
                    <p className="font-semibold text-xs">10 minutes</p>
                  </div>
                </div>
              </div>
              {/* Description */}
              <div className=" text-sm text-gray-700 font-medium ">
                Description:{" "}
                <span role="img" aria-label="book">
                  📖
                </span>
                <div className="text-gray-500 text-xs">
                  {item.description || "No description available."}
                </div>
              </div>
              {/* {/* Ingredients */}
              <div className="text-sm text-gray-700 font-medium">
                Ingredients:{" "}
                <span role="img" aria-label="ingredients">
                  🍴
                </span>
                <div className="text-xs text-gray-500">
                  {item.ingredients?.length > 0
                    ? item.ingredients.join(", ")
                    : "No ingredients listed."}
                </div>
              </div>
            </div>
          </div>

          {/* Customizations */}
          {item.customization.map((custom) => (
            <div key={custom._id} className="mb-3">
              <div className="flex items-center mb-2">
                <span className="font-bold text-base">{custom.title}</span>
                {custom.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
                <span className="text-gray-500 text-sm ml-2">
                  (Max: {custom.maxSelect}) ⚙️
                </span>
              </div>
              <div className="" />
              {/* Radio (single select) */}
              {custom.maxSelect === 1 ? (
                // Radio (single select) as card buttons in a row
                <div className="flex flex-wrap gap-2">
                  {custom.option.map((opt) => {
                    const isSelected =
                      (customizationSelections[custom._id] || [])[0] ===
                      opt.name;
                    return (
                      <label
                        key={opt._id}
                        className={`flex flex-col items-center justify-center text-sm cursor-pointer rounded-lg !border p-1 min-w-[100px] transition
                          ${
                            isSelected
                              ? "bg-blue-500 !border-blue-500 text-white shadow"
                              : "bg-white border-gray-300 text-gray-700 hover:border-blue-400"
                          }
                        `}
                      >
                        <input
                          type="radio"
                          name={custom._id}
                          value={opt.name}
                          checked={isSelected}
                          onChange={() =>
                            handleOptionChange(custom._id, [opt.name])
                          }
                          className="hidden"
                        />
                        <span className="font-medium">{opt.name}</span>
                        <span className="text-xs mt-1">(+{opt.price}€)</span>
                      </label>
                    );
                  })}
                </div>
              ) : (
                // Checkbox (multi select) as card buttons in a row
                <div className="flex flex-wrap gap-2">
                  {custom.option.map((opt) => {
                    const isChecked = (
                      customizationSelections[custom._id] || []
                    ).includes(opt.name);
                    return (
                      <label
                        key={opt._id}
                        className={`flex flex-col items-center justify-center cursor-pointer text-sm rounded-lg !border p-1 min-w-[100px] transition
                          ${
                            isChecked
                              ? "bg-blue-500 border-blue-500 text-white shadow"
                              : "bg-white border-gray-300 text-gray-700 hover:border-blue-400"
                          }
                        `}
                      >
                        <input
                          type="checkbox"
                          name={`${custom._id}-${opt.name}`}
                          value={opt.name}
                          checked={isChecked}
                          onChange={(e) => {
                            const prev =
                              customizationSelections[custom._id] || [];
                            if (e.target.checked) {
                              handleOptionChange(custom._id, [
                                ...prev,
                                opt.name,
                              ]);
                            } else {
                              handleOptionChange(
                                custom._id,
                                prev.filter((name) => name !== opt.name)
                              );
                            }
                          }}
                          className="hidden"
                        />
                        <span className="font-semibold">{opt.name}</span>
                        <span className="text-xs mt-1">(+{opt.price}€)</span>
                      </label>
                    );
                  })}
                </div>
              )}
              {/* Max select warning */}
              {customizationSelections[custom._id]?.length >
                custom.maxSelect && (
                <div className="text-red-500 text-sm mt-1">
                  You can select up to {custom.maxSelect} options.
                </div>
              )}
            </div>
          ))}
        </div>
        {/* Footer */}
        <div className="flex justify-end gap-2 bg-gray-50 px-6 py-4 rounded-b-2xl">
          <PrimaryActionButton
            bgColor={"!bg-blue-500 hover:!bg-blue-600"}
            onClick={onAddToCart}
          >
            Add To Cart
          </PrimaryActionButton>
          <PrimaryActionButton
            bgColor={"!bg-red-500 hover:!bg-red-600"}
            onClick={onClose}
          >
            Cancel
          </PrimaryActionButton>
        </div>
      </div>
    </Modal>
  );
};

ShowItemModal.propTypes = {
  item: PropTypes.shape({
    itemId: PropTypes.string.isRequired,
    itemName: PropTypes.string.isRequired,
    basePrice: PropTypes.number.isRequired,
    pic: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    customization: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        required: PropTypes.bool.isRequired,
        maxSelect: PropTypes.number.isRequired,
        option: PropTypes.arrayOf(
          PropTypes.shape({
            _id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            price: PropTypes.number.isRequired,
          })
        ).isRequired,
      })
    ).isRequired,
    ingredients: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  handleAddToCart: PropTypes.func.isRequired,
  ref: PropTypes.any,
};

export default ShowItemModal;
