import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { GrRestaurant } from "react-icons/gr";
import { FaLocationDot } from "react-icons/fa6";
import { BsDashLg } from "react-icons/bs";
import { LuMoveRight } from "react-icons/lu";
import { FaRegClock } from "react-icons/fa";

export default function DeliveryCard({
  data,
  handleAccept,
  handleReject,
  disabled,
}) {
  return (
    <>
      <Box borderRadius={10} bg={"gray.100"} p={5} flex={1}>
        <Flex flexDirection={"column"} alignContent={"flex-start"} gap={5}>
          <Flex gap={10} alignItems={"center"}>
            <Box
              width={"60px"}
              height={"60px"}
              maxW={"100%"}
              borderRadius={"50%"}
              overflow={"hidden"}
            >
              <img
                src={data.restaurantImage}
                alt={data.restaurantName}
                width={"100%"}
              />
            </Box>
            <Text fontSize={18}>{data.restaurantName}</Text>
          </Flex>
          <Flex flexDirection={"column"}>
            <Text>Order #{data.orderId}</Text>
            <Text
              bg={"gray.200"}
              w={"fit-content"}
              px={2}
              p={1}
              fontSize={12}
              borderRadius={10}
            >
              {data.paymentType}
            </Text>
            <Flex mt={3}>
              <Flex
                alignItems={"center"}
                border={"1px solid #ccc"}
                p={2}
                borderRadius={5}
                flex={1}
              >
                <Text>
                  <GrRestaurant />
                </Text>
                <LuMoveRight />
                <Text>
                  <FaLocationDot />
                </Text>
                <Text ml={3}>{(data.distance / 1000).toFixed(1)} km</Text>
              </Flex>

              <Flex
                alignItems={"center"}
                border={"1px solid #ccc"}
                p={2}
                borderRadius={5}
                flex={1}
              >
                <Text>
                  <FaRegClock />
                </Text>
                <Text ml={3}>{Math.ceil(data.estimatedTime / 60)} min.</Text>
              </Flex>
            </Flex>

            <Flex mt={3}>
              <Button
                p={3}
                flex={1}
                bg={"green.500"}
                _hover={{ background: "green" }}
                borderRadius={0}
                color={"#fff"}
                _disabled={{ background: "#ccc", pointerEvents: "none" }}
                disabled={disabled}
                onClick={() => handleAccept(data._id)}
              >
                Accept
              </Button>
              {/* <Button
                p={3}
                flex={1}
                bg={"red.500"}
                _hover={{ background: "red" }}
                borderRadius={0}
                color={"#fff"}
                _disabled={{ background: "#ccc", pointerEvents: "none" }}
                disabled={disabled}
                onClick={() => handleReject(data._id)}
              >
                Reject
              </Button> */}
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
