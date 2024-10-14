import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  Box,
  Button,
  Flex,
  Heading,
  Spacer,
  HStack,
  SimpleGrid,
  useDisclosure,
} from "@chakra-ui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import DeliveryBoyModal from "./components/DeliveryBoyModal.jsx";
import SearchModal from "./components/SearchModal";
import DeliveryBoyCard from "./components/DeliveryBoyCard";
import {
  deleteSingleDelBoyAction,
  getAllDelboyzAction,
} from "../../../redux/action/delboy.js";

const OrderShipping = () => {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editData, setEditData] = useState(null);
  const [actionType, setActionType] = useState("add");
  const [filteredDelBoys, setFilteredDelBoys] = useState([]);

  // Get all delivery boys from the Redux store
  const allDelBoyz = useSelector((state) => state?.delBoyReducer?.delboyz);

  // Search delivery boys by name or other criteria
  const handleSearch = (query) => {
    const filtered = allDelBoyz.filter(
      (boy) => boy.name.toLowerCase().includes(query.toLowerCase()) // Case-insensitive search by name
    );
    setFilteredDelBoys(filtered); // Update filtered results
  };

  const {
    isOpen: isOpenAdd,
    onOpen: onOpenAdd,
    onClose: onCloseAdd,
  } = useDisclosure();

  // Fetch all delivery boys when the component mounts
  useEffect(() => {
    dispatch(getAllDelboyzAction());
  }, [dispatch]);

  // Open the modal to add a new delivery boy
  const handleAddDeliveryBoy = () => {
    onOpenAdd();
  };

  // Open the modal and edit the existing delivery boy
  const handleEditDeliveryBoy = (boy) => {
    onOpenAdd();
    setEditData(boy);
    setActionType("edit");
  };

  // Confirm and delete a delivery boy
  const handleConfirmDeleteDelBoy = async (id) => {
    const res = await dispatch(deleteSingleDelBoyAction(id));
    if (res.success) {
      dispatch(getAllDelboyzAction());
      toast.success("Delivery Boy Deleted Successfully");
    } else {
      toast.error("Error Deleting Item");
    }
  };

  // Show confirmation dialog before deleting a delivery boy
  const handleDeleteDelboy = (e, id) => {
    e.preventDefault();
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleConfirmDeleteDelBoy(id);
      }
    });
  };

  //set to default value after closing the modal
  const handleOnClose = () => {
    setActionType("add");
    setEditData(null);
    onCloseAdd();
  };

  return (
    <Box
      mt="2vw"
      ml="2vw"
      p="4"
      bg="gray.50"
      minH="100vh"
      borderRadius={"10px"}
    >
      <ToastContainer />
      <Flex mb="4" alignItems="center">
        <Heading size="lg">Order Shipping</Heading>
        <Spacer />
        <HStack spacing="4">
          <Button colorScheme="cyan" onClick={onOpen}>
            Allot Delivery Boy
          </Button>
          <Button colorScheme="teal" onClick={handleAddDeliveryBoy}>
            Add Delivery Personnel
          </Button>
        </HStack>
      </Flex>

      {/* Search Delivery Modal */}
      <SearchModal isOpen={isOpen} onClose={onClose} onSearch={handleSearch} />

      {/* Add Delivery Person Component */}
      <DeliveryBoyModal
        isOpen={isOpenAdd}
        onOpen={onOpenAdd}
        onClose={handleOnClose}
        isEditMode={actionType === "edit"}
        initialData={editData}
      />

      {/* Delivery Boys List */}
      <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing="4" mt="2">
        {(filteredDelBoys.length ? filteredDelBoys : allDelBoyz).map((boy) => (
          <DeliveryBoyCard
            key={boy?._id}
            boy={boy}
            handleDeleteDelboy={handleDeleteDelboy}
            handleEdit={handleEditDeliveryBoy}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default OrderShipping;
