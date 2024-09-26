import "./emp.css";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  Button,
  Grid,
  GridItem,
  HStack,
  Radio,
  RadioGroup,
  useDisclosure,
  Input,
  Select,
  IconButton,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

import { toast } from "react-toastify";
import { getApihandler } from "../../../../Apihandler";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import {
  deleteEmployeeApi,
  getEmployeeApi,
  getEmployeeDetailApi,
  postEmployeeApi,
  updateEmployeeApi,
} from "../../../../redux/action/employee";
import { FaTrash } from "react-icons/fa";
import { IoMdEye } from "react-icons/io";
import { IoPencilOutline } from "react-icons/io5";

export default function EmployeeComponent() {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();
  const {
    isOpen: isOpenDetails,
    onOpen: onOpenDetails,
    onClose: onCloseDetails,
  } = useDisclosure();

  const [employeedatadata, setEmployeedataData] = useState([]);
  const [employeeData, setEmployeeData] = useState({});
  const [employeeAddressData, setemployeeAddressData] = useState({});
  const [employeeDataId, setEmployeeDataId] = useState("");

  const [employeename, setEmployeeName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [birthday, setBirthday] = useState("");
  const [nationality, setNationality] = useState("");
  const [martialstatus, setMartialStatus] = useState("");
  const [children, setChildren] = useState();
  const [healthinsurance, setHealthInsurance] = useState("");
  const [securitynumber, setSecurityNumber] = useState("");
  const [taxid, setTaxId] = useState("");
  const [status, setStatus] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [position, setPosition] = useState("");
  const [type, setType] = useState("");
  const [workinghour, setWorkingHour] = useState(30);
  const [holiday, setHoliday] = useState();
  const [note, setNote] = useState("");
  const [datejoining, setDateJoining] = useState("");
  const [endjoining, setEndJoining] = useState("");
  const [selectedOption, setSelectedOption] = useState("fixed");
  const [variableWorkingHours, setVariableWorkingHours] = useState(false);

  const handleRadioChange = (value) => {
    setSelectedOption(value);
    setVariableWorkingHours(value === "variable");
  };

  const handleInputChange = (e) => setWorkingHour(e.target.value);

  useEffect(() => {
    getEmployee();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (employeeDataId) getEmployeeDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeDataId]);

  const addEmployee = async () => {
    if (
      employeename !== "" &&
      email !== "" &&
      phone !== "" &&
      employeeId !== "" &&
      status !== "" &&
      type !== ""
    ) {
      const userData = JSON.parse(localStorage.getItem("ProfileData"));
      const userId = userData.result._id;

      let data = {
        name: employeename,
        email: email,
        phone: phone,
        address: { street: street, city: city, zipCode: zipcode },
        birthday: birthday,
        nationality: nationality,
        maritalStatus: martialstatus,
        children: children,
        healthInsurance: healthinsurance,
        socialSecurityNumber: securitynumber,
        taxID: taxid,
        status: status,
        dateOfJoining: datejoining,
        endOfEmployment: endjoining,
        employeeID: employeeId,
        position: position,
        type: type,
        workingHoursPerWeek: workinghour,
        variableWorkingHours: variableWorkingHours,
        annualHolidayEntitlement: holiday,
        notes: note,
        created_by: userId,
      };

      try {
        const res = await dispatch(postEmployeeApi(data));
        if (res.success) {
          toast.success("Employee Add successfully");
          getEmployee(res.data.result._id);
        }
      } catch (error) {}
    } else {
      toast.warning("All fields are required");
    }
  };

  const updateEmployee = async () => {
    let data = {
      name: employeename,
      email: email,
      phone: phone,
      address: { street: street, city: city, zipCode: zipcode },
      birthday: birthday,
      nationality: nationality,
      maritalStatus: martialstatus,
      children: children,
      healthInsurance: healthinsurance,
      socialSecurityNumber: securitynumber,
      taxID: taxid,
      status: status,
      dateOfJoining: datejoining,
      endOfEmployment: endjoining,
      employeeID: employeeId,
      position: position,
      type: type,
      workingHoursPerWeek: workinghour,
      variableWorkingHours: variableWorkingHours,
      annualHolidayEntitlement: holiday,
      notes: note,
    };

    if (!employeeData._id) return;
    const res = await dispatch(updateEmployeeApi(employeeData._id, data));
    if (res.success) {
      toast.success("Employee update successfully");
      await getEmployee();
      onCloseEdit();
    } else toast.error("Failed to update employee");
  };

  const getEmployee = async () => {
    const userData = JSON.parse(localStorage.getItem("ProfileData"));
    const res = await dispatch(getEmployeeApi(userData.result._id));
    if (res.success) setEmployeedataData(res.data);
  };

  const getEmployeeDetail = async () => {
    if (!employeeDataId) return;
    const res = await dispatch(getEmployeeDetailApi(employeeDataId));
    if (res.success) {
      setEmployeeData(res.data[0]);
      setemployeeAddressData(res.data[0].address);
      onOpenDetails();
    }
  };

  function formatDateString(inputDateString) {
    const date = new Date(inputDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const deleteEmployee = async (id) => {
    const ddd = await Swal.fire({
      title: "Are you sure ?",
      text: "Are you sure you want to delete the employee, this action cannot be undone ?",
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "delete",
      cancelButtonText: "Cancel",
    });

    if (ddd.isConfirmed) {
      const res = await dispatch(deleteEmployeeApi(id));
      if (res.success) {
        toast.success("Employee deleted successfully");
        getEmployee();
      } else toast.error("Failed to delete employee");
    }
  };

  const getUpdateData = async (employeeId) => {
    const res = await getApihandler(
      `/employee/get-employee/id_${
        typeof employeeId === "string" ? employeeId : employeeDataId
      }`
    );

    if (res.success) {
      setEmployeeName(res.result[0].name);
      setEmail(res.result[0].email);
      setPhone(res.result[0].phone);
      setStreet(res.result[0].address.street);
      setCity(res.result[0].address.city);
      setZipcode(res.result[0].address.zipCode);
      setBirthday(formatDateString(res.result[0].birthday));
      setNationality(res.result[0].nationality);
      setMartialStatus(res.result[0].maritalStatus);
      setChildren(res.result[0].children);
      setHealthInsurance(res.result[0].healthInsurance);
      setSecurityNumber(res.result[0].socialSecurityNumber);
      setTaxId(res.result[0].taxID);
      setStatus(res.result[0].status);
      setEmployeeId(res.result[0].employeeID);
      setPosition(res.result[0].position);
      setType(res.result[0].type);
      setWorkingHour(res.result[0].workingHoursPerWeek);
      setHoliday(res.result[0].annualHolidayEntitlement);
      setNote(res.result[0].notes);
      setDateJoining(formatDateString(res.result[0].dateOfJoining));
      setEndJoining(formatDateString(res.result[0].endOfEmployment));
      setEmployeeData(res.result[0]); //
      onOpenEdit();
    }
  };

  const onDetailsModalCloseComplete = () => {
    setEmployeeDataId("");
    setEmployeeData({});
    setemployeeAddressData({});
  };

  const onEditModalCloseComplete = () => {
    setEmployeeName("");
    setEmail("");
    setPhone("");
    setStreet("");
    setCity("");
    setZipcode("");
    setBirthday("");
    setNationality("");
    setMartialStatus("");
    setChildren("");
    setHealthInsurance("");
    setSecurityNumber("");
    setTaxId("");
    setStatus("");
    setEmployeeId("");
    setPosition("");
    setType("");
    setWorkingHour(30);
    setHoliday("");
    setNote("");
    setDateJoining("");
    setEndJoining("");
    setEmployeeData({});
  };

  const onAddModalCloseComplete = () => {
    setEmployeeName("");
    setEmail("");
    setPhone("");
    setStreet("");
    setCity("");
    setZipcode("");
    setBirthday("");
    setNationality("");
    setMartialStatus("");
    setChildren("");
    setHealthInsurance("");
    setSecurityNumber("");
    setTaxId("");
    setStatus("");
    setEmployeeId("");
    setPosition("");
    setType("");
    setWorkingHour(30);
    setHoliday("");
    setNote("");
    setDateJoining("");
    setEndJoining("");
    setEmployeeData({});
  };

  return (
    <>
      <Button
        leftIcon={<AddIcon />}
        colorScheme="teal"
        variant="outline"
        sx={{ borderRadius: "8px" }}
        onClick={onOpen}
      >
        Add New Employee
      </Button>

      <br />
      <br />
      <br />

      <TableContainer style={{ backgroundColor: "white", padding: "10px" }}>
        <Table variant="bordered">
          <Thead>
            <Tr>
              <Th className="tabl_cell">Name</Th>
              <Th className="tabl_cell">Position</Th>
              <Th className="tabl_cell">Phone</Th>
              <Th className="tabl_cell">Birthday</Th>
              <Th className="tabl_cell">Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {employeedatadata.length === 0 ? (
              <p>No Data</p>
            ) : (
              employeedatadata.map((val) => {
                return (
                  <Tr key={val._id}>
                    <Td className="tabl_cell">{val.name}</Td>
                    <Td className="tabl_cell">{val.position}</Td>
                    <Td className="tabl_cell">{val.phone}</Td>
                    <Td className="tabl_cell">
                      {new Date(val.birthday).toLocaleDateString()}
                    </Td>
                    <Td
                      className="tabl_cell"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {/* <DeleteIcon className='action_link delete' onClick={() => deleteEmployee(val._id)} />{' '}
											&nbsp;&nbsp;&nbsp;&nbsp;
											<ViewIcon className='action_link view' onClick={() => setEmployeeDataId(val._id)} />{' '}
											&nbsp;&nbsp;&nbsp;&nbsp;
											<EditIcon className='action_link edit' onClick={() => getUpdateData(val._id)} /> */}

                      <IconButton
                        colorScheme="red"
                        aria-label="Delete"
                        size="sm"
                        icon={<FaTrash />}
                        onClick={() => deleteEmployee(val._id)}
                      />
                      <IconButton
                        colorScheme={"green"}
                        aria-label="view"
                        size="sm"
                        icon={<IoMdEye />}
                        onClick={() => setEmployeeDataId(val._id)}
                      />
                      <IconButton
                        colorScheme={"yellow"}
                        aria-label="edit"
                        size="sm"
                        icon={<IoPencilOutline />}
                        onClick={() => getUpdateData(val._id)}
                      />
                    </Td>
                  </Tr>
                );
              })
            )}
          </Tbody>
        </Table>
      </TableContainer>

      {/* ******** add modal box ******** */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        onCloseComplete={onAddModalCloseComplete}
      >
        <ModalOverlay />
        <ModalContent maxWidth={{ base: "90%", md: "70%" }}>
          <Grid templateColumns="repeat(12, 1fr)" gap={4}>
            <GridItem colSpan={{ base: 12, md: 6 }}>
              <ModalHeader sx={{ color: "rgb(63, 73, 98)" }}>
                Employee details
              </ModalHeader>
            </GridItem>
            <GridItem colSpan={{ base: 12, md: 6 }}>
              <ModalHeader sx={{ color: "rgb(63, 73, 98)" }}>
                Additional info
              </ModalHeader>
            </GridItem>
          </Grid>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <label>Employee name</label>
                <Input
                  type="text"
                  mb={4}
                  onChange={(e) => setEmployeeName(e.target.value)}
                />
                <label>Email</label>
                <Input
                  type="email"
                  mb={4}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label>Phone</label>
                <Input
                  type="text"
                  mb={4}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <label>Street</label>
                <Input
                  type="text"
                  mb={4}
                  onChange={(e) => setStreet(e.target.value)}
                />
                <label>City</label>
                <Input
                  type="text"
                  mb={4}
                  onChange={(e) => setCity(e.target.value)}
                />
                <label>Zip code</label>
                <Input
                  type="number"
                  mb={4}
                  onChange={(e) => setZipcode(e.target.value)}
                />
                <label>Birthday</label>
                <Input
                  type="date"
                  onChange={(e) => setBirthday(e.target.value)}
                />
                <label>Nationality</label>
                <Input
                  type="text"
                  mb={4}
                  onChange={(e) => setNationality(e.target.value)}
                />
                <label>Marital status</label>
                <Select
                  placeholder="Select option"
                  mb={4}
                  onChange={(e) => setMartialStatus(e.target.value)}
                >
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                </Select>
                <label>Children</label>
                <Input
                  type="number"
                  mb={4}
                  onChange={(e) => setChildren(e.target.value)}
                />
                <label>Health insurance</label>
                <Input
                  type="text"
                  mb={4}
                  onChange={(e) => setHealthInsurance(e.target.value)}
                />
                <label>Social security number</label>
                <Input
                  type="number"
                  mb={4}
                  onChange={(e) => setSecurityNumber(e.target.value)}
                />
                <label>Tax ID</label>
                <Input
                  type="number"
                  mb={4}
                  onChange={(e) => setTaxId(e.target.value)}
                />
              </GridItem>

              <GridItem colSpan={{ base: 12, md: 6 }}>
                <label>Status</label>
                <Select
                  placeholder="Select option"
                  mb={4}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                </Select>
                <label>Date of joining</label>
                <Input
                  type="date"
                  mb={4}
                  onChange={(e) => setDateJoining(e.target.value)}
                />
                <label>End of employment</label>
                <Input
                  type="date"
                  mb={4}
                  onChange={(e) => setEndJoining(e.target.value)}
                />
                <label>Employee ID</label>
                <Input
                  type="number"
                  mb={4}
                  onChange={(e) => setEmployeeId(e.target.value)}
                />
                <label>Position</label>
                <Select
                  placeholder="Select option"
                  mb={4}
                  onChange={(e) => setPosition(e.target.value)}
                >
                  <option value="Waiter">Waiter</option>
                  <option value="Manager">Manager</option>
                  <option value="Chef">Chef</option>
                </Select>
                <label>Type</label>
                <Select
                  placeholder="Select option"
                  mb={4}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                </Select>
                <RadioGroup onChange={handleRadioChange} value={selectedOption}>
                  <HStack>
                    <Radio value="fixed">
                      Fixed working hours per week
                      <Input
                        type="number"
                        value={selectedOption === "fixed" ? workinghour : ""}
                        onChange={handleInputChange}
                        // disabled={selectedOption !== 'fixed'}
                      />
                    </Radio>
                    <Radio value="variable">Variable working hours</Radio>
                  </HStack>
                </RadioGroup>
                <label>Annual holiday entitlement (days)</label>
                <Input
                  type="number"
                  mb={4}
                  onChange={(e) => setHoliday(e.target.value)}
                />
                <label>Notes</label>
                <Input type="text" onChange={(e) => setNote(e.target.value)} />
              </GridItem>
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={onClose}
              sx={{ borderRadius: "8px" }}
            >
              Close
            </Button>
            <Button
              variant="ghost"
              sx={{
                backgroundColor: "rgb(33, 180, 152)",
                color: "white",
                borderRadius: "8px",
              }}
              onClick={addEmployee}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ************ detail modal box ****************** */}
      <Modal
        isOpen={isOpenDetails}
        onClose={onCloseDetails}
        onCloseComplete={onDetailsModalCloseComplete}
      >
        <ModalOverlay />
        <ModalContent maxWidth={{ base: "90%", md: "70%" }}>
          {/* <div style={{ textAlign: 'end' }}>
						<Button
							variant='outline'
							sx={{
								borderRadius: '8px',
								marginTop: '20px',
								marginRight: '50px',
							}}
							onClick={getUpdateData}
						>
							Edit
						</Button>
					</div> */}
          <Grid templateColumns="repeat(12, 1fr)" gap={4}>
            <GridItem colSpan={{ base: 12, md: 6 }}>
              <ModalHeader sx={{ color: "rgb(63, 73, 98)" }}>
                Employee details
              </ModalHeader>
            </GridItem>
            <GridItem colSpan={{ base: 12, md: 6 }}>
              <ModalHeader sx={{ color: "rgb(63, 73, 98)" }}>
                Employment
              </ModalHeader>
            </GridItem>
          </Grid>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                  <GridItem colSpan={6}>
                    <h3>Name</h3>
                  </GridItem>
                  <GridItem colSpan={6}>
                    <h3>{employeeData.name}</h3>
                  </GridItem>
                  <GridItem colSpan={6}>
                    <h3>Email</h3>
                  </GridItem>
                  <GridItem colSpan={6}>
                    <h3>{employeeData.email}</h3>
                  </GridItem>
                  <GridItem colSpan={6}>
                    <h3>Phone Number</h3>
                  </GridItem>
                  <GridItem colSpan={6}>
                    <h3>{employeeData.phone}</h3>
                  </GridItem>
                  <GridItem colSpan={6}>
                    <h3>Street</h3>
                  </GridItem>
                  <GridItem colSpan={6}>
                    <h3>{employeeAddressData.street}</h3>
                  </GridItem>
                  <GridItem colSpan={6}>
                    <h3>City</h3>
                  </GridItem>
                  <GridItem colSpan={6}>
                    <h3>{employeeAddressData.city}</h3>
                  </GridItem>
                  <GridItem colSpan={6}>
                    <h3>Zip code</h3>
                  </GridItem>
                  <GridItem colSpan={6}>
                    <h3>{employeeAddressData.zipCode}</h3>
                  </GridItem>
                  <GridItem colSpan={6}>
                    <h3>Birthday</h3>
                  </GridItem>
                  <GridItem colSpan={6}>
                    <h3>{formatDateString(employeeData.birthday)}</h3>
                  </GridItem>
                  <GridItem colSpan={6}>
                    <h3>Nationality</h3>
                  </GridItem>
                  <GridItem colSpan={6}>
                    <h3>{employeeData.nationality}</h3>
                  </GridItem>
                  <GridItem colSpan={6}>
                    <h3>Marital status</h3>
                  </GridItem>
                  <GridItem colSpan={6}>
                    <h3>{employeeData.maritalStatus}</h3>
                  </GridItem>
                  <GridItem colSpan={6}>
                    <h3>Children</h3>
                  </GridItem>
                  <GridItem colSpan={6}>
                    <h3>{employeeData.children}</h3>
                  </GridItem>
                  <GridItem colSpan={6}>
                    <h3>Health insurance</h3>
                  </GridItem>
                  <GridItem colSpan={6}>
                    <h3>{employeeData.healthInsurance}</h3>
                  </GridItem>
                  <GridItem colSpan={6}>
                    <h3>Social security number</h3>
                  </GridItem>
                  <GridItem colSpan={6}>
                    <h3>{employeeData.socialSecurityNumber}</h3>
                  </GridItem>
                  <GridItem colSpan={6}>
                    <h3>Tax id</h3>
                  </GridItem>
                  <GridItem colSpan={6}>
                    <h3>{employeeData.taxID}</h3>
                  </GridItem>
                </Grid>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                  <GridItem colSpan={6}>
                    <h3>Status</h3>
                  </GridItem>
                  <GridItem colSpan={6}>
                    <h3>{employeeData.status}</h3>
                  </GridItem>
                  <GridItem colSpan={6}>
                    <h3>Date of joining</h3>
                  </GridItem>
                  <GridItem colSpan={6}>
                    <h3>{formatDateString(employeeData.dateOfJoining)}</h3>
                  </GridItem>
                  <GridItem colSpan={6}>
                    <h3>End of employment</h3>
                  </GridItem>
                  <GridItem colSpan={6}>
                    <h3>{formatDateString(employeeData.endOfEmployment)}</h3>
                  </GridItem>
                  <GridItem colSpan={6}>
                    <h3>Employee ID</h3>
                  </GridItem>
                  <GridItem colSpan={6}>
                    <h3>{employeeData.employeeID}</h3>
                  </GridItem>
                  <GridItem colSpan={6}>
                    <h3>Position</h3>
                  </GridItem>
                  <GridItem colSpan={6}>
                    <h3>{employeeData.position}</h3>
                  </GridItem>
                  <GridItem colSpan={6}>
                    <h3>Type</h3>
                  </GridItem>
                  <GridItem colSpan={6}>
                    <h3>{employeeData.type}</h3>
                  </GridItem>
                  <GridItem colSpan={6}>
                    <h3>Working hours per week</h3>
                  </GridItem>
                  <GridItem colSpan={6}>
                    <h3>{employeeData.workingHoursPerWeek}</h3>
                  </GridItem>
                  <GridItem colSpan={6}>
                    <h3>Annual holiday entitlement (days)</h3>
                  </GridItem>
                  <GridItem colSpan={6}>
                    <h3>{employeeData.annualHolidayEntitlement}</h3>
                  </GridItem>
                  <GridItem colSpan={6}>
                    <h3>Notes</h3>
                  </GridItem>
                  <GridItem colSpan={6}>
                    <h3>{employeeData.notes}</h3>
                  </GridItem>
                </Grid>
              </GridItem>
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onCloseDetails}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ********** edit modal box *********** */}
      <Modal
        isOpen={isOpenEdit}
        onClose={onCloseEdit}
        size="xl"
        onCloseComplete={onEditModalCloseComplete}
      >
        <ModalOverlay />
        <ModalContent maxWidth={{ base: "90%", md: "70%" }}>
          <Grid templateColumns="repeat(12, 1fr)" gap={4}>
            <GridItem colSpan={{ base: 12, md: 6 }}>
              <ModalHeader sx={{ color: "rgb(63, 73, 98)" }}>
                Employee
              </ModalHeader>
            </GridItem>
            <GridItem colSpan={{ base: 12, md: 6 }}>
              <ModalHeader sx={{ color: "rgb(63, 73, 98)" }}>
                Additional info
              </ModalHeader>
            </GridItem>
          </Grid>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <label>Employee name</label>
                <Input
                  value={employeename}
                  type="text"
                  mb={4}
                  onChange={(e) => setEmployeeName(e.target.value)}
                />
                <label>Email</label>
                <Input
                  value={email}
                  type="email"
                  mb={4}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label>Phone</label>
                <Input
                  value={phone}
                  type="text"
                  mb={4}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <label>Street</label>
                <Input
                  value={street}
                  type="text"
                  mb={4}
                  onChange={(e) => setStreet(e.target.value)}
                />
                <label>City</label>
                <Input
                  value={city}
                  type="text"
                  mb={4}
                  onChange={(e) => setCity(e.target.value)}
                />
                <label>Zip code</label>
                <Input
                  value={zipcode}
                  type="number"
                  mb={4}
                  onChange={(e) => setZipcode(e.target.value)}
                />
                <label>Birthday</label>
                <Input
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                />
                <label>Nationality</label>
                <Input
                  type="text"
                  mb={4}
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                />
                <label>Marital status</label>
                <Select
                  placeholder="Select option"
                  mb={4}
                  value={martialstatus}
                  onChange={(e) => setMartialStatus(e.target.value)}
                >
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                </Select>
                <label>Children</label>
                <Input
                  type="number"
                  value={children}
                  mb={4}
                  onChange={(e) => setChildren(e.target.value)}
                />
                <label>Health insurance</label>
                <Input
                  type="text"
                  mb={4}
                  value={healthinsurance}
                  onChange={(e) => setHealthInsurance(e.target.value)}
                />
                <label>Social security number</label>
                <Input
                  type="number"
                  value={securitynumber}
                  mb={4}
                  onChange={(e) => setSecurityNumber(e.target.value)}
                />
                <label>Tax ID</label>
                <Input
                  type="number"
                  mb={4}
                  value={taxid}
                  onChange={(e) => setTaxId(e.target.value)}
                />
              </GridItem>

              <GridItem colSpan={{ base: 12, md: 6 }}>
                <label>Status</label>
                <Select
                  placeholder="Select option"
                  mb={4}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                </Select>
                <label>Date of joining</label>
                <Input
                  type="date"
                  mb={4}
                  value={datejoining}
                  onChange={(e) => setDateJoining(e.target.value)}
                />
                <label>End of employment</label>
                <Input
                  type="date"
                  mb={4}
                  value={endjoining}
                  onChange={(e) => setEndJoining(e.target.value)}
                />
                <label>Employee ID</label>
                <Input
                  type="number"
                  mb={4}
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                />
                <label>Position</label>
                <Select
                  placeholder="Select option"
                  mb={4}
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                >
                  <option value="Waiter">Waiter</option>
                  <option value="Manager">Manager</option>
                  <option value="Chef">Chef</option>
                </Select>
                <label>Type</label>
                <Select
                  placeholder="Select option"
                  mb={4}
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                </Select>
                <RadioGroup onChange={handleRadioChange} value={selectedOption}>
                  <HStack>
                    <Radio value="fixed">
                      Fixed working hours per week
                      <Input
                        type="number"
                        value={selectedOption === "fixed" ? workinghour : ""}
                        onChange={handleInputChange}
                      />
                    </Radio>
                    <Radio value="variable">Variable working hours</Radio>
                  </HStack>
                </RadioGroup>
                <label>Annual holiday entitlement (days)</label>
                <Input
                  type="number"
                  mb={4}
                  value={holiday}
                  onChange={(e) => setHoliday(e.target.value)}
                />
                <label>Notes</label>
                <Input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </GridItem>
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={onCloseEdit}
              sx={{ borderRadius: "8px" }}
            >
              Close
            </Button>
            <Button
              variant="ghost"
              sx={{
                backgroundColor: "rgb(33, 180, 152)",
                color: "white",
                borderRadius: "8px",
              }}
              onClick={updateEmployee}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
