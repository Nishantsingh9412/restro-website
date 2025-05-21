import { useEffect, useState, useCallback, useMemo } from "react";
import { MdCancel } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Input,
  Button,
  Spinner,
  Text,
  Image,
  List,
} from "@chakra-ui/react";
import { IoMdSearch } from "react-icons/io";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { FiPlusCircle } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { Dialog_Boxes, localStorageData } from "../../../utils/constant";
import {
  AddOrderItemAction,
  getAllOrderItemsAction,
  deleteSingleItemOrderAction,
  updateSingleItemOrderAction,
} from "../../../redux/action/OrderItems";
import ForbiddenPage from "../../../components/forbiddenPage/ForbiddenPage";
import AddEditItemModal from "./components/AddEditItemModal";
import { formatToGermanCurrency } from "../../../utils/utils";

export default function AllOrders() {
  const dispatch = useDispatch();
  const userId = useMemo(
    () =>
      JSON.parse(localStorage.getItem(localStorageData.PROFILE_DATA))?.result
        ?._id,
    []
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [allItemsData, setAllItemsData] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [isPermitted, setIsPermitted] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = useCallback(() => {
    const results = allItemsData.filter(
      (item) =>
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.itemId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(results);
  }, [searchTerm, allItemsData]);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, allItemsData, handleSearch]);

  const handleSubmitItemOrder = (data) => {
    const actionPromise = editItem
      ? dispatch(updateSingleItemOrderAction(editItem._id, data))
      : dispatch(AddOrderItemAction(data));

    setEditItem(null);

    const AddOrEditItemPromise = actionPromise.then((res) => {
      if (res.success) {
        dispatch(getAllOrderItemsAction(userId)).then((res) => {
          if (res.success) setAllItemsData(res?.data);
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

  const handleDeleteItem = (product) => {
    const deleteItemPromise = dispatch(
      deleteSingleItemOrderAction(product._id)
    ).then((res) => {
      if (res.success) {
        dispatch(getAllOrderItemsAction(userId)).then((res) => {
          if (res.success) setAllItemsData(res?.data);
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const allItemsRes = await dispatch(getAllOrderItemsAction());

        if (!allItemsRes.success) {
          if (allItemsRes.status === 403) setIsPermitted(false);
        } else {
          setAllItemsData(allItemsRes.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, userId]);

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

  return (
    <Box mt="2vw" p="2rem" bg="#f7f7f7">
      <ToastContainer />
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb="2rem"
      >
        <Box display="flex" alignItems="center" flex="1">
          <IoMdSearch size={20} />
          <Input
            ml="1rem"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <MdCancel
              size={20}
              style={{ cursor: "pointer", marginLeft: "1rem" }}
              onClick={() => {
                setSearchTerm("");
                setFilteredItems([]);
              }}
            />
          )}
        </Box>
        <Button
          leftIcon={<FiPlusCircle />}
          colorScheme="teal"
          onClick={() => setIsModalOpen(true)}
          ml="1rem"
        >
          Add Items
        </Button>
      </Box>

      <AddEditItemModal
        isOpen={isModalOpen}
        itemData={editItem}
        onSubmit={handleSubmitItemOrder}
        onClose={() => {
          setEditItem(null);
          setIsModalOpen(false);
        }}
      />

      <List>
        {(filteredItems.length > 0 ? filteredItems : allItemsData).map(
          (item) => (
            <Box
              key={item._id}
              p="4"
              mb="4"
              borderWidth="1px"
              borderRadius="lg"
              boxShadow="lg"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bg="white"
            >
              <Box display="flex" alignItems="center">
                <Image
                  borderRadius="lg"
                  boxSize="80px"
                  src={item?.pic}
                  alt="Food-Image"
                  objectFit="cover"
                  boxShadow="md"
                  mr="1rem"
                />
                <Box>
                  <Text fontWeight="bold" fontSize="lg" color="teal.600">
                    {item?.itemName} ({item?.category})
                  </Text>
                  <Text fontSize="md" color="gray.600">
                    {formatToGermanCurrency(item?.basePrice)}
                  </Text>
                </Box>
              </Box>
              <Box display="flex" gap="1rem">
                <EditIcon
                  cursor="pointer"
                  fontSize="20px"
                  color="blue.500"
                  onClick={() => {
                    setEditItem(item);
                    setIsModalOpen(true);
                  }}
                />
                <DeleteIcon
                  cursor="pointer"
                  fontSize="20px"
                  color="red.500"
                  onClick={() =>
                    Dialog_Boxes.showDeleteConfirmation(() =>
                      handleDeleteItem(item)
                    )
                  }
                />
              </Box>
            </Box>
          )
        )}
      </List>
    </Box>
  );
}
