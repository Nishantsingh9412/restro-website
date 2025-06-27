// src/components/UI/PageLoader.jsx
import PropTypes from "prop-types";

const PageLoader = ({ size = 48, color = "#6366f1", className = "" }) => (
  <div
    className={`absolute top-[40%] left-[50%] md:left-[55%] translate-x-[-50%] translate-y-[-50%]  ${className}`}
  >
    <span
      className="inline-block animate-spin rounded-full !border-4 border-solid border-gray-200 border-t-primary"
      style={{ width: size, height: size, borderTopColor: color }}
      role="status"
      aria-label="Loading"
    />
  </div>
);

PageLoader.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  className: PropTypes.string,
};

export default PageLoader;
