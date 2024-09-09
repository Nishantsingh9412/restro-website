import React, {
    useState
} from 'react'
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
    StepIcon,
    StepIndicator,
    StepNumber,
    StepSeparator,
    StepStatus,
    StepTitle,
    Stepper,
    //   useDisclosure,
    useSteps,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';

// import Address from './stepperComp/Address';
// import AllOrdersData from './stepperComp/AllOrdersData';
import OrderSummary from './stepperComp/OrderSummary';
import DineInForm from './StepperDineIn/DineInForm';

const CheckOutDinein = (props) => {

    const isOpen = props.isOpen;
    const onOpen = props.onOpen;
    const onClose = props.onClose;

    const StepperformData = useSelector((state) => state.form)

    const goToNextStep = () => {
        if (activeStep < steps.length - 1) {
            setActiveStep((prevStep) => prevStep + 1);
        }
    };

    const goToPreviousStep = () => {
        if (activeStep > 0) {
            setActiveStep((prevStep) => prevStep - 1);
        }
    }

    const steps = [
        {
            title: 'DineIn Details',
            description: 'Add DineIn Details',
            component: <DineInForm
                goToNextStep={goToNextStep}
            />
        },
        // {
        //     title: 'Items',
        //     description: 'Added Items',
        //     component: <AllOrdersData
        //         goToNextStep={goToNextStep}
        //         goToPreviousStep={goToPreviousStep} />
        // },
        {
            title: 'Summary',
            description: 'Order Summary',
            component: <OrderSummary
                goToPreviousStep={goToPreviousStep}
            />
        },
    ]

    const { activeStep, setActiveStep } = useSteps({
        index: 0,
        count: steps.length,
    });

    return (
        <div>
            <>
                <Drawer placement='left' onClose={onClose} isOpen={isOpen} size='full' >
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>
                            {`Checkout-DineIn`}
                        </DrawerHeader>
                        <DrawerBody>
                            <Stepper size='lg' colorScheme='yellow' index={activeStep}>
                                {steps.map((step, index) => (
                                    <Step key={index}>
                                        <StepIndicator>
                                            <StepStatus complete={`✅`} incomplete={`😅`} active={`📍`} />
                                        </StepIndicator>

                                        <Box flexShrink='0'>
                                            <StepTitle>{step.title}</StepTitle>
                                            <StepDescription>{step.description}</StepDescription>
                                        </Box>

                                        <StepSeparator />
                                    </Step>
                                ))}
                            </Stepper>
                            <Box mt={4} >
                                {steps[activeStep].component}
                            </Box>
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>
            </>
        </div>
    )
}

export default CheckOutDinein
