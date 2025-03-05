import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Flex,
  Text,
  Center,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { getDeliveryBoys } from "../../../../api/index"; // Update the API function accordingly
import { useEffect, useState } from "react";
import { FiCheckCircle, FiCircle } from "react-icons/fi";
import { CircleLoader } from "react-spinners";
import { useToast } from "../../../../contexts/useToast";

export default function AllotDeliveryModal({
  isOpen,
  setIsOpen,
  onSubmit,
  orderId,
}) {
  const showToast = useToast();
  const [personnels, setPersonnels] = useState([]);
  const [selected, setSelected] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleSelect = (id) => {
    setSelected((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id]
    );
  };

  const handleSubmit = () => {
    onSubmit(personnels.filter((item) => selected.includes(item._id)));
    setIsOpen(false);
  };

  const handleSelectAll = () => {
    setSelected(personnels.map((p) => p._id));
  };

  useEffect(() => {
    const getPersonnels = async () => {
      try {
        setIsLoading(true);
        const res = await getDeliveryBoys(orderId);
        setPersonnels(res?.data?.result.length ? res.data.result : []);
      } catch (err) {
        showToast(err?.response?.data?.error, "error");
        console.error("Error in getting delivery boys", err.response);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      getPersonnels();
    }
    setSelected([]);
  }, [isOpen, orderId, showToast]);

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} isCentered={true}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Allot Delivery Boys</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isLoading ? (
            <Center my={20} display={"flex"} flexDirection={"column"} gap={2}>
              <CircleLoader />
              Loading...
            </Center>
          ) : personnels.length ? (
            <Flex
              flexDirection={"column"}
              gap={5}
              maxH={"400px"}
              overflowY={"auto"}
            >
              {personnels.map((p) => (
                <Flex key={p._id} gap={5} alignItems={"center"}>
                  <Button
                    onClick={() => handleSelect(p._id)}
                    colorScheme={selected.includes(p._id) ? "green" : "gray"}
                    width={"fit-content"}
                    leftIcon={
                      selected.includes(p._id) ? (
                        <FiCheckCircle />
                      ) : (
                        <FiCircle />
                      )
                    }
                  >
                    {p.name}
                  </Button>
                  <Text color={selected.includes(p._id) ? "green" : "#ccc"}>
                    Distance: {p?.distance?.toFixed(1)} KM
                  </Text>
                </Flex>
              ))}
            </Flex>
          ) : (
            <Text
              my={20}
              mx={"auto"}
              width={"fit-content"}
              textAlign={"center"}
              color={"#999"}
            >
              No delivery boys are available at this moment
            </Text>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            disabled={!selected.length}
            onClick={handleSubmit}
            pointerEvents={selected.length ? "auto" : "none"}
            bg={selected.length ? "blue.500" : "gray.300"}
          >
            Allot
          </Button>
          <Button
            colorScheme="teal"
            ml={3}
            onClick={handleSelectAll}
            disabled={!personnels.length}
          >
            Allot All
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

AllotDeliveryModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  orderId: PropTypes.string,
};
