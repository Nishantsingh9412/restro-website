import { Box, Center, Flex, Heading, Icon, Text } from '@chakra-ui/react';

export default function Contacts({ data }) {
  return (
    <Box ps="20px">
      <Heading fontSize="24px" mb="10px" mt="20px" fontWeight="500">
        Contacts
      </Heading>
      <Flex direction="column" gap="15px">
        {data.map((item, i) => (
          <Flex key={i} alignItems="center" gap="20px">
            {item.iconDetails?.isAvailable && (
              <Center
                w="25px"
                h="25px"
                bg={item.iconDetails?.bg}
                borderRadius="50%"
              >
                {item.iconDetails?.icon && (
                  <Icon as={item.iconDetails.icon} w="15px" h="15px" />
                )}
              </Center>
            )}
            <Text fontSize="18px">{item.name}</Text>
          </Flex>
        ))}
      </Flex>
    </Box>
  );
}
