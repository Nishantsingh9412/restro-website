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
import ForbiddenPage from "../../../components/forbiddenPage/ForbiddenPage";
import { useToast } from "../../../contexts/useToast";

export default function AllOrders() {
  // Selector to get the length of all order items
  const AllOrderItemsLength = useSelector(
    (state) => state.OrderItemReducer?.length
  );
  // Get admin data from Redux store
  const adminData = useSelector((state) => state?.userReducer?.data);
  const showToast = useToast();

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

  const [allOrderTotal, setAllOrderTotal] = useState(0);
  const [allItemsData, setAllItemsData] = useState([]);
  const [drinksData, setDrinksData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editDrink, setEditDrink] = useState(null);
  const [IsCartClicked, setIsCartClicked] = useState(false);
  const [isVerified, setIsVerified] = useState(true);
  const [isPermitted, setIsPermitted] = useState(true);

  // Function to handle search
  const handleSearch = useCallback(
    (isDrink) => {
      const { searchTerm } = isDrink ? searchStateDrinks : searchState;
      const action = isDrink ? searchDrinksOnlyAction : searchOrderItemAction;

      dispatch(action(searchTerm)).then((res) => {
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
    [dispatch, searchState, searchStateDrinks]
  );

  const handleVerifyRestaurant = () => {
    onRestaurantModalOpen();
    setIsVerified(true);
  };

  const handleCartClick = (type) => {
    //TODO: Check if restaurant is verified and handle the employee cases
    if (!adminData?.isVerified && adminData?.role === "admin") {
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
    const isEdit = editItem || editDrink;
    const actionPromise = isEdit
      ? dispatch(updateSingleItemOrderAction(isEdit._id, data))
      : dispatch(AddOrderItemAction(data));
    setEditItem(null);
    setEditDrink(null);
    const AddOrEditItemPromise = actionPromise.then((res) => {
      if (res.success) {
        const action = data.isDrink
          ? getDrinksOnlyAction
          : getAllOrderItemsAction;
        dispatch(action(userId)).then((res) => {
          if (res.success) {
            data.isDrink
              ? setDrinksData(groupByCategory(res?.data))
              : setAllItemsData(groupByCategory(res?.data));
          } else {
            console.error("Error fetching data");
          }
        });
      } else {
        throw new Error(res.message);
      }
    });

    toast.promise(AddOrEditItemPromise, {
      pending: isEdit
        ? "Processing Edit of Item..."
        : "Processing Addition of Item...",
      success: isEdit ? "Item Edited Successfully" : "Item Added Successfully",
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
  // Group by category the coming data
  const groupByCategory = (data) => {
    return data.reduce((acc, item) => {
      const category = item.category || "Uncategorized";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {});
  };

  // useEffect to fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [allItemsRes, drinksRes] = await Promise.all([
          dispatch(getAllOrderItemsAction()),
          dispatch(getDrinksOnlyAction()),
        ]);

        if (!allItemsRes.success || !drinksRes.success) {
          showToast(allItemsRes.message || drinksRes.message, "error");
          if (allItemsRes.status === 403 || drinksRes.status === 403) {
            setIsPermitted(false);
          }
        } else {
          setAllItemsData(groupByCategory(allItemsRes.data));
          setDrinksData(groupByCategory(drinksRes.data));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, showToast, userId]);

  if (!isPermitted) {
    return <ForbiddenPage isPermitted={isPermitted} />;
  }

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
        <List mt={4}>
          {searchResults?.map((result, index) => (
            <Box
              key={index}
              p="6"
              mb={5}
              borderWidth="1px"
              borderRadius="lg"
              boxShadow="lg"
              position="relative"
              bg="white"
              _hover={{ transform: "scale(1.02)", transition: "0.3s" }}
            >
              <Box display="flex" alignItems="center">
                <Image
                  borderRadius="lg"
                  boxSize="80px"
                  src={result?.pic}
                  alt="Food-Image"
                  objectFit="cover"
                  boxShadow="md"
                />
                <Box ml="1.5rem" flex="1">
                  <Text fontWeight="bold" fontSize="lg" color="teal.600">
                    {result?.orderName}
                  </Text>
                  <Text fontSize="md" color="gray.600">
                    {result?.priceVal} {result?.priceUnit}
                  </Text>
                </Box>
                <Box display="flex" gap="1rem">
                  <EditIcon
                    cursor="pointer"
                    fontSize="20px"
                    color="blue.500"
                    onClick={() => handleEditItem(result, isDrink)}
                  />
                  <DeleteIcon
                    cursor="pointer"
                    fontSize="20px"
                    color="red.500"
                    onClick={() => handleDeleteItem(result, isDrink)}
                  />
                </Box>
              </Box>
              <Box mt="4" display="flex" justifyContent="space-between">
                <Button
                  colorScheme="teal"
                  variant="solid"
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
      <Box mt="1rem">
        {Object.entries(data).map(([category, items]) => (
          <Box key={category} mb="2rem">
            <Text
              fontSize="xl"
              fontWeight="bold"
              color="teal.600"
              mb="0.5rem"
              textTransform="capitalize"
            >
              {category}
            </Text>
            <Box
              display="grid"
              gridTemplateColumns="repeat(auto-fit, minmax(220px, 1fr))"
              gap={4}
            >
              {items.map((item) => (
                <Box
                  key={item._id}
                  p="4"
                  borderWidth="1px"
                  borderRadius="lg"
                  boxShadow="lg"
                  bg="white"
                  maxWidth={"350px"}
                  transition="transform 0.3s, box-shadow 0.3s"
                  _hover={{
                    transform: "scale(1.02)",
                    boxShadow: "xl",
                  }}
                >
                  <Box display="flex" flexDir="column" alignItems="center">
                    <Image
                      borderRadius="lg"
                      boxSize="100px"
                      src={item?.pic}
                      alt="Food-Image"
                      objectFit="cover"
                      boxShadow="md"
                      mb="4"
                    />
                    <Text
                      mt="2"
                      fontWeight="bold"
                      fontSize="lg"
                      color="teal.600"
                      textAlign="center"
                    >
                      {item?.orderName}
                    </Text>
                    <Text
                      fontSize="md"
                      fontWeight="medium"
                      color="gray.600"
                      textAlign="center"
                    >
                      {item?.priceVal} {item?.priceUnit}
                    </Text>
                  </Box>
                  <Box
                    mt="4"
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Button
                      colorScheme="teal"
                      variant="solid"
                      onClick={() => handleAddItemOrder(item)}
                      flex="1"
                    >
                      Add To Cart
                    </Button>
                    <Box display="flex" gap="3" ml="4">
                      <EditIcon
                        cursor="pointer"
                        fontSize="24px"
                        color="blue.500"
                        onClick={() => handleEditItem(item, isDrink)}
                      />
                      <DeleteIcon
                        cursor="pointer"
                        fontSize="24px"
                        color="red.500"
                        onClick={() => handleDeleteItem(item, isDrink)}
                      />
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
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
        <Box display="flex" gap="1rem">
          <Box flex="1">
            {renderSearchBox(false)}
            {console.log(allItemsData)}
            {renderSearchResults(allItemsData, false)}
          </Box>

          {/* Custom divider */}
          <Box width="2px" minHeight={"100px"} bgColor="gray.300" />

          <Box flex="1">
            {renderSearchBox(true)}
            {renderSearchResults(drinksData, true)}
          </Box>
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
