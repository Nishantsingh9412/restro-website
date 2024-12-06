import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  Box,
  Flex,
  Heading,
  Spacer,
  HStack,
  SimpleGrid,
} from "@chakra-ui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeliveryBoyCard from "./components/DeliveryBoyCard";
import { getDeliveryPersonnelsBySupplier } from "../../../api/index.js";

const OrderShipping = () => {
  const [loading, setLoading] = useState(true);
  const [onlineDelEmp, setOnlineDelEmp] = useState([]);

  const getOnlineDelEmpDeliveryEmployees = async () => {
    try {
      setLoading(true);
      const onlineDelEmpRes = await getDeliveryPersonnelsBySupplier();
      setOnlineDelEmp(
        onlineDelEmpRes?.data?.result.length ? onlineDelEmpRes.data.result : []
      );
    } catch (err) {
      toast.error("Error in getting onlineDelEmp delivery guys");
      console.error("Error in getting onlineDelEmp delivery guys", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOnlineDelEmpDeliveryEmployees();
  }, []);

  if (loading) {
    return (
      <Box
        mt="2vw"
        ml="2vw"
        p="4"
        bg="gray.50"
        minH="100vh"
        borderRadius={"10px"}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Heading size="lg">Loading...</Heading>
      </Box>
    );
  }

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
        <Heading size="lg">Active Delivery Partners</Heading>
        <Spacer />
        <HStack spacing="4"></HStack>
      </Flex>

      {onlineDelEmp.length === 0 ? (
        <Heading size="md" mt={"100"} textAlign={"center"}>
          No active delivery partners found.
        </Heading>
      ) : (
        <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing="4" mt="2">
          {onlineDelEmp.map((boy) => (
            <DeliveryBoyCard key={boy?._id} boy={boy} />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default OrderShipping;
