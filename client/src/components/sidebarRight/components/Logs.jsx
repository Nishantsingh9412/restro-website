import { Box, Center, Flex, Heading, Icon, Text } from '@chakra-ui/react';
import { formatDistanceToNow } from 'date-fns';

export default function Logs({ data }) {
  return (
    <Box ps="20px">
      <Heading fontSize="24px" mb="10px" mt="20px" fontWeight="500">
        Logs
      </Heading>
      <Flex direction="column" gap="10px">
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
            <Box>
              <Text fontSize="18px">{item.title}</Text>
              <Text style={{ color: '#eee', fontSize: '14px' }}>
                {item.time
                  ? formatDistanceToNow(new Date(item.time), {
                      addSuffix: true,
                    })
                  : ''}
              </Text>
            </Box>
          </Flex>
        ))}
      </Flex>
    </Box>
  );
}
