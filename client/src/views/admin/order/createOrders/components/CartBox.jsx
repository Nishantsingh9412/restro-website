import { memo, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import CartItem from "./CartItem";
import EmptyCart from "./EmptyCart";
import {
  removeFromCart,
  updateQuantity,
} from "../../../../../redux/action/cartItems";
import PropTypes from "prop-types";
import { formatToGermanCurrency } from "../../../../../utils/utils";
import PrimaryActionButton from "../../../../../components/UI/PrimaryActionButton";
import { FaArrowCircleRight } from "react-icons/fa";

const CartBox = memo(({ handleOnProceed }) => {
  const dispatch = useDispatch();

  const cart = useSelector(
    (state) =>
      state?.cart?.guestsCart?.guest || { items: [], totalOrderPrice: 0 }
  );
  const allCartItems = useMemo(() => cart?.items || [], [cart]);
  const allOrderItemsTotal = useMemo(() => cart?.totalOrderPrice || 0, [cart]);

  const handleRemoveItemOrder = (cartItemId) => {
    if (cartItemId) {
      dispatch(removeFromCart(cartItemId));
    }
  };

  const handleUpdateItemOrder = (cartItemId, quantityChange) => {
    dispatch(updateQuantity({ cartItemId, quantityChange }));
  };

  return (
    <div className="max-h-[600px] overflow-y-auto flex flex-col flex-1 w-full max-w-[400px] items-center p-4 rounded-xl !border  !border-blue-300">
      {Array.isArray(allCartItems) && allCartItems.length > 0 ? (
        <>
          <div className="w-full">
            {allCartItems.map((item) => (
              <CartItem
                key={item.cartItemId}
                item={item}
                onRemove={handleRemoveItemOrder}
                onUpdate={handleUpdateItemOrder}
              />
            ))}
          </div>
          <div className="w-full bg-white p-2 rounded-md shadow">
            <div className="flex justify-between items-center !border-b !border-gray-200 pb-2 mb-4">
              <span className="font-semibold text-lg text-gray-700">
                Subtotal:
              </span>
              <span className="font-bold text-lg text-[#029CFF]">
                {formatToGermanCurrency(allOrderItemsTotal)}
              </span>
            </div>

            <div className="flex justify-center">
              <PrimaryActionButton
                bgColor="!bg-blue-500 hover:!bg-blue-600 font-medium"
                onClick={handleOnProceed}
                disabled={
                  !Number.isFinite(allOrderItemsTotal) ||
                  allOrderItemsTotal <= 0
                }
              >
                Proceed To Checkout
                <FaArrowCircleRight />
              </PrimaryActionButton>
            </div>
          </div>
        </>
      ) : (
        <EmptyCart />
      )}
    </div>
  );
});

CartBox.propTypes = {
  handleOnProceed: PropTypes.func.isRequired,
};

CartBox.displayName = "CartBox";

export default CartBox;
