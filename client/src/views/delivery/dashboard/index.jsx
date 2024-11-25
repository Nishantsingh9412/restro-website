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
import { MdDeliveryDining, MdOutlineTimer } from "react-icons/md";
import { FaAngleRight } from "react-icons/fa6";
import { RiPinDistanceFill } from "react-icons/ri";
import CompletedDeliveriesChart from "./components/CompletedDeliveriesChart";
import { getDeliveryDashboardDataAction } from "../../../redux/action/deliveryDashboard";
import { BiPlus, BiRefresh } from "react-icons/bi";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

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
// eslint-disable-next-line react/prop-types
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
  return null; // Ensure there's no render if neither loading nor error
};

export default function Dashboard() {
  // State to manage loading and error states
  const [utils, setUtils] = useState({ isLoading: true, isError: false });
  // Get user data from local storage
  const user = JSON.parse(localStorage.getItem("ProfileData"));
  // Get delivery dashboard data from Redux store
  const data = useSelector((state) => state.deliveryDashboardReducer.data);
  const dispatch = useDispatch();

  // Handle data refresh
  const handleRefresh = useCallback(() => {
    if (user?.result?._id) {
      setUtils({ isLoading: true, isError: false });
      dispatch(getDeliveryDashboardDataAction(user.result._id))
        .then(() => setUtils({ isLoading: false, isError: false }))
        .catch(() => setUtils({ isLoading: false, isError: true }));
    } else {
      toast.error("User not found! Please login again.");
      setUtils({ isLoading: false, isError: true });
    }
  }, [dispatch, user]);

  // Handle create deliveries
  const handleCreateDeliveries = () => {
    toast.info("Feature coming soon!");
  };

  // Fetch data on component mount
  useEffect(() => {
    handleRefresh();
  }, []);

  return (
    <div>
      {/* Header section with title and refresh button */}
      <Flex
        flexWrap={"wrap"}
        gap={10}
        alignItems={"center"}
        justifyContent={"space-between"}
        mt={{ lg: 10, base: 24 }}
        mb={5}
      >
        {/* <Heading fontSize={35}>Dashboard</Heading> */}
        <Button
          // isLoading={utils.isLoading}
          leftIcon={<BiPlus />}
          onClick={handleCreateDeliveries}
        >
          Create Deliveries
        </Button>
        <Button
          isLoading={utils.isLoading}
          leftIcon={<BiRefresh />}
          onClick={handleRefresh}
        >
          Refresh
        </Button>
      </Flex>

      {/* Display loading or error message */}
      <LoadingOrError isLoading={utils.isLoading} isError={utils.isError} />

      {/* Display dashboard data if not loading or error */}
      {!utils.isLoading && !utils.isError && data && (
        <>
          {/* Grid for today's and all-time deliveries */}
          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              md: "repeat(2, 1fr)",
            }}
            gap={5}
          >
            <DashboardCard
              title="Deliveries Today"
              icon={<MdDeliveryDining size={30} color="green" />}
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
                      {data.todayCompletedDeliveries || 0}
                    </Text>
                  </Flex>
                  <Flex flexDirection={"column"}>
                    <Flex gap={3}>
                      <Text>Active :</Text>
                      <Text>{data.todayActiveDeliveries || 0}</Text>
                    </Flex>
                    <Flex gap={3}>
                      <Text>Assigned :</Text>
                      <Text>{data.todayAssignedDeliveries || 0}</Text>
                    </Flex>
                    <Flex gap={3}>
                      <Text>Available :</Text>
                      <Text>{data.todayAvailableDeliveries || 0}</Text>
                    </Flex>
                  </Flex>
                </Flex>
              }
              footerText="Know more"
              footerLink="/delivery/available-deliveries"
              color="green"
            />
            <DashboardCard
              title="Deliveries All Time"
              icon={<MdDeliveryDining size={30} color="blue" />}
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
                      {data.totalCompletedDeliveries || 0}
                    </Text>
                  </Flex>
                  <Flex flexDirection={"column"}>
                    <Flex gap={3}>
                      <Text>Assigned :</Text>
                      <Text>{data.totalAssignedDeliveries || 0}</Text>
                    </Flex>
                    <Flex gap={3} color={"red"}>
                      <Text>Not Completed :</Text>
                      <Text>
                        {(data.totalAssignedDeliveries || 0) -
                          (data.totalCompletedDeliveries || 0)}
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
              }
              footerText="Know more"
              footerLink="/delivery/history"
              color="blue"
            />
          </Grid>

          {/* Section for completed deliveries chart */}
          <Box mt={5} bg={"#fff"}>
            <Heading fontSize={20} mb={5} pl={5} pt={5}>
              Deliveries Completed
            </Heading>
            <CompletedDeliveriesChart
              weekly={data.totalDeliveryCompletedPastWeekPerDay || []}
              monthly={data.totalDeliveryCompletedPastMonthPerDay || []}
              yearly={data.totalDeliveryCompletedPastYearPerMonth || []}
              totalInWeek={data.totalDeliveryCompletedPastWeek || 0}
              totalInMonth={data.totalDeliveryCompletedPastMonth || 0}
              totalInYear={data.totalDeliveryCompletedPastYear || 0}
            />
          </Box>

          {/* Grid for delivery time taken and distance covered */}
          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              md: "repeat(2, 1fr)",
            }}
            mt={5}
            gap={5}
          >
            <DashboardCard
              title="Delivery Time Taken"
              icon={<MdOutlineTimer size={30} color="green" />}
              data={
                <Flex flexDirection={"column"} gap={5}>
                  <Flex flexDirection={"column"} alignItems={"center"}>
                    <Text fontWeight={"500"} fontSize={"larger"}>
                      Average
                    </Text>
                    <Text
                      fontWeight={"600"}
                      fontSize={"xx-large"}
                      color={"green"}
                    >
                      {(data.averageTimeTaken / 60).toFixed(1)} min.
                    </Text>
                  </Flex>
                  <Flex flexDirection={"row"} justifyContent={"space-between"}>
                    <Flex flexDirection={"column"} alignItems={"center"}>
                      <Text>Smallest</Text>
                      <Text>
                        {(data.smallestTimeTaken / 60).toFixed(1)} min.
                      </Text>
                    </Flex>
                    <Flex flexDirection={"column"} alignItems={"center"}>
                      <Text>Longest</Text>
                      <Text>
                        {(data.longestTimeTaken / 60).toFixed(1)} min.
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
              }
            />
            <DashboardCard
              title="Distance Covered"
              icon={<RiPinDistanceFill size={30} color="green" />}
              data={
                <Flex flexDirection={"column"} gap={5}>
                  <Flex flexDirection={"column"} alignItems={"center"}>
                    <Text fontWeight={"500"} fontSize={"larger"}>
                      Average
                    </Text>
                    <Text
                      fontWeight={"600"}
                      fontSize={"xx-large"}
                      color={"green"}
                    >
                      {(data.averageDeliveryDistance / 1000).toFixed(1)} km
                    </Text>
                  </Flex>
                  <Flex flexDirection={"row"} justifyContent={"space-between"}>
                    <Flex flexDirection={"column"} alignItems={"center"}>
                      <Text>Smallest</Text>
                      <Text>
                        {(data.shortestDeliveryDistance / 1000).toFixed(1)} km
                      </Text>
                    </Flex>
                    <Flex flexDirection={"column"} alignItems={"center"}>
                      <Text>Longest</Text>
                      <Text>
                        {(data.longestDeliveryDistance / 1000).toFixed(1)} km
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
              }
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
