/* eslint-disable react/prop-types */
import { useState } from "react";
import {
    Box,
    Image,
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
} from "@chakra-ui/react";
import { FaCartShopping } from "react-icons/fa6";
import { BiSolidTrash } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { FaTimes } from "react-icons/fa";

// Importing components
import EmptyCart from "./EmptyCart";
import CheckOutDinein from "./CheckOutDineIn";

const DineInDrawer = (props) => {
    // Destructuring props
    const isOpen = props.isOpen;
    const onClose = props.onClose;

    // Using Chakra UI's useDisclosure hook for managing the state of the checkout drawer
    const {
        isOpen: isOpenCheckoutRight,
        onOpen: onOpenCheckoutRight,
        onClose: onCloseCheckoutRight,
    } = useDisclosure();

    // State for drawer placement
    // eslint-disable-next-line no-unused-vars
    const [placement, setPlacement] = useState("left");

    // Redux hooks for dispatching actions and selecting state
    const dispatch = useDispatch();
    const allOrderItems = useSelector((state) => state?.OrderItemReducer);
    const allCartItems = allOrderItems?.items;

    // Logging cart items and total for debugging
    const AllOrderItemsTotal = allOrderItems?.total;

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
                <Drawer
                    placement={placement}
                    onClose={onClose}
                    isOpen={isOpen}
                    size="md"
                >
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
                            {/* Mapping through cart items and displaying them */}
                            {allCartItems?.map((item, index) => (
                                <Box
                                    key={index}
                                    borderWidth="1px"
                                    borderRadius="lg"
                                    overflow="hidden"
                                    mb={3}
                                >
                                    <Box p="6">
                                        <Flex justifyContent="space-between" alignItems="center">
                                            <Box display="flex" alignItems="center">
                                                <Image
                                                    borderRadius="full"
                                                    boxSize="50px"
                                                    src={item?.pic}
                                                    alt="Food-Image"
                                                />
                                                <Box marginLeft={"1rem"}>
                                                    <Text
                                                        mt="1"
                                                        display={"flex"}
                                                        alignItems={"center"}
                                                        fontWeight="semibold"
                                                        as="h4"
                                                        lineHeight="tight"
                                                        isTruncated
                                                    >
                                                        {item?.orderName}
                                                        <BiSolidTrash
                                                            size={"20"}
                                                            style={{
                                                                marginLeft: "8px",
                                                                marginTop: "2px",
                                                                cursor: "pointer",
                                                                color: "red",
                                                            }}
                                                            onClick={() =>
                                                                handleRemoveItemOrderCompletely(item._id)
                                                            }
                                                        />
                                                    </Text>
                                                    <Text
                                                        mt="1"
                                                        fontWeight="semibold"
                                                        as="h4"
                                                        lineHeight="tight"
                                                        isTruncated
                                                    >
                                                        {item?.quantity} X {item?.priceVal}
                                                        {item?.priceUnit === "Euro"
                                                            ? " €"
                                                            : item?.priceUnit}
                                                    </Text>
                                                </Box>
                                            </Box>
                                            <Flex
                                                background={"#fa4a0c"}
                                                color={"white"}
                                                gap={"1rem"}
                                                borderRadius={"50px"}
                                                paddingRight={"10px"}
                                                paddingLeft={"10px"}
                                                alignItems="center"
                                            >
                                                <Text
                                                    style={{
                                                        cursor: "pointer",
                                                        userSelect: "none",
                                                        fontSize: "20px",
                                                    }}
                                                    onClick={() => handleAddItemOrder(item)}
                                                >
                                                    +
                                                </Text>
                                                <Text
                                                    style={{
                                                        cursor: "pointer",
                                                        userSelect: "none",
                                                        fontSize: "20px",
                                                    }}
                                                    onClick={() => handleRemoveItemOrder(item._id)}
                                                >
                                                    -
                                                </Text>
                                            </Flex>
                                        </Flex>
                                        <Box
                                            display={"flex"}
                                            justifyContent={"end"}
                                            marginTop={"0.5rem"}
                                        >
                                            {item?.quantity * item?.priceVal}{" "}
                                            {item?.priceUnit === "Euro" ? " €" : item?.priceUnit}
                                        </Box>
                                    </Box>
                                </Box>
                            ))}
                            {/* Display subtotal and checkout button if there are items in the cart */}
                            {allCartItems?.length > 0 ? (
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
                                        onClick={onOpenCheckoutRight}
                                    >
                                        Checkout
                                    </Button>
                                </Box>
                            ) : (
                                // No items in cart show your cart is empty
                                <EmptyCart />
                            )}
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>
            </>
        </div>
    );
};

export default DineInDrawer;
