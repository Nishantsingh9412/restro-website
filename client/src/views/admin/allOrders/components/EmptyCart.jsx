import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import { FaShoppingCart } from 'react-icons/fa';

const bounceAnimation = {
  '@keyframes bounce': {
    '0%, 20%, 50%, 80%, 100%': {
      transform: 'translateY(0)',
    },
    '40%': {
      transform: 'translateY(-30px)',
    },
    '60%': {
      transform: 'translateY(-15px)',
    },
  },
};

const EmptyCart = () => {
  return (
    <Box textAlign="center" py={10} px={6} mt={'12rem'}>
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
      >
        <FaShoppingCart size="100%" color="gray" />
      </Box>
      <Heading as="h2" size="xl" mt={6} mb={2} color="gray.500">
        Your Cart is Empty
      </Heading>
      <Text color="gray.500">
        Looks like you haven't added anything to your cart yet.
      </Text>
    </Box>
  );
};

export default EmptyCart;