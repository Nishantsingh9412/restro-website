import PropTypes from "prop-types";

export const Input = ({ label, type = "text", ...props }) => (
  <div className="mb-4">
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
    )}
    <input
      type={type}
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      {...props}
    />
  </div>
);

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
};
