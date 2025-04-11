import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Flex,
  Input,
  Select,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import CartItem from "../allOrders/components/CartItem";
import { useToast } from "../../../contexts/useToast";
import { getAllOrderItemsAction } from "../../../redux/action/OrderItems";
import EmptyCart from "../allOrders/components/EmptyCart";
import ItemCard from "./components/ItemCard";

const OrderMenu = () => {
  const dispatch = useDispatch();
  const allOrderItems = useSelector((state) => state?.OrderItemReducer);
  const cartItems = allOrderItems?.items || [];
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [allItemsData, setAllItemsData] = useState({});
  const toast = useToast();

  const handleAddItemOrder = (item) => {
    dispatch({ type: "ADD_ORDER_ITEM_TEMP", data: item });
  };

  // Handler to remove an item completely from the order
  const handleRemoveItemOrderCompletely = (id) => {
    if (id) {
      dispatch({ type: "REMOVE_ORDER_ITEM_TEMP_COMPLETELY", data: id });
    }
  };

  // Handler to remove one quantity of an item from the order
  const handleRemoveItemOrder = (id) => {
    if (id) {
      dispatch({ type: "REMOVE_ORDER_ITEM_TEMP", data: id });
    }
  };

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

  const filteredMenu = Object.entries(allItemsData)
    .filter(
      ([category]) => filter === "all" || category.toLowerCase() === filter
    )
    // eslint-disable-next-line no-unused-vars
    .flatMap(([_, items]) =>
      items.filter((item) =>
        item.itemName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allItemsRes = await dispatch(getAllOrderItemsAction());
        if (!allItemsRes.success) {
          toast({
            title: "Error",
            description: allItemsRes.message,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        } else {
          setAllItemsData(groupByCategory(allItemsRes.data));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch data. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchData();
  }, [dispatch, toast]);

  return (
    <Flex p={6} gap={6} flexWrap="wrap" justifyContent="space-between">
      {/* Left: Menu List */}
      <Box flex="1" minW="300px" maxW="600px">
        <Flex mb={6} gap={4} alignItems="center">
          <Input
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            borderColor="teal.500"
            focusBorderColor="teal.600"
          />
          <Select
            w="200px"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            borderColor="teal.500"
            focusBorderColor="teal.600"
          >
            <option value="all">All</option>
            {Object.keys(allItemsData).map((category) => (
              <option key={category} value={category.toLowerCase()}>
                {category}
              </option>
            ))}
          </Select>
        </Flex>
        <SimpleGrid columns={[1, 1, 2]} spacing={6}>
          {filteredMenu.map((result, index) => (
            <ItemCard
              key={index}
              item={result}
              handleAddItemCart={handleAddItemOrder}
            />
          ))}
        </SimpleGrid>
      </Box>

      {/* Right: Cart */}
      <Box
        flex="1"
        minW="300px"
        maxW="400px"
        bg="gray.50"
        p={5}
        borderRadius="lg"
        boxShadow="md"
      >
        <Text fontSize="xl" fontWeight="bold" mb={4} color="teal.600">
          Your Cart
        </Text>
        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <SimpleGrid spacing={4}>
            {cartItems.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                onRemoveCompletely={handleRemoveItemOrderCompletely}
                onAdd={handleAddItemOrder}
                onRemove={handleRemoveItemOrder}
              />
            ))}
          </SimpleGrid>
        )}
        {cartItems.length > 0 && (
          <Button
            mt={4}
            colorScheme="teal"
            w="full"
            onClick={() => {
              // Handle checkout logic here
              console.log("Proceeding to checkout...");
            }}
          >
            Checkout
          </Button>
        )}
      </Box>
    </Flex>
  );
};

export default OrderMenu;
