import { useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useToast } from "../contexts/useToast";
import {
  addSupplier,
  deleteSupplier,
  getAllSuppliers,
  updateSupplier,
} from "../api";

export function useSupplierActions() {
  // State
  const showToast = useToast();
  const [isLoading, setLoading] = useState(true);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  // Modals
  const modals = {
    supplierAddEditModal: useDisclosure(),
    supplierViewModal: useDisclosure(),
  };

  // Fetch suppliers on mount
  useEffect(() => {
    const fetchSuppliers = async () => {
      setLoading(true);
      try {
        const res = await getAllSuppliers();
        if (res?.status === 200 && Array.isArray(res?.data?.result)) {
          setSuppliers(res.data.result);
        } else {
          setSuppliers([]);
          showToast(res?.data?.message || "Failed to fetch suppliers.");
        }
      } catch (err) {
        setSuppliers([]);
        showToast("Error while fetching suppliers.");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Modal close handler
  const handleModalClose = () => {
    setSelectedSupplier(null);
    modals.supplierAddEditModal.onClose();
    modals.supplierViewModal.onClose();
  };

  // View supplier details
  const handleView = (id) => {
    const supplier = suppliers.find((s) => s._id === id);
    setSelectedSupplier(supplier);
    modals.supplierViewModal.onOpen();
  };

  // Edit supplier
  const handleEdit = (id) => {
    const supplier = suppliers.find((s) => s._id === id);
    setSelectedSupplier(supplier);
    modals.supplierAddEditModal.onOpen();
  };

  // Add or update supplier
  const handleSubmit = async (formData) => {
    try {
      if (selectedSupplier) {
        // Update supplier
        const res = await updateSupplier(selectedSupplier._id, formData);
        if (res?.status === 200 && res?.data?.success) {
          setSuppliers((prev) =>
            prev.map((s) =>
              s._id === selectedSupplier._id ? res.data.result : s
            )
          );
          showToast(
            res.data.message || "Supplier updated successfully!",
            "success"
          );
        } else {
          showToast(
            res?.data?.message || "Failed to update supplier.",
            "error"
          );
        }
      } else {
        // Add supplier
        const res = await addSupplier(formData);
        if (res?.status === 201 && res?.data?.success) {
          setSuppliers((prev) => [...prev, res.data.result]);
          showToast(
            res.data.message || "Supplier added successfully!",
            "success"
          );
        } else {
          showToast(res?.data?.message || "Failed to add supplier.", "error");
        }
      }
    } catch (err) {
      showToast("An error occurred. Please try again.", "error");
      console.error(err);
    } finally {
      setSelectedSupplier(null);
      modals.supplierAddEditModal.onClose();
    }
  };

  // Delete supplier
  const handleDelete = async (id) => {
    try {
      const res = await deleteSupplier(id);
      if (res?.status === 200 && res?.data?.success) {
        setSuppliers((prev) => prev.filter((s) => s._id !== id));
        showToast(
          res.data.message || "Supplier deleted successfully!",
          "success"
        );
      } else {
        showToast(res?.data?.message || "Failed to delete supplier.", "error");
      }
    } catch (err) {
      showToast("An error occurred while deleting supplier.", "error");
      console.error(err);
    }
  };

  return {
    modals,
    isLoading,
    suppliers,
    selectedSupplier,
    handleView,
    handleEdit,
    handleSubmit,
    handleDelete,
    handleModalClose,
  };
}
