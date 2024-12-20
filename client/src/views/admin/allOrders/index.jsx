import { useEffect, useState, useCallback } from "react";
import { MdCancel } from "react-icons/md";
import { FaCartShopping } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Image,
  useDisclosure,
  Text,
  Box,
  Input,
  Button,
  InputLeftElement,
  InputGroup,
  List,
  InputRightElement,
  Badge,
  Spinner,
} from "@chakra-ui/react";
import { IoMdSearch } from "react-icons/io";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { FiPlusCircle } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

import {
  AddOrderItemAction,
  getAllOrderItemsAction,
  searchOrderItemAction,
  searchDrinksOnlyAction,
  getDrinksOnlyAction,
  deleteSingleItemOrderAction,
  updateSingleItemOrderAction,
} from "../../../redux/action/OrderItems";
import CartDrawer from "./components/CartDrawer";
import ItemModal from "./components/ItemModal";
import DineInDrawer from "./components/DineInDrawer";
import TakeawayDrawer from "./components/TakeAwayDrawer";
import RestaurantModal from "../../../components/restaurant/restaurantModal";

export default function AllOrders() {
  // Chakra UI hooks for modal and drawer states
  const {
    isOpen: isOpenItem,
    onOpen: onOpenItem,
    onClose: onCloseItem,
  } = useDisclosure();
  const {
    isOpen: isOpenCart,
    onOpen: onOpenCart,
    onClose: onCloseCart,
  } = useDisclosure();
  const {
    isOpen: isOpenDrinks,
    onOpen: onOpenDrinks,
    onClose: onCloseDrinks,
  } = useDisclosure();
  const {
    isOpen: isOpenDineIn,
    onOpen: onOpenDineIn,
    onClose: onCloseDineIn,
  } = useDisclosure();

  const {
    isOpen: isOpenTakeAway,
    onOpen: onOpenTakeAway,
    onClose: onCloseTakeAway,
  } = useDisclosure();

  const {
    isOpen: isRestaurantModalOpen,
    onOpen: onRestaurantModalOpen,
    onClose: onRestaurantModalClose,
  } = useDisclosure();

  // Redux hooks
  const dispatch = useDispatch();
  const userId = JSON.parse(localStorage.getItem("ProfileData"))?.result?._id;

  // State variables
  const [searchState, setSearchState] = useState({
    searchTerm: "",
    searchResults: [],
    searchPerformed: false,
  });

  const [searchStateDrinks, setSearchStateDrinks] = useState({
    searchTerm: "",
    searchResults: [],
    searchPerformed: false,
  });
  // Selector to get the length of all order items
  const AllOrderItemsLength = useSelector(
    (state) => state.OrderItemReducer?.length
  );
  // Get admin data from Redux store
  const adminData = useSelector((state) => state?.userReducer?.data);

  const [allOrderTotal, setAllOrderTotal] = useState(0);
  const [allItemsData, setAllItemsData] = useState([]);
  const [drinksData, setDrinksData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editDrink, setEditDrink] = useState(null);
  const [IsCartClicked, setIsCartClicked] = useState(false);
  const [isVerified, setIsVerified] = useState(true);

  // Function to handle search
  const handleSearch = useCallback(
    (isDrink) => {
      const { searchTerm } = isDrink ? searchStateDrinks : searchState;
      const action = isDrink ? searchDrinksOnlyAction : searchOrderItemAction;

      dispatch(action(searchTerm, userId)).then((res) => {
        if (res.success) {
          const setSearchStateFn = isDrink
            ? setSearchStateDrinks
            : setSearchState;
          setSearchStateFn((prevState) => ({
            ...prevState,
            searchResults: res?.data,
          }));
        } else {
          console.error("Search error: " + res.message);
        }
      });
    },
    [dispatch, searchState, searchStateDrinks, userId]
  );

  const handleVerifyRestaurant = () => {
    onRestaurantModalOpen();
    setIsVerified(true);
  };

  const handleCartClick = (type) => {
    if (!adminData?.isVerified) {
      setIsVerified(false);
      return;
    }
    if (type === 1) {
      onOpenDineIn();
    } else if (type === 2) {
      onOpenCart();
    } else {
      onOpenTakeAway();
    }
  };

  // Function to handle submission of item order
  const handleSubmitItemOrder = (data) => {
    data.created_by = userId;
    const actionType = editItem ? "edit" : "add";
    const actionPromise =
      actionType === "edit"
        ? dispatch(updateSingleItemOrderAction(editItem._id, data))
        : dispatch(AddOrderItemAction(data));
    setEditItem(null);
    const AddOrEditItemPromise = actionPromise.then((res) => {
      if (res.success) {
        const action = data.isDrink
          ? getDrinksOnlyAction
          : getAllOrderItemsAction;
        dispatch(action(userId)).then((res) => {
          if (res.success) {
            data.isDrink
              ? setDrinksData(res?.data)
              : setAllItemsData(res?.data);
          } else {
            console.error("Error fetching data");
          }
        });
      } else {
        throw new Error(res.message);
      }
    });

    toast.promise(AddOrEditItemPromise, {
      pending:
        actionType === "edit"
          ? "Processing Edit of Item..."
          : "Processing Addition of Item...",
      success:
        actionType === "edit"
          ? "Item Edited Successfully"
          : "Item Added Successfully",
      error: (err) => err.message,
    });
  };

  // Function to handle adding item to order
  const handleAddItemOrder = (product) => {
    if (product) {
      setAllOrderTotal(allOrderTotal + product.priceVal);
      dispatch({ type: "ADD_ORDER_ITEM_TEMP", data: product });
    }
  };

  // Function to handle editing an item
  const handleEditItem = (product, isDrink) => {
    isDrink ? setEditDrink(product) : setEditItem(product);
    isDrink ? onOpenDrinks() : onOpenItem();
  };

  const handleClose = () => {
    setEditItem(null);
    setEditDrink(null);
    onCloseItem();
    onCloseDrinks();
  };

  // Function to handle deleting an item
  const handleDeleteItem = (product, isDrink) => {
    const action = isDrink ? setDrinksData : setAllItemsData;
    const actionType = isDrink ? getDrinksOnlyAction : getAllOrderItemsAction;
    const deleteItemPromise = dispatch(
      deleteSingleItemOrderAction(product._id)
    ).then((res) => {
      if (res.success) {
        dispatch(actionType(userId)).then((res) => {
          if (res.success) {
            action(res?.data);
          } else {
            console.error("Error fetching data");
          }
        });
        return res.message;
      } else {
        throw new Error("Error Deleting Item");
      }
    });
    toast.promise(deleteItemPromise, {
      pending: "Deleting Item...",
      success: "Item Deleted Successfully",
      error: "Error in Deleting Item",
    });
  };

  // useEffect to fetch data on component mount
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const [allItemsRes, drinksRes] = await Promise.all([
        dispatch(getAllOrderItemsAction(userId)),
        dispatch(getDrinksOnlyAction(userId)),
      ]);
      if (allItemsRes.success) setAllItemsData(allItemsRes?.data);
      if (drinksRes.success) setDrinksData(drinksRes?.data);
      setLoading(false);
    };
    fetchData();
  }, [dispatch, userId]);

  // Function to render search box
  const renderSearchBox = (isDrink) => {
    const { searchTerm } = isDrink ? searchStateDrinks : searchState;
    const setSearchTerm = isDrink ? setSearchStateDrinks : setSearchState;

    return (
      <InputGroup mb="1rem">
        <InputLeftElement pointerEvents={"none"}>
          <IoMdSearch size={"20"} />
        </InputLeftElement>
        <InputRightElement>
          <MdCancel
            size={"20"}
            style={{ cursor: "pointer" }}
            onClick={() =>
              setSearchTerm({ searchTerm: "", searchPerformed: false })
            }
          />
        </InputRightElement>
        <Input
          paddingLeft={"2.5rem"}
          borderRadius={"50px"}
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => {
            const term = e.target.value;
            setSearchTerm({ searchTerm: term, searchPerformed: !!term });
            if (term.trim()) handleSearch(isDrink);
          }}
        />
      </InputGroup>
    );
  };

  // Function to render search results
  const renderSearchResults = (data, isDrink) => {
    const searchResults = isDrink
      ? searchStateDrinks.searchResults
      : searchState.searchResults;
    const isSearchPerformed = isDrink
      ? searchStateDrinks.searchPerformed
      : searchState.searchPerformed;

    if (isSearchPerformed) {
      return (
        <List mt={2}>
          {searchResults?.map((result, index) => (
            <Box
              key={index}
              p="4"
              mb={3}
              borderWidth="1px"
              borderRadius="lg"
              boxShadow="sm"
              position="relative"
            >
              <Box display="flex" alignItems="center">
                <Image
                  borderRadius="full"
                  boxSize="50px"
                  src={result?.pic}
                  alt="Food-Image"
                />
                <Box ml="1rem">
                  <Text fontWeight="semibold" as="h4">
                    {result?.orderName}
                  </Text>
                  <Text fontWeight="semibold" as="h4">
                    {result?.priceVal} {result?.priceUnit}
                  </Text>
                </Box>
              </Box>
              <Box
                position="relative"
                top="0"
                right="0"
                display="flex"
                gap="1rem"
                p="1"
              >
                <EditIcon
                  cursor="pointer"
                  onClick={() => handleEditItem(result, isDrink)}
                />
                <DeleteIcon
                  cursor="pointer"
                  color="red.500"
                  onClick={() => handleDeleteItem(result, isDrink)}
                />
              </Box>
              <Box mt="2" display="flex" justifyContent="end">
                <Button
                  colorScheme="teal"
                  onClick={() => handleAddItemOrder(result)}
                >
                  Add To Cart
                </Button>
              </Box>
            </Box>
          ))}
        </List>
      );
    }

    return (
      <Box
        mt="1rem"
        display="grid"
        gridTemplateColumns="repeat(2, 1fr)"
        gap={6}
      >
        {data.map((item) => (
          <Box
            key={item._id}
            p="4"
            borderWidth="1px"
            borderRadius="lg"
            boxShadow="sm"
            display="flex"
            flexDir="column"
          >
            <Box display="flex" justifyContent={"space-between"}>
              <Box>
                <Image
                  borderRadius="full"
                  boxSize="50px"
                  src={item?.pic}
                  alt="Food-Image"
                />
                <Text mt="1" fontWeight="semibold">
                  {item?.orderName}
                </Text>
                <Text fontSize={14} fontWeight="normal">
                  {item?.priceVal} {item?.priceUnit}
                </Text>
              </Box>
              <Box display="flex" gap="3" p="1" flexDir={"column"}>
                <EditIcon
                  cursor="pointer"
                  fontSize={20}
                  onClick={() => handleEditItem(item, isDrink)}
                />
                <DeleteIcon
                  cursor="pointer"
                  color="red.500"
                  fontSize={20}
                  onClick={() => handleDeleteItem(item, isDrink)}
                />
              </Box>
            </Box>
            <Button
              mt="2"
              colorScheme="teal"
              onClick={() => handleAddItemOrder(item)}
            >
              Add To Cart
            </Button>
          </Box>
        ))}
      </Box>
    );
  };

  // Render loading spinner if data is still loading
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="50vh"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  // Main component render
  return (
    <>
      {!isVerified && (
        <Box
          bg="red"
          color="white"
          p="0.5rem"
          textAlign="center"
          fontSize={"18"}
          animation="blinking 1s ease 2"
        >
          Your restaurant is not verified. Please verify to begin checkout.
          <Button
            ml="1rem"
            colorScheme="yellow"
            onClick={handleVerifyRestaurant}
          >
            Verify Now
          </Button>
        </Box>
      )}
      <Box mt="2vw" p="2rem" bg="#f7f7f7">
        <ToastContainer />
        <Box display="flex" justifyContent="space-between" mb="2rem">
          <Button
            leftIcon={<FiPlusCircle />}
            colorScheme="teal"
            onClick={onOpenItem}
          >
            Add Items
          </Button>
          <Box position="relative">
            <Button
              leftIcon={<FaCartShopping />}
              colorScheme="teal"
              onClick={() => setIsCartClicked(!IsCartClicked)}
            >
              Cart
            </Button>
            <Badge
              position="absolute"
              top="-2"
              right="-2"
              colorScheme="teal"
              borderRadius="full"
            >
              {AllOrderItemsLength}
            </Badge>
          </Box>
          {IsCartClicked && (
            <Box>
              <Button
                onClick={() => handleCartClick(1)}
                colorScheme="yellow"
                variant="solid"
                mr={2}
              >
                Dine-In
              </Button>
              <Button
                onClick={() => handleCartClick(2)}
                colorScheme="orange"
                variant="solid"
                mr={2}
              >
                Deliver
              </Button>
              <Button
                onClick={() => handleCartClick(3)}
                colorScheme="red"
                variant="solid"
              >
                TakeAway
              </Button>
            </Box>
          )}
          <Button
            leftIcon={<FiPlusCircle />}
            colorScheme="teal"
            onClick={onOpenDrinks}
          >
            Add Drinks
          </Button>
        </Box>
        {/* Food Modal */}
        <ItemModal
          isOpen={isOpenItem}
          onClose={handleClose}
          isDrink={false}
          onSubmitData={handleSubmitItemOrder}
          data={editItem}
        />
        {/* Drink Modal */}
        <ItemModal
          isOpen={isOpenDrinks}
          onClose={handleClose}
          isDrink={true}
          onSubmitData={handleSubmitItemOrder}
          data={editDrink}
        />
        <Box display="flex" gap="2rem">
          {[
            { data: allItemsData, isDrink: false },
            { data: drinksData, isDrink: true },
          ].map((section, index) => (
            <Box key={index} flex="1">
              {renderSearchBox(section.isDrink)}
              {renderSearchResults(section.data, section.isDrink)}
            </Box>
          ))}
        </Box>
        <CartDrawer isOpen={isOpenCart} onClose={onCloseCart} />
        <DineInDrawer isOpen={isOpenDineIn} onClose={onCloseDineIn} />
        <TakeawayDrawer isOpen={isOpenTakeAway} onClose={onCloseTakeAway} />

        {/* Restaurant Modal */}
        <RestaurantModal
          isOpen={isRestaurantModalOpen}
          onClose={onRestaurantModalClose}
        />
      </Box>

      {/* CSS */}
      <style>
        {`
          @keyframes blinking {
            0% { background-color: red; }
            50% { background-color: darkred; }
            100% { background-color: red; }
          }
        `}
      </style>
    </>
  );
}
