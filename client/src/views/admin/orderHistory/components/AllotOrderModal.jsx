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
import { getOnlineEmployeesByRole } from "../../../../api/index"; // Update the API function accordingly
import { useEffect, useState } from "react";
import { FiCheckCircle, FiCircle } from "react-icons/fi";
import { CircleLoader } from "react-spinners";
import { useToast } from "../../../../contexts/useToast";

export default function AllotPersonnelModal({
  isOpen,
  setIsOpen,
  onSubmit,
  personnelType,
}) {
  const showToast = useToast();

  const [personnels, setPersonnels] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleSelect = (id) => {
    setSelected(id);
  };

  const handleSubmit = () => {
    onSubmit(personnels.find((item) => item?._id === selected));
    setIsOpen(false);
  };

  useEffect(() => {
    const getPersonnels = async () => {
      try {
        // if (!supplierId) return;
        setIsLoading(true);
        const res = await getOnlineEmployeesByRole(personnelType);
        setPersonnels(res?.data?.result.length ? res.data.result : []);
      } catch (err) {
        showToast(err?.response?.data?.error, "error");
        console.error(`Error in getting ${personnelType}`, err.response);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      getPersonnels();
    }
    setSelected(null);
  }, [isOpen, personnelType, showToast]);

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} isCentered={true}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Allot {personnelType}</ModalHeader>
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
                    colorScheme={selected === p._id ? "green" : "gray"}
                    width={"fit-content"}
                    leftIcon={
                      selected === p._id ? <FiCheckCircle /> : <FiCircle />
                    }
                  >
                    {p.name}
                  </Button>
                  <Text color={selected === p._id ? "green" : "#ccc"}>
                    Completed: {p.completedCount}
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
              No {personnelType} is available at this moment
            </Text>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            disabled={!selected}
            onClick={handleSubmit}
            pointerEvents={selected ? "auto" : "none"}
            bg={selected ? "blue.500" : "gray.300"}
          >
            Allot
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

AllotPersonnelModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  personnelType: PropTypes.string.isRequired,
};
