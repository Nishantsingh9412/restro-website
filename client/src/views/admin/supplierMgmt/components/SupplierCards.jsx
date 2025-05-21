/* eslint-disable react/prop-types */
import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  Flex,
  Text,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Portal,
  useDisclosure,
  Button,
  Stack,
  Badge,
} from "@chakra-ui/react";
import { RxDotsVertical } from "react-icons/rx";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ViewSupplier from "./ViewSupplier";
import EditSupplier from "./SupplierModal.jsx";
import {
  deleteSupplierAction,
  getAllSuppliersAction,
} from "../../../../redux/action/supplier.js";

const SupplierCards = ({ data: allSuppliers, localStorageId }) => {
  const dispatch = useDispatch();
  const [selectedId, setSelectedId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();

  // Handle edit supplier action
  const handleEditSupplier = useCallback(
    (e, id) => {
      e.preventDefault();
      setSelectedId(id);
      onOpenEdit();
    },
    [onOpenEdit]
  );

  const handleOnItemModalClose = () => {
    setSelectedId(null);
    onCloseEdit();
  };

  // Handle confirm delete supplier action
  const handleConfirmDeleteSupplier = useCallback(
    (deleteId) => {
      const deleteItemPromise = dispatch(deleteSupplierAction(deleteId)).then(
        (res) => {
          if (res.success) {
            dispatch(getAllSuppliersAction(localStorageId));
            return res.message;
          } else {
            throw new Error("Error Deleting Item");
          }
        }
      );
      toast.promise(deleteItemPromise, {
        pending: "Deleting Item...",
        success: "Item Deleted Successfully",
        error: "Error in Deleting Item",
      });
    },
    [dispatch]
  );

  // Handle delete supplier action with confirmation
  const handleDeleteSupplier = useCallback(
    (e, id) => {
      e.preventDefault();
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        customClass: {
          popup: "swal-bg swal-border",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          handleConfirmDeleteSupplier(id);
        }
      });
    },
    [handleConfirmDeleteSupplier]
  );

  return (
    <Box p={2}>
      {/* Title */}
      <Text ml={2} fontWeight="900" color="#049CFD" fontSize="2xl">
        List Of All Suppliers
      </Text>
      <Flex flexWrap="wrap" p={2}>
        {allSuppliers && allSuppliers.length > 0 ? (
          allSuppliers.map((supplier, index) => (
            <Box
              key={supplier._id}
              width="270px"
              bg="white"
              boxShadow="lg"
              borderRadius="lg"
              overflow="hidden"
              m={3}
              transition="all 0.3s ease"
              _hover={{ transform: "scale(1.05)", boxShadow: "xl" }}
            >
              {/* Header Section */}
              <Flex
                justifyContent="space-between"
                alignItems="center"
                p={4}
                bg={index % 2 === 0 ? "blue.50" : "green.50"}
                borderBottomWidth="1px"
                borderColor="gray.200"
              >
                <Box>
                  <Text fontWeight="bold" fontSize="lg" color="gray.700">
                    {supplier.name}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Updated on {supplier.updatedAt.split("T")[0]}
                  </Text>
                </Box>
                <Image
                  borderRadius="full"
                  boxSize="50px"
                  src={supplier.pic}
                  alt={supplier.name}
                />
              </Flex>
              <Flex justifyContent={"space-between"}>
                {/* Items Section */}
                <Box p={4}>
                  <Stack spacing={2}>
                    {supplier.items.slice(0, 3).map((item, index) => (
                      <Text key={index} fontSize="sm" color="gray.600" as="li">
                        {item}
                      </Text>
                    ))}
                    {supplier.items.length > 3 && (
                      <Badge colorScheme="blue" fontSize="0.8em" p={1}>
                        +{supplier.items.length - 3} more items
                      </Badge>
                    )}
                  </Stack>

                  <Button
                    mt={3}
                    size="sm"
                    variant="solid"
                    colorScheme="blue"
                    onClick={() => {
                      onOpen();
                      setSelectedId(supplier._id);
                    }}
                  >
                    View Details
                  </Button>
                </Box>
                {/* Action Menu */}
                <Box position="relative" textAlign="right" p={4}>
                  <Menu>
                    <MenuButton>
                      <RxDotsVertical />
                    </MenuButton>
                    <Portal>
                      <MenuList>
                        <MenuItem
                          onClick={(e) => handleEditSupplier(e, supplier._id)}
                        >
                          Edit
                        </MenuItem>
                        <MenuItem
                          onClick={(e) => handleDeleteSupplier(e, supplier._id)}
                        >
                          Delete
                        </MenuItem>
                      </MenuList>
                    </Portal>
                  </Menu>
                </Box>
              </Flex>
            </Box>
          ))
        ) : (
          <Text m={3} fontWeight="600" color="gray.500" fontSize="lg">
            No suppliers available.
          </Text>
        )}
      </Flex>

      {/* Modals for Viewing and Editing */}
      <ViewSupplier
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        selectedId={selectedId}
      />
      <EditSupplier
        isOpen={isOpenEdit}
        onOpen={onOpenEdit}
        onClose={handleOnItemModalClose}
        selectedId={selectedId}
        isEdit={true}
      />
    </Box>
  );
};

export default React.memo(SupplierCards);
