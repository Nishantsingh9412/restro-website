/* eslint-disable react/prop-types */
import { useCallback } from "react";
import {
  Box,
  Text,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Button,
  Flex,
  IconButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
} from "@chakra-ui/react";
import { FaCartShopping } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { FaTimes } from "react-icons/fa";

// Importing components
import EmptyCart from "./EmptyCart";
import CheckOutDinein from "./CheckOutDineIn";
import CartItem from "./CartItem"; // Importing CartItem component
import { setFormData } from "../../../../redux/action/dineInStepperForm";
import { useToast } from "../../../../contexts/useToast";
const DineInDrawer = (props) => {
  // Destructuring props
  const { isOpen, onClose } = props;
  const showToast = useToast();
  // Using Chakra UI's useDisclosure hook for managing the state of the checkout drawer
  const {
    isOpen: isOpenCheckoutRight,
    onOpen: onOpenCheckoutRight,
    onClose: onCloseCheckoutRight,
  } = useDisclosure();

  // Redux hooks for dispatching actions and selecting state
  const dispatch = useDispatch();
  const allOrderItems = useSelector((state) => state?.OrderItemReducer);
  const allCartItems = allOrderItems?.items;
  const AllOrderItemsTotal = allOrderItems?.total;
  const formData = useSelector((state) => state.dineInForm);
  const { tableNumber, numberOfGuests } = formData;

  // Handler to update form data in the Redux store
  const handleChange = useCallback(
    (e) => {
      if (e.target.id === "numberOfGuests" && e.target.value > 20) {
        showToast("Number of guests should be between 1 and 20", "error");
        return;
      }
      dispatch(setFormData({ [e.target.id]: e.target.value }));
    },
    [dispatch]
  );

  const handleOpenCheckoutRight = () => {
    if (tableNumber === "" || numberOfGuests === "") {
      showToast("Please enter table number and number of guests", "error");
      return;
    }
    onOpenCheckoutRight();
  };

  // Handler to remove an item completely from the order
  const handleRemoveItemOrderCompletely = (id) => {
    if (id !== undefined) {
      dispatch({ type: "REMOVE_ORDER_ITEM_TEMP_COMPLETELY", data: id });
    }
  };

  // Handler to remove one quantity of an item from the order
  const handleRemoveItemOrder = (id) => {
    if (id !== undefined) {
      dispatch({ type: "REMOVE_ORDER_ITEM_TEMP", data: id });
    }
  };

  // Handler to add one quantity of an item to the order
  const handleAddItemOrder = (product) => {
    if (product !== undefined) {
      dispatch({ type: "ADD_ORDER_ITEM_TEMP", data: product });
    }
  };

  return (
    <div>
      <>
        {/* Drawer component for displaying the cart */}
        <Drawer placement={"left"} onClose={onClose} isOpen={isOpen} size="md">
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">
              <Flex justifyContent="space-between" alignItems="center">
                <Flex alignItems="center">
                  <FaCartShopping />
                  <Text marginLeft="2">Your Cart</Text>
                </Flex>
                <IconButton
                  icon={<FaTimes />}
                  onClick={onClose}
                  variant="ghost"
                />
              </Flex>
            </DrawerHeader>
            <DrawerBody>
              {/* Display subtotal and checkout button if there are items in the cart */}
              <Box height="70vh" overflowY="scroll">
                {allCartItems?.length > 0 ? (
                  <>
                    {allCartItems.map((item, index) => (
                      <CartItem
                        key={index}
                        item={item}
                        onRemoveCompletely={handleRemoveItemOrderCompletely}
                        onAdd={handleAddItemOrder}
                        onRemove={handleRemoveItemOrder}
                      />
                    ))}
                    {/* <DineInForm /> */}
                    <Box mt={5} mx={1}>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        {/* Table Number Input */}
                        <FormControl id="tableNumber" mb={4} isRequired>
                          <FormLabel>Table Number</FormLabel>
                          <Input
                            type="number"
                            placeholder="Enter table number"
                            value={tableNumber}
                            onChange={handleChange}
                            required={true}
                          />
                        </FormControl>

                        {/* Number of Guests Input */}
                        <FormControl id="numberOfGuests" mb={4} isRequired>
                          <FormLabel>Number of Guests</FormLabel>
                          <Input
                            type="number"
                            placeholder="Enter number of guests"
                            value={numberOfGuests}
                            min={1}
                            max={20}
                            onChange={handleChange}
                            required={true}
                          />
                        </FormControl>
                      </SimpleGrid>
                      <Box textAlign="center">
                        {numberOfGuests &&
                        numberOfGuests > 0 &&
                        numberOfGuests <= 20 ? (
                          <img
                            src={`/tables/table-${numberOfGuests}.webp`}
                            alt={`Table ${numberOfGuests}`}
                            width="100%"
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                            }}
                          />
                        ) : (
                          <Text fontSize="sm" color="gray.500">
                            Enter a number of guest (1-20) to see the table
                            layout.
                          </Text>
                        )}
                      </Box>
                    </Box>

                    <Box
                      display={"flex"}
                      flexDirection={"column"}
                      position={"absolute"}
                      bottom={"0"}
                      padding={"1rem"}
                      width={"90%"}
                    >
                      <Box
                        display={"flex"}
                        justifyContent={"space-between"}
                        padding={"1rem"}
                        borderTopWidth={"1px"}
                      >
                        <Text fontWeight={"bold"} fontSize={"2xl"}>
                          Subtotal :
                        </Text>

                        <Text
                          fontWeight={"bold"}
                          fontSize={"2xl"}
                          color={"#029CFF"}
                        >
                          {parseFloat(AllOrderItemsTotal).toFixed(2)} €
                        </Text>
                      </Box>
                      {/* Checkout drawer starts */}
                      <CheckOutDinein
                        allOrderItems={allOrderItems}
                        AllOrderItemsTotal={AllOrderItemsTotal}
                        onOpen={onOpenCheckoutRight}
                        onClose={onCloseCheckoutRight}
                        isOpen={isOpenCheckoutRight}
                      />
                      {/* Checkout drawer ends */}
                      <Button
                        background={"#029CFF"}
                        color={"white"}
                        _hover={{ color: "#029CFF", bg: "whitesmoke" }}
                        onClick={handleOpenCheckoutRight}
                      >
                        Checkout
                      </Button>
                    </Box>
                  </>
                ) : (
                  // No items in cart show your cart is empty
                  <EmptyCart />
                )}
              </Box>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    </div>
  );
};

export default DineInDrawer;
