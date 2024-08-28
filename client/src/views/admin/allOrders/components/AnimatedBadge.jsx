import React, { useState, useEffect } from 'react';
import { Badge } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';

// Define the animation
const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
`;

const AnimatedBadge = ({ AllOrderItemsLength }) => {
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        setAnimate(true);
        const timer = setTimeout(() => setAnimate(false), 1000); // Reset animation after 1 second
        return () => clearTimeout(timer);
    }, [AllOrderItemsLength]);

    return (
        <Badge
            colorScheme="red"
            variant='solid'
            position="absolute"
            top="-3"
            right="-1"
            borderRadius="full"
            animation={animate ? `${pulse} 1s` : 'none'}
        >
            {AllOrderItemsLength}
        </Badge>
    );
};

export default AnimatedBadge;