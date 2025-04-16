import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  Flex,
  Input,
  Select,
  SimpleGrid,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { addToCart } from "../../../redux/action/cartItems";
import { useToast } from "../../../contexts/useToast";
import { getAllOrderItemsAction } from "../../../redux/action/OrderItems";
import ItemCard from "./components/ItemCard";
import ShowItemModal from "./components/ItemModal";
import CartDrawer from "./components/CartBox";

const OrderMenu = () => {
  const showToast = useToast();
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [allItemsData, setAllItemsData] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);

  const handleShowItem = (item) => {
    if (item) {
      setSelectedItem(item);
      onOpen();
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
      setLoading(true);
      try {
        const allItemsRes = await dispatch(getAllOrderItemsAction());
        if (!allItemsRes.success) {
          showToast(allItemsRes.message, "error");
        } else {
          setAllItemsData(groupByCategory(allItemsRes.data));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        showToast("Failed to fetch data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, showToast]);

  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100vh">
        <Box>
          <Spinner size="xl" color="teal.600" />
        </Box>
      </Flex>
    );
  }

  if (!allItemsData) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100vh">
        <Text fontSize="xl" color="teal.600">
          No items available
        </Text>
      </Flex>
    );
  }

  return (
    <Flex p={6} gap={6} flexWrap="wrap" justifyContent="space-between">
      {isOpen && (
        <ShowItemModal
          isOpen={isOpen}
          onClose={onClose}
          item={selectedItem}
          handleAddToCart={(item) => dispatch(addToCart(item))}
        />
      )}
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
              handleShowItem={handleShowItem}
            />
          ))}
        </SimpleGrid>
      </Box>

      {/* Right: Cart */}
      <CartDrawer />
    </Flex>
  );
};

export default OrderMenu;
