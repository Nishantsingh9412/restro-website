import React from 'react';

// Chakra imports
import { Button, Flex, Img, useColorModeValue } from '@chakra-ui/react';

// Custom components
import { HorizonLogo } from 'components/icons/Icons';
import { HSeparator } from 'components/separator/Separator';

export function SidebarBrand() {
  //   Chakra color mode
  let logoColor = useColorModeValue('navy.700', 'white');

  return (
    <Flex align="center" direction="column" justifyContent="center" gap="20px">
      <Img src="https://res.cloudinary.com/dezifvepx/image/upload/v1712570096/restro-website/wjc0eqeyhby8bzj46lop.png" w="100px" h="100px" />
      <Flex alignItems="center" justifyContent="space-between">
        <Button bg="var(--primary)" color="#fff">
          Favourites
        </Button>
        <Button bg="var(--primary)" color="#fff">
          Recently
        </Button>
      </Flex>
    </Flex>
  );
}

export default SidebarBrand;
