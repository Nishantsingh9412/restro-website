import {
  Box,
  Heading,
  Flex,
  IconButton,
  Divider,
  Stack,
  Text,
  Badge,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  UnorderedList,
  ListItem,
  useDisclosure,
} from "@chakra-ui/react";
import { MdRestaurant } from "react-icons/md";
import { formatPrice } from "../../../../utils/constant";
import PropTypes from "prop-types";

const DineInOrder = ({ orderData, handleAllotWaiter }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    _id,
    completedAt,
    assignedWaiter,
    orderId,
    customerName,
    numberOfGuests,
    specialRequests,
    paymentMethod,
    totalPrice,
    tableNumber,
    orderItems,
    guests,
  } = orderData;

  const categorizedOrderItems = orderItems?.reduce((acc, item) => {
    const guestName = item.guestName || "";
    if (!acc[guestName]) {
      acc[guestName] = [];
    }
    acc[guestName].push(item);
    return acc;
  }, {});

  
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
        ) : assignedWaiter ? (
          <Heading as="h2" size="md" bg="blue.100" mb={4} p={2}>
            Assigned to {assignedWaiter?.name}
          </Heading>
        ) : (
          <Flex justifyContent="space-between" alignItems="center" mb="4">
            <Heading as="h2" size="md">
              Order #{orderId}
            </Heading>
            <IconButton
              onClick={handleAllotWaiter}
              aria-label="Allot Waiter"
              title="Allot Waiter"
              icon={<MdRestaurant />}
              variant="outline"
              colorScheme="blue"
            />
          </Flex>
        )}
        <Divider mb="4" />
        <Stack spacing="3">
          <Text>
            <Badge colorScheme="blue">Customer</Badge> {customerName || "N/A"}
          </Text>
          <Text>
            <Badge colorScheme="blue">Guests</Badge> {numberOfGuests || "N/A"}
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

      {/* Modal for Full Details */}
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
                <Badge colorScheme="blue">Guests</Badge>{" "}
                {numberOfGuests || "N/A"}
              </Text>
              {guests?.length > 0 && (
                <Text>
                  <Badge colorScheme="blue">Guests List</Badge>{" "}
                  {guests.map((guest) => guest.name).join(", ")}
                </Text>
              )}
              <Text>
                <Badge colorScheme="blue">Note</Badge>{" "}
                {specialRequests || "N/A"}
              </Text>
              <Text>
                <Badge colorScheme="blue">Payment</Badge>{" "}
                {paymentMethod?.toUpperCase() || "N/A"}
              </Text>
              <Text>
                <Badge colorScheme="blue">Table No</Badge>{" "}
                {tableNumber || "N/A"}
              </Text>
              <Text>
                <Badge colorScheme="blue">Total</Badge>{" "}
                {formatPrice(totalPrice, orderItems?.[0]?.item?.priceUnit) ||
                  "N/A"}
              </Text>
              <Text>
                <Badge colorScheme="blue">Waiter</Badge>{" "}
                {assignedWaiter?.name || "N/A"}
              </Text>
            </Stack>
            <Heading as="h3" size="sm" mt="6" mb="2">
              Order Items:
            </Heading>
            <Divider mb="2" />
            <Box height="200px" overflowY={"auto"}>
              {Object.entries(categorizedOrderItems).map(
                ([guestName, items]) => (
                  <Box key={guestName} mb={4}>
                    <Heading as="h4" size="xs" mb={2}>
                      {guestName}:
                    </Heading>
                    <UnorderedList spacing={3}>
                      {items.map(
                        ({
                          _id,
                          quantity,
                          total,
                          item,
                          selectedCustomizations,
                        }) => (
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
                            <Flex
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <Box>
                                <Text fontWeight="bold">{item?.itemName}</Text>
                                {selectedCustomizations?.length > 0 && (
                                  <Text fontSize="sm" color="gray.600">
                                    (
                                    {selectedCustomizations
                                      .flatMap((c) =>
                                        c.selectedOptions.map(
                                          (option) => option.name
                                        )
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
                  </Box>
                )
              )}
            </Box>
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
DineInOrder.propTypes = {
  orderData: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    completedAt: PropTypes.string,
    assignedWaiter: PropTypes.shape({
      name: PropTypes.string,
    }),
    orderId: PropTypes.string.isRequired,
    customerName: PropTypes.string,
    numberOfGuests: PropTypes.number,
    specialRequests: PropTypes.string,
    paymentMethod: PropTypes.string,
    totalPrice: PropTypes.number.isRequired,
    tableNumber: PropTypes.number,
    guests: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      })
    ),
    orderItems: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        total: PropTypes.number.isRequired,
        item: PropTypes.shape({
          itemName: PropTypes.string.isRequired,
          priceUnit: PropTypes.string,
        }),
        selectedCustomizations: PropTypes.arrayOf(
          PropTypes.shape({
            selectedOptions: PropTypes.arrayOf(
              PropTypes.shape({
                name: PropTypes.string.isRequired,
              })
            ),
          })
        ),
        guestName: PropTypes.string,
      })
    ),
  }).isRequired,
  handleAllotWaiter: PropTypes.func.isRequired,
};

export default DineInOrder;
