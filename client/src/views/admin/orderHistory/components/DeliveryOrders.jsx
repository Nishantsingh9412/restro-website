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
import { MdLocalShipping } from "react-icons/md";
import PropTypes from "prop-types";
import { camelCaseToSentenceCase } from "../../../../utils/utils";
import { formatPrice } from "../../../../utils/constant";

const DeliveryOrders = ({ orderData, handleAllotDeliveryBoy }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    _id,
    orderId,
    customerName,
    phoneNumber,
    paymentMethod,
    deliveryMethod,
    address,
    zip,
    noteFromCustomer,
    totalPrice,
    orderItems,
    assignedTo,
    completedAt,
  } = orderData;

  return (
    <>
      <Box
        key={_id}
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        p="5"
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
        ) : assignedTo ? (
          <Heading as="h2" size="md" bg="blue.100" mb={4} p={2}>
            Assigned to {assignedTo.name}
          </Heading>
        ) : (
          <Flex justifyContent="space-between" alignItems="center" mb="4">
            <Heading as="h2" size="md">
              Order #{orderId}
            </Heading>
            <IconButton
              onClick={() => handleAllotDeliveryBoy(orderId)}
              aria-label="Allot Delivery Boy"
              title="Allot Delivery Boy"
              icon={<MdLocalShipping />}
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
            <Badge colorScheme="blue">Address</Badge> {address || "N/A"}
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
                <Badge colorScheme="blue">Phone</Badge> {phoneNumber || "N/A"}
              </Text>
              <Text>
                <Badge colorScheme="blue">Payment</Badge>{" "}
                {camelCaseToSentenceCase(paymentMethod) || "N/A"}
              </Text>
              <Text>
                <Badge colorScheme="blue">Delivery</Badge>{" "}
                {camelCaseToSentenceCase(deliveryMethod) || "N/A"}
              </Text>
              <Text>
                <Badge colorScheme="blue">Address</Badge> {address}, {zip}
              </Text>
              <Text>
                <Badge colorScheme="blue">Note</Badge>{" "}
                {noteFromCustomer || "N/A"}
              </Text>
              <Text>
                <Badge colorScheme="blue">Total</Badge>{" "}
                {formatPrice(totalPrice, orderItems?.[0]?.item?.priceUnit) ||
                  "N/A"}
              </Text>
            </Stack>
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
DeliveryOrders.propTypes = {
  orderData: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    orderId: PropTypes.string.isRequired,
    customerName: PropTypes.string,
    phoneNumber: PropTypes.string,
    paymentMethod: PropTypes.string,
    deliveryMethod: PropTypes.string,
    address: PropTypes.string,
    zip: PropTypes.string,
    noteFromCustomer: PropTypes.string,
    totalPrice: PropTypes.number,
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
      })
    ),
    assignedTo: PropTypes.shape({
      name: PropTypes.string,
    }),
    completedAt: PropTypes.string,
  }).isRequired,
  handleAllotDeliveryBoy: PropTypes.func.isRequired,
};

export default DeliveryOrders;
