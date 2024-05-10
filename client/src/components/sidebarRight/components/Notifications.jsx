import { Box, Center, Flex, Heading, Icon, Text } from '@chakra-ui/react';
import { formatDistanceToNow } from 'date-fns';

export default function Notifications({ data }) {
  return (
    <Box
      w="90%"
      marginInline="auto"
      bg="var(--primary-accent)"
      color="#fff"
      p="20px"
      borderRadius="50px"
    >
      <Heading fontSize="24px" mb="10px" mt="20px" fontWeight="500">
        Notifications
      </Heading>
      <Flex direction="column" gap="10px">
        {data.map((item, i) => (
          <Flex key={i} alignItems="center" gap="20px">
            {item.iconDetails?.isAvailable && (
              <Center
                minW="25px"
                minH="25px"
                h="fit-content"
                bg={item.iconDetails?.bg}
                borderRadius="5px"
              >
                <Icon as={item.iconDetails?.icon} w="15px" h="15px" />
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
