/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Card,
  CardBody,
  CardFooter,
  Flex,
  Grid,
  Heading,
  Text,
  Button,
} from "@chakra-ui/react";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MdRestaurant, MdOutlineTimer } from "react-icons/md";
import { FaAngleRight } from "react-icons/fa6";
import { BiRefresh } from "react-icons/bi";
// import { toast } from "react-toastify";
import { useToast } from "../../../contexts/ToastContext";
import PropTypes from "prop-types";
import WaiterPerformanceChart from "./components/WaiterChart"; // hypothetical component
import { getWaiterDashboardDataAction } from "../../../redux/action/waiter";

// Card component with optional footerLink and footerText
const DashboardCard = ({
  title,
  icon,
  data,
  footerText,
  footerLink,
  color,
}) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardBody px={5}>
        <Flex justifyContent={"space-between"} mb={5}>
          <Heading fontSize={"24px"}>{title}</Heading>
          {icon}
        </Flex>
        {data}
      </CardBody>
      {footerLink && footerText && (
        <CardFooter
          bg={color}
          color={"white"}
          px={3}
          py={2}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"flex-end"}
          cursor={"pointer"}
          gap={3}
          onClick={() => navigate(footerLink)}
        >
          <Text>{footerText}</Text>
          <FaAngleRight />
        </CardFooter>
      )}
    </Card>
  );
};

// Loading or Error Display component
const LoadingOrError = ({ isLoading, isError }) => {
  if (isLoading) {
    return (
      <Text my={20} w={"fit-content"} mx={"auto"} fontSize={24}>
        Loading...
      </Text>
    );
  }
  if (isError) {
    return (
      <Text my={20} w={"fit-content"} mx={"auto"} color="red">
        Error loading data. Please try again.
      </Text>
    );
  }
  return null;
};

export default function WaiterDashboard() {
  const [utils, setUtils] = useState({ isLoading: true, isError: false });
  const user = JSON.parse(localStorage.getItem("ProfileData"));
  const data = useSelector((state) => state.waiter.data);
  const dispatch = useDispatch();
  const showToasts = useToast();

  const handleRefresh = useCallback(() => {
    if (user?.result?._id) {
      setUtils({ isLoading: true, isError: false });
      dispatch(getWaiterDashboardDataAction())
        .then(() => setUtils({ isLoading: false, isError: false }))
        .catch(() => setUtils({ isLoading: false, isError: true }));
    } else {
      // toast.error("User not found! Please login again.");
      showToasts("User not found! Please login again.", "error");
      setUtils({ isLoading: false, isError: true });
    }
  }, [dispatch, user]);

  useEffect(() => {
    handleRefresh();
    console.log("caliing apis");
  }, []);

  return (
    <div>
      <Flex
        flexWrap={"wrap"}
        gap={10}
        alignItems={"center"}
        justifyContent={"space-between"}
        mt={{ lg: 10, base: 24 }}
        mb={5}
      >
        <Heading fontSize={30}>Waiter Dashboard</Heading>
        <Button
          isLoading={utils.isLoading}
          leftIcon={<BiRefresh />}
          onClick={handleRefresh}
        >
          Refresh
        </Button>
      </Flex>

      <LoadingOrError isLoading={utils.isLoading} isError={utils.isError} />

      {!utils.isLoading && !utils.isError && data && (
        <>
          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              md: "repeat(2, 1fr)",
            }}
            gap={5}
          >
            <DashboardCard
              title="Today's Orders"
              icon={<MdRestaurant size={30} color="green" />}
              data={
                <Flex
                  flexDirection={{ md: "row", base: "column" }}
                  justifyContent={"space-between"}
                >
                  <Flex flexDirection={"column"}>
                    <Text fontWeight={"500"} fontSize={"larger"}>
                      Completed
                    </Text>
                    <Text
                      fontWeight={"600"}
                      fontSize={"xx-large"}
                      color={"green"}
                    >
                      {data.todayCompletedOrders || 0}
                    </Text>
                  </Flex>
                  <Flex flexDirection={"column"}>
                    <Flex gap={3}>
                      <Text>Pending:</Text>
                      <Text>{data.todayPendingOrders || 0}</Text>
                    </Flex>
                  </Flex>
                </Flex>
              }
              footerText="View Details"
              footerLink="/orders/today"
              color="green"
            />
            <DashboardCard
              title="Monthly Orders"
              icon={<MdRestaurant size={30} color="blue" />}
              data={
                <Flex
                  flexDirection={{ md: "row", base: "column" }}
                  justifyContent={"space-between"}
                >
                  <Flex flexDirection={"column"}>
                    <Text fontWeight={"500"} fontSize={"larger"}>
                      Completed
                    </Text>
                    <Text
                      fontWeight={"600"}
                      fontSize={"xx-large"}
                      color={"blue"}
                    >
                      {data.monthlyCompletedOrders || 0}
                    </Text>
                  </Flex>
                  <Flex flexDirection={"column"}>
                    <Flex gap={3} color={"red"}>
                      <Text>Pending:</Text>
                      <Text>{data.monthlyPendingOrders || 0}</Text>
                    </Flex>
                  </Flex>
                </Flex>
              }
              footerText="View History"
              footerLink="/orders/monthly"
              color="blue"
            />
          </Grid>

          <Box mt={5} bg={"#fff"}>
            <Heading fontSize={20} mb={5} pl={5} pt={5}>
              Performance Overview
            </Heading>
            <WaiterPerformanceChart
              weekly={data.weeklyOrders || []}
              monthly={data.monthlyOrders || []}
              yearly={data.yearlyOrders || []}
              totalTips={data.totalTips || 0}
            />
          </Box>

          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              md: "repeat(2, 1fr)",
            }}
            mt={5}
            gap={5}
          >
            <DashboardCard
              title="Serving Time"
              icon={<MdOutlineTimer size={30} color="purple" />}
              data={
                <Flex flexDirection={"column"} gap={5}>
                  <Flex flexDirection={"column"} alignItems={"center"}>
                    <Text fontWeight={"500"} fontSize={"larger"}>
                      Average
                    </Text>
                    <Text
                      fontWeight={"600"}
                      fontSize={"xx-large"}
                      color={"purple"}
                    >
                      {(data.averageServingTime / 60).toFixed(1)} min
                    </Text>
                  </Flex>
                  <Flex flexDirection={"row"} justifyContent={"space-between"}>
                    <Flex flexDirection={"column"} alignItems={"center"}>
                      <Text>Fastest</Text>
                      <Text>
                        {(data.fastestServingTime / 60).toFixed(1)} min
                      </Text>
                    </Flex>
                    <Flex flexDirection={"column"} alignItems={"center"}>
                      <Text>Slowest</Text>
                      <Text>
                        {(data.slowestServingTime / 60).toFixed(1)} min
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
              }
            />
            <DashboardCard
              title="Tips Collected"
              icon={<MdRestaurant size={30} color="gold" />}
              data={
                <Flex flexDirection={"column"} gap={5}>
                  <Text fontWeight={"600"} fontSize={"xx-large"} color={"gold"}>
                    ${data.totalTips.toFixed(2)}
                  </Text>
                </Flex>
              }
              footerText="View Tips"
              footerLink="/tips/history"
              color="gold"
            />
          </Grid>
        </>
      )}
    </div>
  );
}

// Prop types for the DashboardCard
DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  data: PropTypes.node.isRequired,
  footerText: PropTypes.string,
  footerLink: PropTypes.string,
  color: PropTypes.string,
};
