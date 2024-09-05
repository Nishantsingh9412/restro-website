import React, { useState } from 'react';
import {
  Box,
  keyframes,
  Text,
  Image
} from '@chakra-ui/react';

// Define the pulse animation
const scaleUp = keyframes`
  0% {
    transform: scale(0.9);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`
  ;

const AnimatedBox = ({ children, onClick }) => {
  const [animate, setAnimate] = useState(false);

  const handleClick = () => {
    setAnimate(true);
    onClick();
    setTimeout(() => setAnimate(false), 1000); // Reset animation after 1 second
  };

  return (
    <Box
      p={5}
      borderWidth={1}
      margin={3}
      borderRadius="lg"
      display={'flex'}
      flexDirection={'column'}
      alignItems={'center'}
      overflow="hidden"
      animation={animate ? `${scaleUp} 1s` : 'none'}
      onClick={handleClick}
      cursor="pointer"
      transition="transform 0.2s ease"
    // _hover={{ transform: 'scale(1.05)' }}
    >
      {children}
    </Box>
  );
};

export default AnimatedBox;
