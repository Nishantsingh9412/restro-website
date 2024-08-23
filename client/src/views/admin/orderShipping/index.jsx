import React, { useEffect, useRef } from "react";
import Swal from "sweetalert2";
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Text,
  InputLeftElement,
  InputGroup,
  SimpleGrid,
  IconButton,
} from "@chakra-ui/react";
import { IoMdTrash } from "react-icons/io";
import { IoLocate, IoPencil } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CiSearch } from "react-icons/ci";
import { useLocation } from "react-router-dom";

import AddDelperson from "./components/AddDelperson";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteSingleDelBoyAction,
  getAllDelboyzAction,
} from "../../../redux/action/delboy.js";

const OrderShipping = () => {
  const location = useLocation();

  // const dataOne = location?.state?.selectedItemTemp;

  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenAdd,
    onOpen: onOpenAdd,
    onClose: onCloseAdd,
  } = useDisclosure();
  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const allDelBoyz = useSelector((state) => state?.delBoyReducer?.delboyz);
  console.log(allDelBoyz);
  // console.log("ALLDAta")
  // console.log(aLLData);

  useEffect(() => {
    dispatch(getAllDelboyzAction());
  }, []);

  const handleAddDeliveryBoy = () => {
    onOpenAdd();
  };

  const handleConfirmDeleteDelBoy = (id) => {
    dispatch(deleteSingleDelBoyAction(id)).then((res) => {
      if (res.success) {
        dispatch(getAllDelboyzAction());
        toast.success("Delivery Boy Deleted Successfully");
      } else {
        toast.error("Error Deleting Item");
      }
    });
  };

  const handleDeleteDelboy = (e, id) => {
    e.preventDefault();
    const style = document.createElement("style");
    style.innerHTML = `
        .swal-bg {
            background-color: #F3F2EE !important;
        }
        .swal-border {
            border: 5px solid #fff !important;
        }`;
    document.head.appendChild(style);

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
        handleConfirmDeleteDelBoy(id);
      }
    });
  };

  // const handleEditDelBoy = (id) => {
  //     console.log('Edit Delboy', id);
  // }

  return (
    <div style={{ marginTop: "5vw", marginLeft: "4vw" }}>
      <ToastContainer />
      <Button colorScheme="cyan" onClick={onOpen}>
        Allot Delivery Boy
      </Button>

      <Button colorScheme="teal" onClick={handleAddDeliveryBoy} margin={"1rem"}>
        Add Delivery Personnel
      </Button>

      {/* Search Delivery Modal Start  */}
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent padding={"1rem"}>
          <ModalHeader display={"flex"} justifyContent={"center"}>
            {" "}
            Allot Delievery Boy{" "}
          </ModalHeader>
          <ModalCloseButton />
          <FormControl>
            <FormLabel>Search</FormLabel>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none" // Makes the element non-interactive
              >
                <CiSearch /> {/* Ensure CiSearch is correctly imported */}
              </InputLeftElement>
              <Input ref={initialRef} placeholder="Search" />
            </InputGroup>
          </FormControl>

          <ModalFooter>
            <Button colorScheme="blue" mr={3}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Search Delivery Modal End */}

      {/* Component for Add Delivery Person Start */}
      <AddDelperson
        isOpen={isOpenAdd}
        onOpen={onOpenAdd}
        onClose={onCloseAdd}
        // initialRef={initialRef}
        // finalRef={finalRef}
      />
      {/* Component for Add Delivery Person End */}

      {/* {
                dataOne?.map((item, index) => (
                    <Box key={index}
                        borderWidth="1px"
                        borderRadius="lg"
                        overflow="hidden"
                        mb={3}
                    >
                        <Box p="6">
                            <Box display="flex" alignItems="center">
                                <Box>
                                    <Image
                                        borderRadius='full'
                                        boxSize='50px'
                                        src={item?.pic}
                                        // src='https://bit.ly/dan-abramov'
                                        alt='Food-Image'
                                    />
                                </Box>
                                <Box marginLeft={'1rem'}>
                                    <Text mt="1" display={'flex'} fontWeight="semibold" as="h4" lineHeight="tight" isTruncated>
                                        {item?.orderName}
                                    </Text>
                                    <Text mt="1" fontWeight="semibold" as="h4" lineHeight="tight" isTruncated>
                                        {item?.quantity} X  {item?.priceVal}
                                        {item?.priceUnit === 'Euro' ? ' €' : item?.priceUnit}
                                    </Text>
                                </Box>
                            </Box>
                            <Box display={'flex'} justifyContent={'end'}>
                                {item?.quantity * item?.priceVal} {item?.priceUnit === 'Euro' ? ' €' : item?.priceUnit}
                            </Box>
                        </Box>

                    </Box>
                ))
            }
             */}
      {/* {allOrderTotal > 0 && (
                <Text
                    marginTop={'5px'}
                    display={'flex'}
                    justifyContent={'end'}
                    marginRight={'1rem'}
                >
                    Total : {parseFloat(allOrderTotal).toFixed(2)} €
                </Text>
            )} */}

      <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing="20px">
        {allDelBoyz.map((boy) => (
          <Box
            key={boy?._id}
            p="5"
            boxShadow="md"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
          >
            <Box display={"flex"} justifyContent={"space-between"}>
              <Box>
                <Text fontWeight="bold">{boy?.name}</Text>
              </Box>
              <Box>
                <IconButton
                  icon={<IoLocate />}
                  aria-label="Live Location"
                  colorScheme="blue"
                  size="sm"
                  onClick={() => history.push("live-location/" + boy?._id)}
                />
                <IconButton
                  icon={<IoPencil />}
                  aria-label="Edit"
                  colorScheme="yellow"
                  size="sm"
                  // onClick={() => handleEditDelBoy(e,boy._id)}
                />
                <IconButton
                  icon={<IoMdTrash />}
                  aria-label="Delete"
                  colorScheme="red"
                  size="sm"
                  onClick={(e) => handleDeleteDelboy(e, boy._id)}
                />
              </Box>
            </Box>

            <Text>Phone: {boy?.phone}</Text>
            <Text>Country Code: {boy?.country_code}</Text>
          </Box>
        ))}
      </SimpleGrid>
    </div>
  );
};

export default OrderShipping;
