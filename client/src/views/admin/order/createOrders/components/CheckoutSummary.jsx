import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import { FaForward, FaShoppingCart, FaUser } from "react-icons/fa";
import {
  addTakeAwayOrderAPI,
  addDineInOrderAPI,
  addDeliveryOrderAPI,
} from "../../../../../api";
import {
  formatToGermanCurrency,
  formatKey,
  formatValue,
} from "../../../../../utils/utils";
import {
  setDineInInfo,
  setDeliveryInfo,
  setTakeAwayInfo,
} from "../../../../../redux/action/customerInfo";
import { guestTypes, orderTypes } from "../../../../../utils/constant";
import { useToast } from "../../../../../contexts/useToast";
import { localStorageData } from "../../../../../utils/constant";
import ThankYouModal from "./ThankYouModal";
import PrimaryActionButton from "../../../../../components/UI/PrimaryActionButton";

const CheckoutSummary = ({ isOpen, onClose, ref }) => {
  const showToast = useToast();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const orderDetails = useSelector((state) => state.customerInfo);
  const orderType = useSelector((state) => state.cart.orderType);
  const { guestsCart } = useSelector((state) => state?.cart);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Memoized value for all cart items (either for all guests or a specific guest)
  const allCartItems = useMemo(() => {
    // Merge all guests' items into a single array
    return Object.keys(guestsCart).flatMap((guestName) =>
      (guestsCart[guestName].items || []).map((item) => ({
        ...item,
        guestName: guestName,
      }))
    );
  }, [guestsCart]);

  // Memoized value for the total price of all order items
  const allOrderItemsTotal = useMemo(() => {
    // Calculate the total for all guests
    return Object.values(guestsCart).reduce(
      (total, guestCart) => total + (guestCart.totalOrderPrice || 0),
      0
    );
  }, [guestsCart]);

  const userId = useMemo(
    () =>
      JSON.parse(localStorage.getItem(localStorageData.PROFILE_DATA))?.result
        ?._id,
    []
  );

  // Filter out empty values and specific keys
  const filterOrderDetails = (details) => {
    return Object.entries(details).filter(
      ([key, value]) =>
        value &&
        !key.startsWith("dropLocation") &&
        key !== "paymentMethod" &&
        value?.length > 0
    );
  };

  // Handle the payment method for particular order type
  const handlePaymentMethodChange = (value) => {
    console.log("Selected payment method:", value);
    switch (orderType) {
      case orderTypes.DINE_IN:
        dispatch(setDineInInfo({ paymentMethod: value }));
        break;
      case orderTypes.DELIVERY:
        dispatch(setDeliveryInfo({ paymentMethod: value }));
        break;
      case orderTypes.TAKE_AWAY:
        dispatch(setTakeAwayInfo({ paymentMethod: value }));
        break;
      default:
        showToast("Invalid order type", "error");
        break;
    }
  };

  // Function to get API call based on order type
  const getOrderAPICall = () => {
    switch (orderType) {
      case orderTypes.DELIVERY:
        return addDeliveryOrderAPI;
      case orderTypes.DINE_IN:
        return addDineInOrderAPI;
      case orderTypes.TAKE_AWAY:
        return addTakeAwayOrderAPI;
      default:
        return null;
    }
  };

  // Function to handle order completion
  const handleCompleteOrder = () => {
    // Check the payment method is checked or not.
    if (orderDetails[orderType]?.paymentMethod === "") {
      showToast("Please select a payment method", "error");
      return;
    }
    // Prepare the order data
    const orderData = {
      ...orderDetails[orderType],
      orderItems: allCartItems,
      totalPrice: allOrderItemsTotal,
      created_by: userId,
    };
    // You can dispatch an action or call an API to complete the order
    const apiCall = getOrderAPICall();
    if (!apiCall) {
      showToast("Invalid order type", "error");
      return;
    }
    setLoading(true);
    // Call the API to complete the order
    apiCall(orderData)
      .then((res) => {
        if (res.status === 201) {
          setLoading(false);
          setIsSuccessModalOpen(true);
          showToast("Order completed successfully", "success");
        }
      })
      .catch((error) => {
        setLoading(false);
        showToast(
          error?.response?.data?.message || "Error completing order",
          "error"
        );
      });
  };

  return (
    <>
      {isSuccessModalOpen && (
        <ThankYouModal
          isOpen={isSuccessModalOpen}
          onClose={() => setIsSuccessModalOpen(false)}
          onBack={onClose}
        />
      )}
      {/* Drawer-like overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex  ">
          {/* Drawer Content */}
          <div
            className="relative ml-auto w-full max-w-4xl h-full bg-white shadow-2xl flex flex-col"
            ref={ref}
          >
            {/* Header */}
            <div className="flex items-center px-6 py-4 !border-b bg-blue-500 text-white">
              <FaShoppingCart className="mr-2" />
              <span className="font-bold text-lg">Checkout Summary</span>
            </div>
            {/* Body */}
            <div className="flex flex-col md:flex-row gap-6 flex-1 overflow-y-auto bg-gray-50 p-6">
              {/* Left Side: User Details */}
              <div className="flex-1 bg-white  p-6">
                <div className="flex items-center mb-4">
                  <FaUser className="mr-2 text-blue-500" />
                  <span className="font-semibold text-lg text-gray-700">
                    User Details
                  </span>
                </div>
                <div className="!border-b mb-4" />
                <div className="flex flex-col gap-2">
                  {orderDetails && (
                    <>
                      {filterOrderDetails(orderDetails[orderType] || {}).map(
                        ([key, value]) => (
                          <div key={key} className="text-sm text-gray-600">
                            <strong>{formatKey(key)}:</strong>{" "}
                            {formatValue(value)}
                          </div>
                        )
                      )}
                    </>
                  )}
                </div>
                {/* Payment Method Radio Group */}
                <div className="my-2">
                  <label className="block text-sm text-gray-600 font-bold mb-2">
                    Payment Method:
                  </label>
                  <div className="flex gap-4">
                    {["cash", "card", "paypal"].map((method) => (
                      <label
                        key={method}
                        className="flex items-center gap-1 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method}
                          checked={
                            orderDetails[orderType]?.paymentMethod === method
                          }
                          onChange={() => handlePaymentMethodChange(method)}
                          className="accent-blue-500"
                        />
                        <span className="capitalize">{method}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              {/* Right Side: Live Cart */}
              <div className="flex-1 bg-white rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <FaShoppingCart className="mr-2 text-blue-500" />
                  <span className="font-semibold text-lg text-gray-700">
                    Live Cart
                  </span>
                </div>
                <div className="!border-b mb-4" />
                <div className="flex flex-col gap-2">
                  {allCartItems.length > 0 ? (
                    Object.entries(guestsCart).map(([guestName, guestCart]) => (
                      <div key={guestName}>
                        {guestName !== guestTypes.GUEST && (
                          <div className="font-bold text-md text-gray-600 mb-1">
                            {guestName}&apos;s Orders:
                          </div>
                        )}
                        {guestCart.items.map((item) => (
                          <CartItem key={item.cartItemId} item={item} />
                        ))}
                        {guestName !== guestTypes.GUEST && (
                          <>
                            <div className="text-sm text-gray-500 mt-2 text-right">
                              Total:{" "}
                              {formatToGermanCurrency(
                                guestCart?.totalOrderPrice
                              )}
                            </div>
                            <div className="border-b my-2" />
                          </>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500">
                      Your cart is empty.
                    </div>
                  )}
                </div>
                {allCartItems.length > 0 && (
                  <div className="flex justify-between items-center my-2 ">
                    <span className="text-md font-bold text-gray-700">
                      Subtotal:
                    </span>
                    <span className="text-md font-bold text-blue-500">
                      {formatToGermanCurrency(allOrderItemsTotal)}
                    </span>
                  </div>
                )}
                {allCartItems.length > 0 && (
                  <PrimaryActionButton
                    bgColor="!bg-blue-500 hover:!bg-blue-600"
                    className="w-full transition disabled:opacity-60 flex items-center justify-center gap-2"
                    onClick={handleCompleteOrder}
                    disabled={allCartItems.length === 0 || loading}
                    type="button"
                  >
                    {loading
                      ? "Processing..."
                      : `Confirm ${
                          orderType[0]?.toUpperCase() + orderType?.slice(1)
                        } Order`}
                    <span className="inline-block animate-pulse">
                      <FaForward />
                    </span>
                  </PrimaryActionButton>
                )}
              </div>
            </div>
            {/* Footer */}
            <div className="bg-gray-100 px-6 py-3 flex justify-end border-t">
              <PrimaryActionButton onClick={onClose} bgColor="!bg-yellow-500 ">
                Close
              </PrimaryActionButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

CheckoutSummary.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  ref: PropTypes.any,
};

export default CheckoutSummary;

// CartItem component (converted to Tailwind)
const CartItem = ({ item }) => {
  return (
    <div className="border rounded-lg overflow-hidden p-4 mb-4 bg-white shadow-2xs flex items-center gap-4">
      <img
        className="!w-14 !h-14 object-cover rounded-md"
        src={item?.pic || "https://via.placeholder.com/60"}
        alt={item?.itemName}
      />
      <div className="flex flex-col flex-1">
        <span className="font-bold text-md text-gray-700">
          {item?.itemName}
        </span>
        <span className="text-sm text-gray-500">
          Quantity: {item?.totalQuantity}
        </span>
        <span className="text-sm text-gray-500">
          Price: {formatToGermanCurrency(item?.price)}
        </span>
      </div>
      <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded font-semibold text-sm">
        {formatToGermanCurrency(item.totalQuantity * item.price)}
      </span>
    </div>
  );
};

CartItem.propTypes = {
  item: PropTypes.shape({
    itemName: PropTypes.string.isRequired,
    totalQuantity: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
    pic: PropTypes.string,
  }).isRequired,
};
