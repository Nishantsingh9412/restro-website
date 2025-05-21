import { useEffect, useState } from "react";
import { Box, Flex, Button } from "@chakra-ui/react";
import OrderTypeCard from "./components/orderTypeCard";
import DineInForm from "./components/DineInForm";
import TakeAwayForm from "./components/TakeAwayForm";
import DeliveryOrderForm from "./components/DelOrderForm";
import OrderMenu from "./OrderMenu";
import { resetAllInfo } from "../../../redux/action/customerInfo";
import { setOrderType } from "../../../redux/action/cartItems";
import { clearCart } from "../../../redux/action/cartItems";
import { useDispatch } from "react-redux";
import { orderTypes } from "../../../utils/constant";
import { IoMdArrowBack } from "react-icons/io";

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
        <Button
          onClick={() => setShowOrderMenu(false)}
          colorScheme="teal"
          variant="outline"
          ml={6}
          iconSpacing={1}
          leftIcon={<IoMdArrowBack />}
        >
          Back
        </Button>
        <OrderMenu selectedOrderType={selectedOrderType} />
      </>
    );
  }

  return (
    <>
      <Flex
        mt={10}
        justifyContent="center"
        alignItems="center"
        flexWrap="wrap"
        gap={8}
      >
        {Object.keys(orderTypes).map((key) => (
          <OrderTypeCard
            key={key}
            type={orderTypes[key]}
            setSelectedOrderType={handleOnSelectOrderType}
            isSelected={selectedOrderType === orderTypes[key]}
          />
        ))}
      </Flex>
      {selectedOrderType && (
        <Box
          m={10}
          px={6}
          py={4}
          bg="white"
          borderRadius="lg"
          boxShadow="lg"
          maxW="800px"
          mx="auto"
        >
          {renderselectedOrderTypeForm()}
        </Box>
      )}
    </>
  );
};

export default CreateOrders;
