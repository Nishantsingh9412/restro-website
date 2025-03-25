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
// import DineInForm from "./stepperDineIn/DineInForm";
import DineInOrderSummary from "./stepperDineIn/DineInSummary";

const CheckOutDineIn = ({ isOpen, onClose }) => {
  // Define the steps for the stepper
  const steps = [
    // {
    //   title: "DineIn Details",
    //   description: "Add DineIn Details",
    //   component: DineInForm,
    // },
    {
      title: "Summary",
      description: "Order Summary",
      component: DineInOrderSummary,
    },
  ];

  // Initialize stepper state
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  // Function to navigate between steps
  const goToStep = (direction) => {
    setActiveStep((prevStep) =>
      Math.max(0, Math.min(prevStep + direction, steps.length - 1))
    );
  };

  return (
    // Drawer component for the checkout process
    <Drawer placement="left" onClose={onClose} isOpen={isOpen} size="full">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Checkout-DineIn</DrawerHeader>
        <DrawerBody>
          {/* Stepper component to show the steps */}
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
          {/* Dynamic component rendering based on the active step */}
          <Box mt={4}>
            {React.createElement(steps[activeStep].component, {
              goToNextStep: () => goToStep(1),
              goToPreviousStep: () => goToStep(-1),
              cancelOrder: onClose,
            })}
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default CheckOutDineIn;
