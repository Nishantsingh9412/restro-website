import { memo } from "react";
import PropTypes from "prop-types";
import { Box, Heading, Text } from "@chakra-ui/react";
import { FaShoppingCart } from "react-icons/fa";

// Define the bounce animation keyframes
const bounceAnimation = {
    "@keyframes bounce": {
        "0%, 20%, 50%, 80%, 100%": {
            transform: "translateY(0)",
        },
        "40%": {
            transform: "translateY(-30px)",
        },
        "60%": {
            transform: "translateY(-15px)",
        },
    },
};

// Functional component to display an empty cart message
const EmptyCart = ({ message }) => {
    return (
        <Box textAlign="center" py={10} px={6} mt={"12rem"}>
            {/* Cart icon with bounce animation */}
            <Box
                as="div"
                className="cart-icon"
                width="50px"
                height="50px"
                margin="0 auto"
                mb={6}
                position="relative"
                sx={{
                    animation: `bounce 2s infinite`,
                    ...bounceAnimation,
                }}
                aria-label="Empty cart icon"
            >
                <FaShoppingCart size="100%" color="gray" />
            </Box>
            {/* Heading for empty cart */}
            <Heading as="h2" size="xl" mt={6} mb={2} color="gray.500">
                Your Cart is Empty
            </Heading>
            {/* Message for empty cart */}
            <Text color="gray.500">
                {message || "Looks like you haven't added anything to your cart yet."}
            </Text>
        </Box>
    );
};

// Define prop types for the component
EmptyCart.propTypes = {
    message: PropTypes.string,
};

// Export the component wrapped in memo to prevent unnecessary re-renders
export default memo(EmptyCart);
