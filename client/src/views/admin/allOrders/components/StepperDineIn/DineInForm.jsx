import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    SimpleGrid
} from '@chakra-ui/react';
import React, { useState } from 'react';

const DineInForm = () => {

    const [tableNumber, setTableNumber] = useState('');
    const [numberOfGuests, setNumberOfGuests] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [specialRequests, setSpecialRequests] = useState('');

    const validate = () => {
        // Validate the form
        if (tableNumber === '') {

            return false;
        }
    }


    const handleDineInSubmit = (e) => {
        e.preventDefault();
        console.log('DineIn Form Submitted');
        console.log('Table Number:', tableNumber);
        console.log('Number of Guests:', numberOfGuests);
        console.log('Customer Name:', customerName);
        console.log('Phone Number:', phoneNumber);
        console.log('Email Address:', emailAddress);
        console.log('Special Requests:', specialRequests);
    }

    return (
        <form onSubmit={handleDineInSubmit}>
            <Box mt={10}>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl
                        id="table-number"
                        mb={4}
                        isRequired
                    >
                        <FormLabel>Table Number</FormLabel>
                        <Input
                            type="number"
                            placeholder="Enter table number"
                            value={tableNumber}
                            onChange={
                                (e) =>
                                    setTableNumber(e.target.value)
                            }
                        />
                    </FormControl>

                    <FormControl
                        id="number-of-guests"
                        mb={4}
                        isRequired
                    >
                        <FormLabel>Number of Guests</FormLabel>
                        <Input
                            required
                            type="number"
                            placeholder="Enter number of guests"
                            value={numberOfGuests}
                            onChange={
                                (e) =>
                                    setNumberOfGuests(e.target.value)
                            }
                        />
                    </FormControl>

                    <FormControl id="customer-name" mb={4}>
                        <FormLabel>Customer Name</FormLabel>
                        <Input
                            type="text"
                            placeholder="Enter customer name (optional)"
                            value={customerName}
                            onChange={
                                (e) =>
                                    setCustomerName(e.target.value)
                            }
                        />
                    </FormControl>

                    <FormControl id="phone-number" mb={4}>
                        <FormLabel>Phone Number</FormLabel>
                        <Input
                            type="text"
                            placeholder="Enter phone number (optional)"
                            value={phoneNumber}
                            onChange={
                                (e) =>
                                    setPhoneNumber(e.target.value)
                            }
                        />
                    </FormControl>

                    <FormControl id="email-address" mb={4}>
                        <FormLabel>Email Address</FormLabel>
                        <Input
                            type="email"
                            placeholder="Enter email address (optional)"
                            value={emailAddress}
                            onChange={
                                (e) =>
                                    setEmailAddress(e.target.value)
                            }
                        />
                    </FormControl>

                    <FormControl id="special-requests" mb={4}>
                        <FormLabel>Special Requests</FormLabel>
                        <Textarea
                            placeholder="Enter any special requests (e.g., seating preferences, allergies)"
                            value={specialRequests}
                            onChange={
                                (e) =>
                                    setSpecialRequests(e.target.value)
                            }
                        />
                    </FormControl>
                </SimpleGrid>

                <Button
                    colorScheme="cyan"
                    type='submit'
                    mt={4}
                >
                    Submit
                </Button>
            </Box>
        </form>
    );
};

export default DineInForm;