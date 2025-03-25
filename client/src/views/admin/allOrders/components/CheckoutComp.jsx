/* eslint-disable react/prop-types */
import React from "react";
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Step,
  StepDescription,
  StepIndicator,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
} from "@chakra-ui/react";

import Address from "./stepperComp/Address";
// import AllOrdersData from "./stepperComp/AllOrdersData";
import OrderSummary from "./stepperComp/OrderSummary";

const CheckoutComp = ({ isOpen, onClose }) => {
  // Define steps before using them
  const steps = [
    { title: "Address", description: "Add Address", component: Address },
    { title: "Summary", description: "Order Summary", component: OrderSummary },
  ];

  // Use useSteps hook with dynamic count
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  // Unified step navigation logic
  const goToStep = (direction) => {
    setActiveStep((prevStep) =>
      Math.max(0, Math.min(prevStep + direction, steps.length - 1))
    );
  };

  return (
    <Drawer onClose={onClose} isOpen={isOpen} size="full">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>{`Checkout`}</DrawerHeader>
        <DrawerBody>
          <Stepper size="lg" colorScheme="yellow" index={activeStep}>
            {steps.map(({ title, description }, index) => (
              <Step key={index}>
                <StepIndicator>
                  <StepStatus complete="✅" incomplete="😅" active="📍" />
                </StepIndicator>
                <Box flexShrink="0">
                  <StepTitle>{title}</StepTitle>
                  <StepDescription>{description}</StepDescription>
                </Box>
                <StepSeparator />
              </Step>
            ))}
          </Stepper>
          {/* Render the active step's component */}
          <Box mt={4}>
            {React.createElement(steps[activeStep].component, {
              goToNextStep: () => goToStep(1),
              goToPreviousStep: () => goToStep(-1),
            })}
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default CheckoutComp;
