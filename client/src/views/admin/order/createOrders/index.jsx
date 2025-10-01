import { useEffect, useState } from "react";
import OrderTypeCard from "./components/orderTypeCard";
import DineInForm from "./components/DineInForm";
import TakeAwayForm from "./components/TakeAwayForm";
import DeliveryOrderForm from "./components/DelOrderForm";
import OrderMenu from "./OrderMenu";
import { resetAllInfo } from "../../../../redux/action/customerInfo";
import { setOrderType } from "../../../../redux/action/cartItems";
import { clearCart } from "../../../../redux/action/cartItems";
import { useDispatch } from "react-redux";
import { orderTypes } from "../../../../utils/constant";
import { IoMdArrowBack } from "react-icons/io";
import { PageHeading } from "../../../../components/UI/PageHeading";

//TODO: Add a verification step before proceeding to the order menu to check whether the admin restaurant is verified or not.

const CreateOrders = () => {
  const dispatch = useDispatch();
  const [showOrderMenu, setShowOrderMenu] = useState(false);
  const [selectedOrderType, setSelectedOrderType] = useState(null);

  const handleOnSelectOrderType = (orderType) => {
    setSelectedOrderType(orderType);
    dispatch(clearCart());
  };

  const handleOnProceed = () => {
    setShowOrderMenu(true);
    dispatch(setOrderType(selectedOrderType));
  };

  const renderselectedOrderTypeForm = () => {
    if (!selectedOrderType) return null;
    // Render the appropriate form based on the selected order type
    switch (selectedOrderType) {
      case orderTypes.DINE_IN:
        return <DineInForm onProceed={handleOnProceed} />;
      case orderTypes.TAKE_AWAY:
        return <TakeAwayForm onProceed={handleOnProceed} />;
      case orderTypes.DELIVERY:
        return <DeliveryOrderForm onProceed={handleOnProceed} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    return () => {
      dispatch(clearCart());
      dispatch(resetAllInfo());
    };
  }, [dispatch]);

  if (showOrderMenu) {
    return (
      <>
        <button
          onClick={() => setShowOrderMenu(false)}
          className="flex items-center gap-2 !px-3 !py-1 !border !border-teal-500 !text-teal-700 rounded-lg bg-white hover:!bg-teal-50 transition font-semibold shadow-sm"
          type="button"
        >
          <IoMdArrowBack className="w-5 h-5" />
          Back
        </button>
        <OrderMenu />
      </>
    );
  }

  return (
    <>
      <PageHeading title="Create Orders" />
      <div className="flex flex-wrap justify-center items-center gap-8 mt-2">
        {Object.keys(orderTypes).map((key) => (
          <OrderTypeCard
            key={key}
            type={orderTypes[key]}
            setSelectedOrderType={handleOnSelectOrderType}
            isSelected={selectedOrderType === orderTypes[key]}
          />
        ))}
      </div>
      {selectedOrderType && (
        <div className="m-10 px-6 py-8 bg-white !border !border-yellow-400 rounded-lg shadow max-w-[75%] mx-auto">
          {renderselectedOrderTypeForm()}
        </div>
      )}
    </>
  );
};

export default CreateOrders;
