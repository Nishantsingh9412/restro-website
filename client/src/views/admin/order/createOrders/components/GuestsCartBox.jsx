import CartItem from "./CartItem";
import EmptyCart from "./EmptyCart";
import PropTypes from "prop-types";
import { guestTypes } from "../../../../../utils/constant";
import { formatToGermanCurrency } from "../../../../../utils/utils";
import { FaArrowCircleRight } from "react-icons/fa";
import PrimaryActionButton from "../../../../../components/UI/PrimaryActionButton";
import { useGuestsCartLogic } from "../../../../../hooks/useGuestCartLogic";

const GuestsCartBox = ({ handleOnProceed }) => {
  const {
    guests,
    currentGuest,
    selectedGuest,
    allCartItems,
    allOrderItemsTotal,
    guestsCart,
    handleOnSubmit,
    handleGuestChange,
    handleRemoveItemOrder,
    handleUpdateItemOrder,
  } = useGuestsCartLogic(handleOnProceed);

  return (
    <div className="max-h-[600px] overflow-y-auto flex flex-col flex-1 w-full max-w-[400px] items-center p-4 rounded-xl !border !border-blue-300">
      {/* Guest Tabs */}
      {Array.isArray(guests) && guests.length > 0 && (
        <div className="flex overflow-x-auto !border-b !border-gray-200 mb-4 w-full">
          {[{ name: guestTypes.GUEST, label: "All Guests" }, ...guests].map(
            (guest, index) => (
              <div
                key={index}
                onClick={() => handleGuestChange(guest.name)}
                className={`px-4 py-2 cursor-pointer whitespace-nowrap ${
                  selectedGuest === guest.name
                    ? "!border-b-2 !border-[#029CFF] !text-[#029CFF] !font-semibold"
                    : "!text-gray-600"
                }`}
              >
                {guest.label || guest.name}
              </div>
            )
          )}
        </div>
      )}
      {Array.isArray(allCartItems) && allCartItems.length > 0 ? (
        <>
          <div className="w-full flex-1 overflow-y-auto mb-4">
            {selectedGuest === guestTypes.GUEST
              ? Object.entries(guestsCart).map(
                  ([guestName, guestCart]) =>
                    guestName !== guestTypes.GUEST && (
                      <div key={guestName} className="mb-4">
                        <div className="font-bold text-md text-gray-600 mb-2">
                          {guestName}&apos;s Orders:
                        </div>
                        {guestCart.items.length === 0 ? (
                          <div className="text-sm text-gray-500">
                            No items in the cart.
                          </div>
                        ) : (
                          guestCart.items.map((item) => (
                            <CartItem
                              key={item.cartItemId}
                              item={item}
                              onRemove={handleRemoveItemOrder}
                              onUpdate={handleUpdateItemOrder}
                            />
                          ))
                        )}
                      </div>
                    )
                )
              : allCartItems.map((item) => (
                  <CartItem
                    key={item.cartItemId}
                    item={item}
                    onRemove={handleRemoveItemOrder}
                    onUpdate={handleUpdateItemOrder}
                  />
                ))}
          </div>
          {/* Subtotal and Proceed Button */}
          <div className="w-full bg-white p-4 rounded-md ">
            <div className="flex justify-between items-center !border-b !border-gray-200 pb-2 mb-4">
              <span className="font-semibold text-lg text-gray-700">
                Subtotal:
              </span>
              <span className="font-bold text-lg text-[#029CFF]">
                {formatToGermanCurrency(allOrderItemsTotal)}
              </span>
            </div>
            {currentGuest === guestTypes.GUEST && (
              <div className="flex justify-center">
                <PrimaryActionButton
                  bgColor="!bg-blue-500 hover:!bg-blue-600 font-medium"
                  onClick={handleOnSubmit}
                  disabled={allOrderItemsTotal <= 0}
                >
                  Proceed to Checkout
                  <FaArrowCircleRight />
                </PrimaryActionButton>
              </div>
            )}
          </div>
        </>
      ) : (
        <EmptyCart />
      )}
    </div>
  );
};

// Prop type validation for the component
GuestsCartBox.propTypes = {
  handleOnProceed: PropTypes.func.isRequired,
};

export default GuestsCartBox;
