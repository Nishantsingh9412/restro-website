import { memo } from "react";
import PropTypes from "prop-types";
import { FaShoppingCart } from "react-icons/fa";

// Tailwind bounce animation is used via animate-bounce
const EmptyCart = ({ message }) => {
  return (
    <div className="text-center py-10 px-6 my-25">
      {/* Cart icon with bounce animation */}
      <div
        className="mx-auto mb-6 w-[50px] h-[50px] relative animate-bounce"
        aria-label="Empty cart icon"
      >
        <FaShoppingCart size="100%" className="text-gray-400 w-full h-full" />
      </div>
      {/* Heading for empty cart */}
      <h2 className="text-2xl md:text-3xl font-bold mt-6 mb-2 text-gray-500">
        Your Cart is Empty
      </h2>
      {/* Message for empty cart */}
      <p className="text-gray-500">
        {message || "Looks like you haven't added anything to your cart yet."}
      </p>
    </div>
  );
};

EmptyCart.propTypes = {
  message: PropTypes.string,
};

export default memo(EmptyCart);
