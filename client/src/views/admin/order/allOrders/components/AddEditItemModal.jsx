import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useToast } from "../../../../../contexts/useToast";
import {
  formatToGermanCurrency,
  parseGermanCurrency,
} from "../../../../../utils/utils";
import { Input } from "../../../../../components/common/InputField"; // Import Input component

const AddEditItemModal = (props) => {
  const initialState = {
    itemId: null,
    itemName: "",
    category: "",
    pic: "",
    basePrice: "",
    // priceUnit: "",
    prepTime: "",
    description: "",
    // inStock: false,
    ingredients: "",
    isFavourite: false,
  };

  const showToast = useToast();
  const { isOpen, onClose, onSubmit, itemData } = props;
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState(initialState);
  const [customization, setCustomization] = useState([]);

  const handleAddCustomization = () => {
    setCustomization([
      ...customization,
      {
        title: "",
        required: false,
        maxSelect: 1,
        option: [{ name: "", price: "" }],
      },
    ]);
  };

  const handleAddOption = (groupIndex) => {
    const updatedCustomization = [...customization];
    updatedCustomization[groupIndex].option.push({ name: "", price: "" });
    setCustomization(updatedCustomization);
  };

  const handleOptionChange = (groupIndex, optionIndex, field, value) => {
    const updatedCustomization = [...customization];
    updatedCustomization[groupIndex].option[optionIndex][field] = value;
    setCustomization(updatedCustomization);
  };

  const handleGroupChange = (groupIndex, field, value) => {
    const updatedCustomization = [...customization];
    updatedCustomization[groupIndex][field] = value;
    setCustomization(updatedCustomization);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClose = () => {
    onClose();
    setItem(initialState);
    setCustomization([]);
  };

  // Function to handle image upload
  const postOrderImage = async (pics) => {
    setLoading(true);
    if (pics === undefined) {
      showToast("Please upload a picture", "error");
      setLoading(false);
      return;
    }
    if (pics.type !== "image/jpeg" && pics.type !== "image/png") {
      showToast("Invalid image format", "error");
      setLoading(false);
      return;
    }
    if (pics.size > 2000000) {
      setLoading(false);
      return showToast("Image size should be less than 2 MB ", "error");
    }

    const data = new FormData();
    data.append("file", pics);
    data.append("upload_preset", "restro-website");
    data.append("cloud_name", "dezifvepx");
    fetch("https://api.cloudinary.com/v1_1/dezifvepx/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setItem((prevState) => ({
          ...prevState,
          pic: data.url.toString(),
        }));
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        return showToast(err.message, "error");
      });
  };

  // Function to validate the form data
  const validate = () => {
    const requiredFields = ["itemId", "itemName", "category", "basePrice"];
    for (const field of requiredFields) {
      if (
        !item[field] ||
        (typeof item[field] === "string" && item[field].trim() === "")
      ) {
        showToast(
          `Please enter ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`,
          "error"
        );
        return true;
      }
    }
    for (const group of customization) {
      if (group.option.length === 0) {
        showToast(
          "Please add at least one option to each customization group",
          "error"
        );
        return true;
      }
      for (const opt of group.option) {
        if (
          !opt.name ||
          (typeof opt.name === "string" && opt.name.trim() === "")
        ) {
          showToast(`Please enter option name for ${group.title}`, "error");
          return true;
        }
        if (
          !opt.price ||
          (typeof opt.price === "string" && opt.price.trim() === "")
        ) {
          showToast(`Please enter option price for ${group.title}`, "error");
          return true;
        }
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert the base price into a number
    item.basePrice = parseGermanCurrency(item.basePrice);

    // Convert the price of each option into a number
    customization.forEach((group) => {
      group.option.forEach((opt) => {
        opt.price = parseGermanCurrency(opt.price);
      });
    });

    // Convert the ingredients string into an array
    item.ingredients = item.ingredients?.split(",").map((ing) => ing.trim());

    // Check if all required fields are filled
    if (validate()) {
      showToast("Please fill all required fields", "error");
      return;
    }

    const payload = {
      ...item,
      customization,
    };
    onSubmit(payload);
    handleClose();
  };

  useEffect(() => {
    if (itemData) {
      // Set the item state with the provided itemData
      setItem({
        ...itemData,
        basePrice: itemData?.basePrice
          ? formatToGermanCurrency(itemData?.basePrice) // Format basePrice to German currency
          : "", // Default to an empty string if basePrice is not provided
        ingredients: itemData?.ingredients?.join(", ") || "", // Convert array to string
      });

      // Set the customization state with formatted prices
      setCustomization(
        Array.isArray(itemData?.customization) // Check if customization is an array
          ? itemData.customization.map((group) => ({
              ...group, // Spread the group properties
              option: group.option.map((opt) => ({
                ...opt, // Spread the option properties
                price: formatToGermanCurrency(opt.price), // Format the price to German currency
              })),
            }))
          : [] // Default to an empty array if customization is not provided
      );
    }
  }, [itemData]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto relative">
        <div className="flex items-center justify-between bg-blue-500 text-white px-6 py-4 rounded-t-2xl">
          <span className="font-bold text-lg">
            {props.itemData ? "Edit Item" : "Add Item"}
          </span>
          <button
            className="text-white text-2xl font-bold hover:text-blue-200 transition"
            onClick={handleClose}
            aria-label="Close"
            type="button"
          >
            &times;
          </button>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Item ID */}
            <Input
              id="itemId"
              label="Item ID"
              type="text"
              name="itemId"
              value={item.itemId}
              onChange={handleChange}
              required
            />
            {/* Item Name */}
            <Input
              id="itemName"
              label="Item Name"
              type="text"
              name="itemName"
              value={item.itemName}
              onChange={handleChange}
              required
            />
            {/* Category */}
            <Input
              id="category"
              label="Item Category"
              type="text"
              name="category"
              value={item.category}
              onChange={handleChange}
              required
            />
            {/* Base Price */}
            <Input
              id="basePrice"
              label="Base Price"
              type="text"
              name="basePrice"
              value={item.basePrice}
              onChange={handleChange}
              required
            />
            {/* Add Customization Button */}
            <button
              type="button"
              className="w-full mt-2 mb-2 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
              onClick={handleAddCustomization}
            >
              Add Customization
            </button>
            {/* Customization Groups */}
            {customization.map((group, groupIndex) => (
              <div
                key={groupIndex}
                className="border p-4 rounded-md mt-2 relative"
              >
                <button
                  type="button"
                  className="absolute top-2 right-2 text-red-500 text-lg font-bold hover:text-red-700"
                  onClick={() =>
                    setCustomization((prev) =>
                      prev.filter((_, index) => index !== groupIndex)
                    )
                  }
                >
                  ✕
                </button>
                <div className="flex gap-2">
                  <Input
                    id={`customizationGroup${groupIndex}`}
                    label="Group Title"
                    type="text"
                    value={group.title}
                    onChange={(e) =>
                      handleGroupChange(groupIndex, "title", e.target.value)
                    }
                    required
                  />
                  <div className="flex flex-col flex-1">
                    <label className="text-sm font-medium mb-1">
                      Max Select
                    </label>
                    <input
                      type="number"
                      min={1}
                      className="border border-gray-300 rounded-md px-3 py-2"
                      value={group.maxSelect}
                      onChange={(e) =>
                        handleGroupChange(
                          groupIndex,
                          "maxSelect",
                          e.target.value
                        )
                      }
                      required
                    />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <label className="text-sm font-medium mr-2">Required</label>
                  <input
                    type="checkbox"
                    checked={group.required}
                    onChange={(e) =>
                      handleGroupChange(
                        groupIndex,
                        "required",
                        e.target.checked
                      )
                    }
                    className="accent-teal-500"
                  />
                </div>
                {/* Options */}
                {group.option.map((opt, optionIndex) => (
                  <div
                    key={optionIndex}
                    className="flex gap-2 items-center mt-2"
                  >
                    <Input
                      id={`optionName${groupIndex}-${optionIndex}`}
                      label="Option Name"
                      type="text"
                      value={opt.name}
                      onChange={(e) =>
                        handleOptionChange(
                          groupIndex,
                          optionIndex,
                          "name",
                          e.target.value
                        )
                      }
                      required
                    />
                    <Input
                      id={`optionPrice${groupIndex}-${optionIndex}`}
                      label="Option Price"
                      type="text"
                      value={opt.price}
                      onChange={(e) =>
                        handleOptionChange(
                          groupIndex,
                          optionIndex,
                          "price",
                          e.target.value
                        )
                      }
                      required
                    />
                    {group.option.length > 1 && (
                      <button
                        type="button"
                        className="text-red-500 text-lg font-bold hover:text-red-700"
                        onClick={() => {
                          const updatedOptions = [...customization];
                          updatedOptions[groupIndex].option = updatedOptions[
                            groupIndex
                          ].option.filter((_, index) => index !== optionIndex);
                          setCustomization(updatedOptions);
                        }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="mt-2 px-4 py-1 rounded bg-green-500 text-white font-semibold hover:bg-green-600 transition"
                  onClick={() => handleAddOption(groupIndex)}
                >
                  Add Option
                </button>
              </div>
            ))}
            {/* Upload Picture */}
            <div className="mt-2">
              <label className="block text-sm font-medium mb-1">
                Upload Picture
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => postOrderImage(e.target.files[0])}
                className="block w-full text-sm text-gray-500"
              />
              <div className="text-xs text-gray-400">{item.pic}</div>
            </div>
            {/* Ingredients */}
            <Input
              id="ingredients"
              label="Ingredients"
              type="text"
              name="ingredients"
              value={item.ingredients}
              onChange={handleChange}
              required={false}
            />
            {/* Preparation Time */}
            <Input
              id="prepTime"
              label="Preparation Time"
              type="text"
              name="prepTime"
              value={item.prepTime}
              onChange={handleChange}
              required
            />
            {/* Description */}
            <div className="mt-2">
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={item.description}
                onChange={handleChange}
                placeholder="e.g., A classic pizza with fresh mozzarella and basil."
                rows={3}
                className="w-full !border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200"
              />
            </div>

            {/* Favourite Switch */}
            <div className="flex items-center mt-2">
              <label className="text-sm font-medium mr-2">Favourite</label>
              <input
                type="checkbox"
                checked={item.isFavourite}
                onChange={() =>
                  setItem((prevState) => ({
                    ...prevState,
                    isFavourite: !prevState.isFavourite,
                  }))
                }
                className="accent-teal-500"
              />
            </div>
            <button
              type="submit"
              className="mt-4 w-full py-2 rounded bg-teal-500 text-white font-semibold hover:bg-teal-600 transition"
              disabled={loading}
            >
              {props.itemData ? "Update Item" : "Add Item"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEditItemModal;

AddEditItemModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  itemData: PropTypes.object,
};
