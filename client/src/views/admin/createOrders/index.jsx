import { useEffect, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import OrderTypeCard from "./components/OrderTypeCard";
import DineInForm from "./components/DineInForm";
import TakeAwayForm from "./components/TakeAwayForm";
import DeliveryOrderForm from "./components/DelOrderForm";
import OrderMenu from "./OrderMenu";

const CreateOrders = () => {
  const orderTypes = ["Dine In", "TakeAway", "Delivery"];
  const [orderType, setOrderType] = useState(null);
  const [showOrderMenu, setShowOrderMenu] = useState(false);

  const handleOnProceed = () => {
    setShowOrderMenu(true);
  };

  const renderOrderTypeForm = () => {
    switch (orderType) {
      case "Dine In":
        return <DineInForm onProceed={handleOnProceed} />;
      case "TakeAway":
        return <TakeAwayForm onProceed={handleOnProceed} />;
      case "Delivery":
        return <DeliveryOrderForm onProceed={handleOnProceed} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    return () => setOrderType(null);
  }, []);

  if (showOrderMenu) {
    return <OrderMenu />;
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
        {orderTypes.map((type) => (
          <OrderTypeCard
            key={type}
            type={type}
            setOrderType={setOrderType}
            isSelected={orderType === type}
          />
        ))}
      </Flex>
      {orderType && (
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
          {renderOrderTypeForm()}
        </Box>
      )}
    </>
  );
};

export default CreateOrders;
