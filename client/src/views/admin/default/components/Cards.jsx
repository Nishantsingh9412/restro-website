import { Center, Flex, Icon, Text } from '@chakra-ui/react';

export default function DashboardCard(props) {
  const { color, bg, icon, border, label, value, growth } = props;

  return (
    <>
      <Flex
        direction="column"
        gap="10px"
        bg={bg}
        border="5px solid"
        borderColor={border}
        borderRadius="15px"
        p="20px"
      >
        <Flex alignItems="center" gap="10px" justifyContent="space-between">
          <Text
            fontWeight="600"
            color={color}
            fontSize={{ base: '14px', lg: '16px' }}
          >
            {label}
          </Text>
          <Center borderRadius="50%" p="5px" bg={border}>
            <Icon as={icon} w="25px" h="25px" color={color} />
          </Center>
        </Flex>
        <Flex alignItems="flex-end" gap="10px" justifyContent="space-between">
          <Text fontWeight="600" fontSize={{ lg: '30px', base: '24px' }}>
            {value}
          </Text>
          <Text
            fontSize={{ lg: '12px', base: '11px' }}
            fontWeight="500"
            color="gray.700"
          >
            {growth}
          </Text>
        </Flex>
      </Flex>
    </>
  );
}
