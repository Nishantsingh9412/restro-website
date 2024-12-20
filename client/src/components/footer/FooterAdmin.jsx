/*eslint-disable*/
import React from 'react';
import {
  Flex,
  Link,
  List,
  ListItem,
  Text,
  Button,
  useColorMode,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';

export default function Footer() {
  const textColor = useColorModeValue('white', 'white');
  const bg = useColorModeValue('var(--primary)', 'gray.700');
  const { toggleColorMode } = useColorMode();
  return (
    <Flex
      bg={bg}
      alignItems="center"
      gap="10px"
      justifyContent="space-between"
      position="fixed"
      bottom="0"
      left="0"
      w="100%"
      h="80px"
      px="10%"
      borderTopRadius="20px"
      display={{ xl: 'none', base: 'flex' }}
    >
      {footerLinks.map((item, i) => (
        <Link
          href={item.href}
          key={i}
          title={item.name}
          style={{
            position: 'relative',
            bottom: item.type === 'focus' ? '10px' : '0',
            scale: item.type === 'focus' ? '1.6' : '1',
            marginInline: item.type === 'focus' ? '20px' : '0',
            padding: '10px',
            borderRadius: '50%',
            backgroundColor: bg,
          }}
        >
          <Icon as={item.icon} w="30px" h="30px" color={textColor} />
        </Link>
      ))}
    </Flex>
  );
}

const footerLinks = [
  {
    name: 'Home',
    icon: '',
    href: '',
    type: 'common',
  },
  {
    name: 'Notifications',
    icon: '',
    href: '',
    type: 'common',
  },
  {
    name: 'Add',
    icon: '',
    href: '',
    type: 'focus',
  },
  {
    name: 'Cart',
    icon: '',
    href: '',
    type: 'common',
  },
  {
    name: 'Profile',
    icon: '',
    href: '',
    type: 'common',
  },
];
