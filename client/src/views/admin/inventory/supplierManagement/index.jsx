import { Box, Button, Flex, Spinner, Text } from "@chakra-ui/react";
import { GoPlusCircle } from "react-icons/go";
import ViewSupplier from "./components/ViewSupplier";
import AddEditSupplier from "./components/SupplierModal";
import SupplierCard from "./components/SupplierCard";
import { Dialog_Boxes } from "../../../../utils/constant";
import { useSupplierActions } from "../../../../hooks/useSupplierActions";

export default function SupplierManagement() {
  const {
    isLoading,
    suppliers,
    handleDelete,
    handleEdit,
    handleSubmit,
    selectedSupplier,
    handleView,
    handleModalClose,
    modals,
  } = useSupplierActions();

  const { supplierAddEditModal, supplierViewModal } = modals;
  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="50vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box p={4}>
      <Button
        leftIcon={<GoPlusCircle />}
        colorScheme="teal"
        onClick={supplierAddEditModal.onOpen}
        mb={5}
      >
        Add Supplier
      </Button>
      <Text fontWeight="bold" fontSize="2xl" mb={4} color="#049CFD">
        List Of All Suppliers
      </Text>
      <Flex wrap="wrap">
        {suppliers && suppliers.length > 0 ? (
          suppliers.map((supplier, index) => (
            <SupplierCard
              index={index}
              key={supplier._id}
              supplier={supplier}
              onEdit={handleEdit}
              onView={handleView}
              onDelete={(id) =>
                Dialog_Boxes.showDeleteConfirmation(() => handleDelete(id))
              }
            />
          ))
        ) : (
          <Text>No suppliers available.</Text>
        )}
      </Flex>
      {selectedSupplier && (
        <ViewSupplier
          isOpen={supplierViewModal.isOpen}
          onClose={handleModalClose}
          supplierData={selectedSupplier}
        />
      )}
      {supplierAddEditModal.isOpen && (
        <AddEditSupplier
          isOpen={supplierAddEditModal.isOpen}
          onClose={handleModalClose}
          selectedSupplierData={selectedSupplier}
          onSubmit={handleSubmit}
        />
      )}
    </Box>
  );
}
