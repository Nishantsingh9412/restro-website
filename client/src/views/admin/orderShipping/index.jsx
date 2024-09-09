import React, { useEffect, useRef, useState } from "react";
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
  Tooltip,
  Icon,
} from "@chakra-ui/react";
import { IoMdTrash } from "react-icons/io";
import { IoLocate, IoPencil } from "react-icons/io5";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CiSearch } from "react-icons/ci";
import { useLocation, useHistory } from "react-router-dom";

import AddDelperson from "./components/AddDelperson";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteSingleDelBoyAction,
  getAllDelboyzAction,
} from "../../../redux/action/delboy.js";
import EditDelPerson from "./components/EditDelPerson";

const OrderShipping = () => {
  const location = useLocation();
  const history = useHistory();

  // const dataOne = location?.state?.selectedItemTemp;

  const localUserData = JSON.parse(localStorage.getItem("ProfileData"));
  const localUserId = localUserData?.result?._id;

  const dispatch = useDispatch();
  const {
    isOpen: isOpenAdd,
    onOpen: onOpenAdd,
    onClose: onCloseAdd,
  } = useDisclosure();
  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();
    
  const [EditDelBoy, setEditDelBoy] = useState(false);
  const [EditDelBoyId, setEditDelBoyId] = useState(null);

  const allDelBoyz = useSelector((state) => state?.delBoyReducer?.delboyz);
  console.log(allDelBoyz);

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
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
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

  const handleEditDelBoy = (e,id) => {
    e.preventDefault();
    setEditDelBoyId(id);
    setEditDelBoy(true);
    onOpenEdit();
  }

  return (
    <div style={{ marginTop: "5vw", marginLeft: "4vw" }}>
      {/* <Button colorScheme="cyan" onClick={onOpen}>
        Allot Delivery Boy
      </Button> */}
      <Button colorScheme="cyan" onClick={handleAddDeliveryBoy} margin={"1rem"}>
        Add Delivery Boy
      </Button>

      {/* Component for Add Delivery Person Start */}
      <AddDelperson
        isOpen={isOpenAdd}
        onOpen={onOpenAdd}
        onClose={onCloseAdd}
      // initialRef={initialRef}
      // finalRef={finalRef}
      />
      {/* Component for Add Delivery Person End */}
      {/* {EditDelBoy && */}
        <EditDelPerson
          isOpen={isOpenEdit}
          onOpen={onOpenEdit}
          onClose={onCloseEdit}
          EditDelBoyId={EditDelBoyId}
        />
      {/* }./ */}


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
                <Tooltip
                  label={
                    boy?.liveLocationURL
                      ? "Click to see Location"
                      : "No Location Provided"
                  }
                >
                  <Button
                    aria-label="Live Location"
                    colorScheme={boy?.liveLocationURL ? "blue" : "red"}
                    variant={boy?.liveLocationURL ? "solid" : "outline"}
                    size="sm"
                    disabled={!boy?.liveLocationURL}
                    _disabled={{ pointerEvents: "none" }}
                    onClick={() =>
                      boy?.liveLocationURL
                        ? window.open(boy?.liveLocationURL)
                        : null
                    }
                    p={2}
                  >
                    <IoLocate />
                  </Button>
                </Tooltip>
                <IconButton
                  icon={<IoPencil />}
                  aria-label="Edit"
                  colorScheme="yellow"
                  size="sm"
                  onClick={(e) => handleEditDelBoy(e,boy._id)}
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
