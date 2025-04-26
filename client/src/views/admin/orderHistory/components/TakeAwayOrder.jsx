import {
  Box,
  Heading,
  Text,
  Badge,
  UnorderedList,
  ListItem,
  IconButton,
  Flex,
  Divider,
  Stack,
  Button,
  useDisclosure,
  ModalFooter,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import { MdRestaurant } from "react-icons/md";
import { formatPrice } from "../../../../utils/constant";
import PropTypes from "prop-types";

const TakeAwayOrder = ({ orderData, handleAllotChef }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    _id,
    orderId,
    customerName,
    orderItems,
    totalPrice,
    assignedChef,
    completedAt,
  } = orderData;

  return (
    <>
      <Box
        key={_id}
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        p="6"
        bg="white"
        shadow="lg"
        transition="transform 0.2s"
        _hover={{ transform: "scale(1.02)" }}
      >
        {completedAt ? (
          <Heading
            as="h2"
            size="md"
            bg="green.100"
            textAlign={"center"}
            mb={4}
            p={2}
          >
            Completed
          </Heading>
        ) : assignedChef ? (
          <Heading as="h2" size="md" bg="blue.100" mb={4} p={2}>
            Assigned to {assignedChef?.name}
          </Heading>
        ) : (
          <Flex justifyContent="space-between" alignItems="center" mb="4">
            <Heading as="h2" size="md">
              Order #{orderId}
            </Heading>
            <IconButton
              onClick={handleAllotChef}
              aria-label="Allot Chef"
              title="Allot Chef"
              icon={<MdRestaurant />}
              variant="outline"
              colorScheme="blue"
            />
          </Flex>
        )}

        <Divider mb={4} />

        <Stack spacing={2}>
          <Text>
            <Badge colorScheme="blue">Customer</Badge> {customerName || "N/A"}
          </Text>
          <Text>
            <Badge colorScheme="blue">Total</Badge>{" "}
            {formatPrice(totalPrice, orderItems?.[0]?.item?.priceUnit) || "N/A"}
          </Text>
        </Stack>
        <Button mt="4" colorScheme="blue" onClick={onOpen} width={"100%"}>
          View Full Details
        </Button>
      </Box>

      {/* // Modal for order details */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg={"blue.100"} mb={2}>
            Order #{orderId}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing="3">
              <Text>
                <Badge colorScheme="blue">Customer</Badge>{" "}
                {customerName || "N/A"}
              </Text>
              <Text>
                <Badge colorScheme="blue">Total</Badge>{" "}
                {formatPrice(totalPrice, orderItems?.[0]?.item?.priceUnit) ||
                  "N/A"}
              </Text>
              <Divider />
              <Heading as="h3" size="sm" mt="6" mb="2">
                Order Items:
              </Heading>
              <UnorderedList spacing={3}>
                {orderItems?.map(
                  ({ _id, quantity, total, item, selectedCustomizations }) => (
                    <ListItem
                      key={_id}
                      p={2}
                      borderWidth="1px"
                      borderRadius="md"
                      shadow="sm"
                      bg="gray.50"
                      _hover={{ bg: "gray.100", shadow: "md" }}
                      listStyleType={"square"}
                    >
                      <Flex justifyContent="space-between" alignItems="center">
                        <Box>
                          <Text fontWeight="bold">{item?.itemName}</Text>
                          {selectedCustomizations?.length > 0 && (
                            <Text fontSize="sm" color="gray.600">
                              (
                              {selectedCustomizations
                                .flatMap((c) =>
                                  c.selectedOptions.map((option) => option.name)
                                )
                                .join(", ")}
                              )
                            </Text>
                          )}
                        </Box>
                        <Box textAlign="right">
                          <Text fontWeight="bold">
                            &times; {quantity} -{" "}
                            {formatPrice(total, item?.priceUnit)}
                          </Text>
                        </Box>
                      </Flex>
                    </ListItem>
                  )
                )}
              </UnorderedList>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

TakeAwayOrder.propTypes = {
  orderData: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    orderId: PropTypes.string.isRequired,
    customerName: PropTypes.string,
    orderItems: PropTypes.arrayOf(
      PropTypes.shape({
        item: PropTypes.shape({
          priceUnit: PropTypes.string,
        }),
      })
    ),
    totalPrice: PropTypes.number,
    assignedChef: PropTypes.shape({
      name: PropTypes.string,
    }),
    completedAt: PropTypes.string,
  }).isRequired,
  handleAllotChef: PropTypes.func.isRequired,
};

export default TakeAwayOrder;
