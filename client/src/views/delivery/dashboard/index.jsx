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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
} from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState, useMemo } from "react";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { MdDeliveryDining, MdOutlineTimer } from "react-icons/md";
import { FaAngleRight } from "react-icons/fa6";
import { RiPinDistanceFill } from "react-icons/ri";
import CompletedDeliveriesChart from "./components/CompletedDeliveriesChart";
import { getDeliveryDashboardDataAction } from "../../../redux/action/deliveryDashboard";
import { BiRefresh } from "react-icons/bi";
import { toast } from "react-toastify";

export default function Dashboard() {
  const history = useHistory();
  const [utils, setUtils] = useState({ isLoading: true, isError: false });

  // Get the data from the Redux store
  const data = useSelector((state) => state.deliveryDashboardReducer.data);
  const dispatch = useDispatch();

  const handleRefresh = () => {
    const user = JSON.parse(localStorage.getItem("ProfileData"));
    if (user.result?._id) {
      setUtils({ isLoading: true, isError: false });
      dispatch(getDeliveryDashboardDataAction(user.result?._id));
    } else toast.error("User not found! please login again.");
  };

  useEffect(() => {
    if (Object.keys(data).length) {
      if (data.error) setUtils({ isLoading: false, isError: true });
      else setUtils({ isLoading: false, isError: false });
    }
  }, [data]);

  return (
    <>
      <Flex
        flexWrap={"wrap"}
        gap={10}
        alignItems={"center"}
        justifyContent={"space-between"}
        mt={{ md: 20, base: 24 }}
        mb={5}
      >
        <Heading fontSize={20}>Dashboard</Heading>
        <Button
          isLoading={utils.isLoading}
          leftIcon={<BiRefresh />}
          onClick={handleRefresh}
        >
          Refresh
        </Button>
      </Flex>

      {utils.isLoading ? (
        <Text my={20} w={"fit-content"} mx={"auto"}>
          Loading...
        </Text>
      ) : utils.isError ? (
        <Text my={20} textAlign={"center"} color={"gray"}>
          Something went wrong
        </Text>
      ) : (
        <>
          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              md: "repeat(2, 1fr)",
            }}
            gap={5}
          >
            <Card>
              <CardBody px={5}>
                <Flex justifyContent={"space-between"} mb={5}>
                  <Heading fontSize={"24px"}>Deliveries Today</Heading>
                  <MdDeliveryDining size={30} color="green" />
                </Flex>
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
                      {data.todayCompletedDeliveries}
                    </Text>
                  </Flex>
                  <Flex flexDirection={"column"}>
                    <Flex gap={3}>
                      <Text>Active :</Text>
                      <Text>{data.todayActiveDeliveries}</Text>
                    </Flex>
                    <Flex gap={3}>
                      <Text>Assigned :</Text>
                      <Text>{data.todayAssignedDeliveries}</Text>
                    </Flex>
                    <Flex gap={3}>
                      <Text>Available :</Text>
                      <Text>{data.todayAvailableDeliveries}</Text>
                    </Flex>
                  </Flex>
                </Flex>
              </CardBody>
              <CardFooter
                bg={"green"}
                color={"white"}
                px={3}
                py={2}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"flex-end"}
                cursor={"pointer"}
                gap={3}
                onClick={() => history.push("/delivery/available-deliveries")}
              >
                <Text>Know more</Text>
                <FaAngleRight />
              </CardFooter>
            </Card>
            <Card>
              <CardBody px={5}>
                <Flex justifyContent={"space-between"} mb={5}>
                  <Heading fontSize={"24px"}>Deliveries All Time</Heading>
                  <MdDeliveryDining size={30} color="blue" />
                </Flex>
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
                      {data.totalCompletedDeliveries}
                    </Text>
                  </Flex>
                  <Flex flexDirection={"column"}>
                    <Flex gap={3}>
                      <Text>Assigned :</Text>
                      <Text>{data.totalAssignedDeliveries}</Text>
                    </Flex>{" "}
                    <Flex gap={3} color={"red"}>
                      <Text>Not Completed :</Text>
                      <Text>
                        {data.totalAssignedDeliveries -
                          data.totalCompletedDeliveries}
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
              </CardBody>
              <CardFooter
                bg={"blue"}
                color={"white"}
                px={3}
                py={2}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"flex-end"}
                gap={3}
                cursor={"pointer"}
                onClick={() => history.push("/delivery/history")}
              >
                <Text>Know more</Text>
                <FaAngleRight />
              </CardFooter>
            </Card>
          </Grid>

          <Box mt={5} bg={"#fff"}>
            <Heading fontSize={20} mb={5} pl={5} pt={5}>
              Deliveries Completed
            </Heading>
            <CompletedDeliveriesChart
              weekly={data.totalDeliveryCompletedPastWeekPerDay}
              monthly={data.totalDeliveryCompletedPastMonthPerDay}
              yearly={data.totalDeliveryCompletedPastYearPerMonth}
              totalInWeek={data.totalDeliveryCompletedPastWeek}
              totalInMonth={data.totalDeliveryCompletedPastMonth}
              totalInYear={data.totalDeliveryCompletedPastYear}
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
            <Card>
              <CardBody px={5}>
                <Flex justifyContent={"space-between"} mb={5}>
                  <Heading fontSize={"24px"}>Delivery Time Taken</Heading>
                  <MdOutlineTimer size={30} color="green" />
                </Flex>
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
                      {data.averageTimeTaken} min.
                    </Text>
                  </Flex>
                  <Flex flexDirection={"row"} justifyContent={"space-between"}>
                    <Flex flexDirection={"column"} alignItems={"center"}>
                      <Text>Smallest</Text>
                      <Text>{data.smallestTimeTaken} min.</Text>
                    </Flex>
                    <Flex flexDirection={"column"} alignItems={"center"}>
                      <Text>Longest</Text>
                      <Text>{data.longestTimeTaken} min.</Text>
                    </Flex>
                  </Flex>
                </Flex>
              </CardBody>
            </Card>
            <Card>
              <CardBody px={5}>
                <Flex justifyContent={"space-between"} mb={5}>
                  <Heading fontSize={"24px"}>
                    Delivery Distance Travelled
                  </Heading>
                  <RiPinDistanceFill size={30} color="blue" />
                </Flex>
                <Flex flexDirection={"column"} gap={5}>
                  <Flex flexDirection={"column"} alignItems={"center"}>
                    <Text fontWeight={"500"} fontSize={"larger"}>
                      Average
                    </Text>
                    <Text
                      fontWeight={"600"}
                      fontSize={"xx-large"}
                      color={"blue"}
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
              </CardBody>
            </Card>
          </Grid>
        </>
      )}
    </>
  );
}

const DashCard = ({ label, value, to }) => {
  return (
    <Card>
      <CardBody>
        <Text fontSize={"24px"}>{value}</Text>
        <Text fontSize={"16px"}>{label}</Text>
      </CardBody>
      {to && (
        <CardFooter>
          <Link to={to}>know more</Link>
        </CardFooter>
      )}
    </Card>
  );
};
