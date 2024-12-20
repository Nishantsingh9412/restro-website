import { useEffect, useState } from "react";
import "react-phone-number-input/style.css";
import { GoPlusCircle } from "react-icons/go";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDisclosure } from "@chakra-ui/react";
import SupplierCards from "./components/SupplierCards";
import { Button, Spinner } from "@chakra-ui/react";

// Import actions and components
import {
  getAllSuppliersAction,
} from "../../../redux/action/supplier";
import SupplierModal from "./components/SupplierModal";

export default function SupplierManagement() {
  // Initialize dispatch and modal disclosure hooks
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Get user ID from local storage
  const localStorageId = JSON.parse(localStorage.getItem("ProfileData"))?.result
    ?._id;

  // Get suppliers and selected supplier from Redux store
  const allSuppliers = useSelector((state) => state.supplierReducer.suppliers);
  const selectedSupplier = useSelector(
    (state) => state.supplierReducer.selectedSupplier
  );

  // State for loading indicator
  const [loading, setLoading] = useState(true);

  // Fetch all suppliers on component mount
  useEffect(() => {
    setLoading(true);
    dispatch(getAllSuppliersAction(localStorageId)).finally(() => {
      setLoading(false);
    });
  }, [dispatch, localStorageId]);

  // Show loading spinner while data is being fetched
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
          color: "blue",
        }}
      >
        <Spinner size="xl" />
      </div>
    );
  }

  // Render supplier management UI
  return (
    <div>
      {/* Toast notifications */}
      <ToastContainer />

      {/* Button to open modal for adding a new supplier */}
      <Button
        leftIcon={<GoPlusCircle />}
        colorScheme="teal"
        variant="solid"
        onClick={onOpen}
        m={3}
        w={{ base: "100%", md: "auto" }}
      >
        Add Supplier
      </Button>

      {/* Supplier Cards */}
      <SupplierCards
        data={allSuppliers}
        selectedSupplier={selectedSupplier}
        localStorageId={localStorageId}
      />

      {/* Add Supplier Modal */}
      <SupplierModal isOpen={isOpen} onClose={onClose} />
    </div>
  );
}
