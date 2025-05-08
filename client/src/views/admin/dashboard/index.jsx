import {
  Grid,
  GridItem,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Text,
  TableContainer,
  Card,
  Box,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getAbsentApi,
  getBirthdayApi,
  getEmployeShiftApi,
  getUpcomingBirthdayApi,
} from "../../../redux/action/dashboard";
import { localStorageData } from "../../../utils/constant";

export default function DashboardComponent() {
  // Redux dispatch function to trigger actions
  const dispatch = useDispatch();

  // State variables to hold data for employee shifts, absences, birthdays, and upcoming birthdays
  const [employeeshift, setEmployeeShift] = useState([]);
  const [employeeabsense, setEmployeeAbsense] = useState([]);
  const [birthdays, setBirthdays] = useState([]);
  const [upcomingbirthdays, setUpcomingBirthdays] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect hook to fetch data when the component mounts
  useEffect(() => {
    (async () => {
      try {
        await Promise.all([
          fetchBirthdays(),
          getUpcomingBirthday(),
          getEmployeShift(),
          getAbsent(),
        ]);
      } catch (error) {
        console.error("Error initializing dashboard data", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Function to fetch employee absences
  const getAbsent = async () => {
    try {
      const userData = JSON.parse(
        localStorage.getItem(localStorageData.PROFILE_DATA)
      );
      if (!userData || !userData.result || !userData.result._id) {
        throw new Error("User data is not available");
      }
      const userId = userData.result._id;

      const res = await dispatch(getAbsentApi(userId));
      if (res.success) {
        setEmployeeAbsense(res.data);
      } else {
        console.error("Failed to fetch absences", res.message);
      }
    } catch (error) {
      console.error("Error fetching absences", error);
    }
  };

  // Function to fetch employee shifts
  const getEmployeShift = async () => {
    try {
      const res = await dispatch(getEmployeShiftApi());
      if (res.success) {
        setEmployeeShift(res.data);
      } else {
        console.error("Failed to fetch employee shifts", res.message);
      }
    } catch (error) {
      console.error("Error fetching employee shifts", error);
    }
  };

  // Function to fetch birthdays
  const fetchBirthdays = async () => {
    try {
      const res = await dispatch(getBirthdayApi());
      if (res.success) {
        setBirthdays(res.data);
      } else {
        console.error("Failed to fetch birthdays", res.message);
      }
    } catch (error) {
      console.error("Error fetching birthdays", error);
    }
  };

  // Function to fetch upcoming birthdays
  const getUpcomingBirthday = async () => {
    try {
      const res = await dispatch(getUpcomingBirthdayApi());
      if (res.success) {
        setUpcomingBirthdays(res.data);
      } else {
        console.error("Failed to fetch upcoming birthdays", res.message);
      }
    } catch (error) {
      console.error("Error fetching upcoming birthdays", error);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="50vh"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Grid gap={6} mt={12} templateColumns="repeat(12, 1fr)">
      {/* Main Section */}
      <GridItem colSpan={9}>
        {/* Working Section */}
        <Box p={6} boxShadow="md" bg="white" borderRadius="md">
          <Heading fontSize="lg" color="gray.700">
            Working
          </Heading>
        </Box>
        <Box boxShadow="md" bg="white" mt={2} borderRadius="md" p={4}>
          <TableContainer>
            <Table variant="simple">
              <Thead bg="gray.50">
                <Tr>
                  <Th>Employee</Th>
                  <Th>From</Th>
                  <Th>To</Th>
                  <Th>Duration</Th>
                </Tr>
              </Thead>
              <Tbody>
                {employeeshift && employeeshift.length > 0 ? (
                  employeeshift.map((val) => (
                    <Tr key={val._id}>
                      <Td>{val.employeeId ? val.employeeId.name : "N/A"}</Td>
                      <Td>{new Date(val.from).toLocaleDateString()}</Td>
                      <Td>{new Date(val.to).toLocaleDateString()}</Td>
                      <Td>{val.duration} Hours</Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={4} textAlign="center">
                      No Data Available
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>

        {/* Absent Section */}
        <Box mt={6} p={6} boxShadow="md" bg="white" borderRadius="md">
          <Heading fontSize="lg" color="gray.700">
            Absent
          </Heading>
        </Box>
        <Box boxShadow="md" bg="white" mt={2} borderRadius="md" p={4}>
          <TableContainer>
            <Table variant="simple">
              <Thead bg="gray.50">
                <Tr>
                  <Th>Employee</Th>
                  <Th>Absence</Th>
                  <Th>Note</Th>
                </Tr>
              </Thead>
              <Tbody>
                {employeeabsense && employeeabsense.length > 0 ? (
                  employeeabsense.map((val) => (
                    <Tr key={val._id}>
                      <Td>{val.employeeId ? val.employeeId.name : "N/A"}</Td>
                      <Td>{val.leaveType}</Td>
                      <Td>{val.notes}</Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={3} textAlign="center">
                      No Absences Recorded
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </GridItem>

      {/* Sidebar - Birthdays */}
      <GridItem colSpan={3}>
        <Box>
          <Card boxShadow="md" bg="white" p={8} borderRadius="md">
            <Heading fontSize="xl" color="rgb(63, 73, 98)">
              Birthdays
            </Heading>

            {/* Today's Birthday */}
            <Heading fontSize="lg" mt={6} color="gray.600">
              Today
            </Heading>
            {loading ? (
              <Text fontSize="sm" color="gray.500">
                Loading...
              </Text>
            ) : birthdays.length > 0 ? (
              <ul>
                {birthdays.map((employee, index) => (
                  <Text key={index} fontSize="sm" color="gray.700">
                    {employee.name}
                  </Text>
                ))}
              </ul>
            ) : (
              <Text fontSize="sm" color="gray.500">
                There is no birthday today.
              </Text>
            )}

            {/* Upcoming Birthdays */}
            <Heading fontSize="lg" mt={6} color="gray.600">
              Upcoming Birthdays
            </Heading>
            {loading ? (
              <Text fontSize="sm" color="gray.500">
                Loading...
              </Text>
            ) : upcomingbirthdays.length > 0 ? (
              <ul>
                {upcomingbirthdays.map((employee, index) => (
                  <Text key={index} fontSize="sm" color="gray.700">
                    {employee.name}
                  </Text>
                ))}
              </ul>
            ) : (
              <Text fontSize="sm" color="gray.500">
                There are no upcoming birthdays.
              </Text>
            )}
          </Card>
        </Box>
      </GridItem>
    </Grid>
  );
}
