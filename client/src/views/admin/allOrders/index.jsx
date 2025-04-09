import { useEffect, useState, useCallback, useMemo } from "react";
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

  const dispatch = useDispatch();
  const showToast = useToast();
  const userId = useMemo(
    () => JSON.parse(localStorage.getItem("ProfileData"))?.result?._id,
    []
  );
  const adminData = useSelector((state) => state?.userReducer?.data);
  const AllOrderItemsLength = useSelector(
    (state) => state.OrderItemReducer?.length
  );

  const [searchState, setSearchState] = useState({
    searchTerm: "",
    searchResults: [],
    searchPerformed: false,
  });
  const [allItemsData, setAllItemsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [IsCartClicked, setIsCartClicked] = useState(false);
  const [isVerified, setIsVerified] = useState(true);
  const [isPermitted, setIsPermitted] = useState(true);

  const handleSearch = useCallback(() => {
    const { searchTerm } = searchState;

    if (!searchTerm.trim()) {
      setSearchState((prevState) => ({
        ...prevState,
        searchResults: [],
        searchPerformed: false,
      }));
      return;
    }

    const results = Object.values(allItemsData)
      .flat()
      .filter((item) =>
        item.orderName.toLowerCase().includes(searchTerm.toLowerCase())
      );

    setSearchState((prevState) => ({
      ...prevState,
      searchResults: results,
      searchPerformed: true,
    }));
  }, [searchState, allItemsData]);

  const handleAddItemOrder = (product) => {
    if (product) {
      dispatch({ type: "ADD_ORDER_ITEM_TEMP", data: product });
    }
  };

  const handleVerifyRestaurant = () => {
    onRestaurantModalOpen();
    setIsVerified(true);
  };

  const handleCartClick = (type) => {
    if (!adminData?.isVerified && adminData?.role === "admin") {
      setIsVerified(false);
      return;
    }
    if (type === 1) onOpenDineIn();
    else if (type === 2) onOpenCart();
    else onOpenTakeAway();
  };

  const handleSubmitItemOrder = (data) => {
    data.created_by = userId;
    const actionPromise = editItem
      ? dispatch(updateSingleItemOrderAction(editItem._id, data))
      : dispatch(AddOrderItemAction(data));

    setEditItem(null);

    const AddOrEditItemPromise = actionPromise.then((res) => {
      if (res.success) {
        dispatch(getAllOrderItemsAction(userId)).then((res) => {
          if (res.success) setAllItemsData(groupByCategory(res?.data));
          else showToast(res.message, "error");
        });
      } else {
        throw new Error(res.message);
      }
    });

    toast.promise(AddOrEditItemPromise, {
      pending: editItem
        ? "Processing Edit of Item..."
        : "Processing Addition of Item...",
      success: editItem
        ? "Item Edited Successfully"
        : "Item Added Successfully",
      error: (err) => err.message,
    });
  };

  const handleEditItem = (product) => {
    setEditItem(product);
    onOpenItem();
  };

  const handleDeleteItem = (product) => {
    const deleteItemPromise = dispatch(
      deleteSingleItemOrderAction(product._id)
    ).then((res) => {
      if (res.success) {
        dispatch(getAllOrderItemsAction(userId)).then((res) => {
          if (res.success) setAllItemsData(groupByCategory(res?.data));
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

  const groupByCategory = useMemo(
    () => (data) => {
      return data.reduce((acc, item) => {
        const category = item.category || "Common";
        if (!acc[category]) acc[category] = [];
        acc[category].push(item);
        return acc;
      }, {});
    },
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const allItemsRes = await dispatch(getAllOrderItemsAction());

        if (!allItemsRes.success) {
          showToast(allItemsRes.message, "error");
          if (allItemsRes.status === 403) setIsPermitted(false);
        } else {
          setAllItemsData(groupByCategory(allItemsRes.data));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, showToast, userId, groupByCategory]);

  if (!isPermitted) return <ForbiddenPage isPermitted={isPermitted} />;

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

  const renderSearchBox = () => {
    const { searchTerm } = searchState;

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
              setSearchState({ searchTerm: "", searchPerformed: false })
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
            setSearchState({ searchTerm: term, searchPerformed: !!term });
            if (term.trim()) handleSearch();
          }}
        />
      </InputGroup>
    );
  };

  const renderSearchResults = (data) => {
    const { searchResults, searchPerformed } = searchState;

    if (searchPerformed) {
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
                    onClick={() => handleEditItem(result)}
                  />
                  <DeleteIcon
                    cursor="pointer"
                    fontSize="20px"
                    color="red.500"
                    onClick={() => handleDeleteItem(result)}
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
              gridTemplateColumns="repeat(auto-fill, minmax(220px, 1fr))"
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
                        onClick={() => handleEditItem(item)}
                      />
                      <DeleteIcon
                        cursor="pointer"
                        fontSize="24px"
                        color="red.500"
                        onClick={() => handleDeleteItem(item)}
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
          {!IsCartClicked && (
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
          )}
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
        </Box>
        <ItemModal
          isOpen={isOpenItem}
          onClose={() => {
            setEditItem(null);
            onCloseItem();
          }}
          onSubmitData={handleSubmitItemOrder}
          data={editItem}
        />

        <Box display="flex" gap="1rem">
          <Box flex="1">
            {renderSearchBox()}
            {renderSearchResults(allItemsData)}
          </Box>
        </Box>
        <CartDrawer isOpen={isOpenCart} onClose={onCloseCart} />
        <DineInDrawer isOpen={isOpenDineIn} onClose={onCloseDineIn} />
        <TakeawayDrawer isOpen={isOpenTakeAway} onClose={onCloseTakeAway} />
        <RestaurantModal
          isOpen={isRestaurantModalOpen}
          onClose={onRestaurantModalClose}
        />
      </Box>

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
