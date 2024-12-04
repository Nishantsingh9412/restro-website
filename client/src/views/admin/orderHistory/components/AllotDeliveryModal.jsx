import { CheckCircleIcon } from "@chakra-ui/icons";
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
import { getDeliveryPersonnelsBySupplier } from "../../../../api/index";
import { useEffect, useState } from "react";
import { FiCheckCircle, FiCircle } from "react-icons/fi";
import { CircleLoader } from "react-spinners";

// Dummy data for testing purposes
const dummy = Array.from({ length: 4 }, (_, i) => ({
  name: "Delivery guy",
  _id: i,
  completedCount: i,
}));

export default function AllotDeliveryBoyModal({
  isOpen,
  setIsOpen,
  onSubmit,
  supplierId,
}) {
  const [online, setOnline] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Handle selection of a delivery guy
  const handleSelect = (id) => {
    setSelected(id);
  };

  // Handle submission of the selected delivery guy
  const handleSubmit = () => {
    onSubmit(online.find((item) => item?._id === selected));
    setIsOpen(false);
  };

  // Fetch online delivery guys based on supplierId
  const getOnlineDeliveryGuys = async () => {
    try {
      if (!supplierId) return;
      setIsLoading(true);
      const onlineRes = await getDeliveryPersonnelsBySupplier(supplierId);
      setOnline(onlineRes?.data?.result.length ? onlineRes.data.result : []);
    } catch (err) {
      console.error("Error in getting online delivery guys", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to fetch delivery guys when modal is opened
  useEffect(() => {
    if (isOpen) {
      getOnlineDeliveryGuys();
    }
    setSelected(null);
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} isCentered={true}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Allot Delivery Guys</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isLoading ? (
            <Center my={20} display={"flex"} flexDirection={"column"} gap={2}>
              <CircleLoader />
              Loading...
            </Center>
          ) : online.length ? (
            <Flex
              flexDirection={"column"}
              gap={5}
              maxH={"400px"}
              overflowY={"auto"}
            >
              {online.map((o) => (
                <Flex key={o._id} gap={5} alignItems={"center"}>
                  <Button
                    onClick={() => handleSelect(o._id)}
                    colorScheme={selected === o._id ? "green" : "gray"}
                    width={"fit-content"}
                    leftIcon={
                      selected === o._id ? <FiCheckCircle /> : <FiCircle />
                    }
                  >
                    {o.name}
                  </Button>
                  <Text color={selected === o._id ? "green" : "#ccc"}>
                    Completed: {o.completedCount}
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
              No delivery guy is online at this moment
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
