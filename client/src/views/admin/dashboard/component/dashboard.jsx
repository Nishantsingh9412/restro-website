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
  ChakraProvider,
} from "@chakra-ui/react";

import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getAbsentApi,
  getBirthdayApi,
  getEmployeShiftApi,
  getUpcomingBirthdayApi,
} from "../../../../redux/action/dashboard";
import { Spinner } from "@chakra-ui/react";

export default function DashboardComponent() {
  //   const {
  //     isOpen: isOpen1,
  //     // onOpen: onOpen1,
  //     onClose: onClose1,
  //   } = useDisclosure();
  //   const {
  //     isOpen: isOpen2,
  //     onOpen: onOpen2,
  //     onClose: onClose2,
  //   } = useDisclosure();
  //   const {
  //     isOpen: isOpen3,
  //     onOpen: onOpen3,
  //     onClose: onClose3,
  //   } = useDisclosure();
  //   // ***** for modal box back *****
  //   const handleBackToFirstModal = () => {
  //     onClose3();
  //     onOpen2();
  //   };
  //   // ****** for modal box close ******
  //   const handleCloseAll = () => {
  //     onClose1();
  //     onClose2();
  //     onClose3();
  //   };

  //   const [name, setName] = React.useState("");

  const [employeeshift, setEmployeeShift] = useState([]);
  const [employeeabsense, setEmployeeAbsense] = useState([]);
  const [birthdays, setBirthdays] = useState([]);
  const [upcomingbirthdays, setUpcomingBirthdays] = useState([]);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  useEffect(() => {
    fetchBirthdays();
    getUpcomingBirthday();
    getEmployeShift();
    getAbsent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAbsent = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("ProfileData"));
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
    } finally {
      setLoading(false);
    }
  };

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
      <ChakraProvider>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="50vh"
        >
          <Spinner size="xl" />
        </Box>
      </ChakraProvider>
    );
  }

  return (
    <ChakraProvider>
      {/* ******* modal box for new Booking ********* */}
      {/* <Modal isOpen={isOpen2} onClose={onClose2}>
				<ModalOverlay />
				<ModalContent maxWidth="70%">
					<Grid templateColumns="repeat(12, 1fr)">
						<GridItem colSpan={8}>
							<ModalHeader
								sx={{
									backgroundColor: "rgb(63, 73, 98);",
									color: "white",
									textAlign: "center",
								}}
							>
								Create a new booking
							</ModalHeader>
							<ModalBody>
								<Box p={5} mx="auto" mt={5}>
									<Grid templateColumns="repeat(12, 1fr)" gap={4}>
										<GridItem colSpan={3}>
											<FormControl>
												<FormLabel>Date</FormLabel>
												<Input
													placeholder="Select Date and Time"
													size="md"
													type="date"
												/>
											</FormControl>
										</GridItem>
										<GridItem colSpan={3}>
											<FormControl>
												<FormLabel>Group size</FormLabel>
												<Select placeholder="Select option">
													<option value="option1">1</option>
													<option value="option2">2</option>
													<option value="option3">3</option>
													<option value="option3">4</option>
													<option value="option3">5</option>
												</Select>
											</FormControl>
										</GridItem>
										<GridItem colSpan={3}>
											<FormControl>
												<FormLabel>Timespan</FormLabel>
												<Select placeholder="Select option">
													<option value="option1">5 min</option>
													<option value="option2">10 min</option>
													<option value="option3">15 min</option>
													<option value="option3">20 min</option>
													<option value="option3">25 min</option>
												</Select>
											</FormControl>
										</GridItem>
										<GridItem colSpan={3}>
											<FormControl>
												<FormLabel>Timespan</FormLabel>
												<Select placeholder="Select option">
													<option value="option1">
														14:00 - 15:00 (10 seats)
													</option>
													<option value="option2">
														14:30 - 15:30 (10 seats)
													</option>
													<option value="option3">
														15:00 - 16:00 (10 seats)
													</option>
													<option value="option3">
														15:30 - 16:30 (10 seats)
													</option>
													<option value="option3">
														16:00 - 17:00 (10 seats)
													</option>
												</Select>
											</FormControl>
										</GridItem>
									</Grid>
								</Box>
							</ModalBody>
						</GridItem>
						<GridItem colSpan={4} sx={{ backgroundColor: "#f7f7f7" }}>
							<ModalHeader
								sx={{
									backgroundColor: "rgb(63, 73, 98);",
									color: "white",
									textAlign: "center",
								}}
							>
								Guest Details
							</ModalHeader>
							<ModalBody>
								<FormControl>
									<FormLabel>Name</FormLabel>
									<Input
										type="text"
										value={name}
										onChange={(e) => setName(e.target.value)}
									/>
								</FormControl>
								<FormControl>
									<FormLabel>Phone number</FormLabel>
									<InputGroup>
										<InputLeftElement pointerEvents="none">
											<PhoneIcon color="gray.300" />
										</InputLeftElement>
										<Input type="tel" placeholder="Phone number" />
									</InputGroup>
								</FormControl>
								<FormControl>
									<FormLabel>Email</FormLabel>
									<InputGroup>
										<InputLeftElement pointerEvents="none">
											<EmailIcon color="gray.300" />
										</InputLeftElement>
										<Input type="Email" placeholder="Email" />
									</InputGroup>
								</FormControl>
								<Checkbox>Send email notification</Checkbox>
								<Checkbox mb={[5]}>Update guest details</Checkbox>
							</ModalBody>
						</GridItem>
						<hr />
						<ModalFooter>
							<Button
								rightIcon={<ArrowForwardIcon />}
								colorScheme="teal"
								variant="outline"
								mr={3}
								onClick={onOpen3}
							>
								More Details
							</Button>
							<Button
								mr={3}
								onClick={onClose2}
								sx={{ backgroundColor: "rgb(204, 204, 204)", color: "white" }}
							>
								Cancel
							</Button>
							<Button
								sx={{ backgroundColor: "rgb(63, 73, 98)", color: "white" }}
							>
								Create
							</Button>
						</ModalFooter>
					</Grid>
				</ModalContent>
			</Modal> */}

      {/* ****** modal box for add restaurant ****** */}
      {/* <Modal isOpen={isOpen1} onClose={onClose1} size="xl">
				<ModalOverlay />
				<ModalContent maxWidth="70%">
					<ModalHeader sx={{ color: "rgb(63, 73, 98)" }}>
						Add a restaurant
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<label>Name</label>
						<Input
							type="text"
							placeholder="The restaurant name"
							mb={[4]}
							// onChange={(e) => setRestaurantName(e.target.value)}
						/>
						<label>Description</label>
						<Input
							type="text"
							placeholder="A short Description of your restaurant"
							mb={[4]}
							// onChange={(e) => setDescription(e.target.value)}
						/>
						<label>Website</label>
						<Input
							type="text"
							placeholder="The Website of your restaurant"
							mb={[4]}
							// onChange={(e) => setWebsite(e.target.value)}
						/>
						<h2 style={{ fontSize: "25px" }}>Restaurant address</h2>
						<label>Street and Number</label>
						<Input
							type="text"
							mb={[4]}
							// onChange={(e) => setStreet(e.target.value)}
						/>
						<label>City</label>
						<Input
							type="text"
							mb={[4]}
							// onChange={(e) => setCity(e.target.value)}
						/>
						<label>Zip code</label>
						<Input
							type="number"
							// onChange={(e) => setZipcode(e.target.value)}
						/>
						<label>Country</label>
						<Select
							class="form-select"
							id="country"
							name="country"
							mb={[4]}
							// onChange={(e) => setCountry(e.target.value)}
						>
							<option value="">country</option>
							<option value="AF">Afghanistan</option>
							<option value="AX">Åland Islands</option>
							<option value="AL">Albania</option>
							<option value="DZ">Algeria</option>
							<option value="AS">American Samoa</option>
							<option value="AD">Andorra</option>
							<option value="AO">Angola</option>
							<option value="AI">Anguilla</option>
							<option value="AQ">Antarctica</option>
							<option value="AG">Antigua and Barbuda</option>
							<option value="AR">Argentina</option>
							<option value="AM">Armenia</option>
							<option value="AW">Aruba</option>
							<option value="AU">Australia</option>
							<option value="AT">Austria</option>
							<option value="AZ">Azerbaijan</option>
							<option value="BS">Bahamas</option>
							<option value="BH">Bahrain</option>
							<option value="BD">Bangladesh</option>
							<option value="BB">Barbados</option>
							<option value="BY">Belarus</option>
							<option value="BE">Belgium</option>
							<option value="BZ">Belize</option>
							<option value="BJ">Benin</option>
							<option value="BM">Bermuda</option>
							<option value="BT">Bhutan</option>
							<option value="BO">Bolivia (Plurinational State of)</option>
							<option value="BA">Bosnia and Herzegovina</option>
							<option value="BW">Botswana</option>
							<option value="BV">Bouvet Island</option>
							<option value="BR">Brazil</option>
							<option value="IO">British Indian Ocean Territory</option>
							<option value="BN">Brunei Darussalam</option>
							<option value="BG">Bulgaria</option>
							<option value="BF">Burkina Faso</option>
							<option value="BI">Burundi</option>
							<option value="CV">Cabo Verde</option>
							<option value="KH">Cambodia</option>
							<option value="CM">Cameroon</option>
							<option value="CA">Canada</option>
							<option value="BQ">Caribbean Netherlands</option>
							<option value="KY">Cayman Islands</option>
							<option value="CF">Central African Republic</option>
							<option value="TD">Chad</option>
							<option value="CL">Chile</option>
							<option value="CN">China</option>
							<option value="CX">Christmas Island</option>
							<option value="CC">Cocos (Keeling) Islands</option>
							<option value="CO">Colombia</option>
							<option value="KM">Comoros</option>
							<option value="CG">Congo</option>
							<option value="CD">Congo, Democratic Republic of the</option>
							<option value="CK">Cook Islands</option>
							<option value="CR">Costa Rica</option>
							<option value="HR">Croatia</option>
							<option value="CU">Cuba</option>
							<option value="CW">Curaçao</option>
							<option value="CY">Cyprus</option>
							<option value="CZ">Czech Republic</option>
							<option value="CI">Côte d'Ivoire</option>
							<option value="DK">Denmark</option>
							<option value="DJ">Djibouti</option>
							<option value="DM">Dominica</option>
							<option value="DO">Dominican Republic</option>
							<option value="EC">Ecuador</option>
							<option value="EG">Egypt</option>
							<option value="SV">El Salvador</option>
							<option value="GQ">Equatorial Guinea</option>
							<option value="ER">Eritrea</option>
							<option value="EE">Estonia</option>
							<option value="SZ">Eswatini (Swaziland)</option>
							<option value="ET">Ethiopia</option>
							<option value="FK">Falkland Islands (Malvinas)</option>
							<option value="FO">Faroe Islands</option>
							<option value="FJ">Fiji</option>
							<option value="FI">Finland</option>
							<option value="FR">France</option>
							<option value="GF">French Guiana</option>
							<option value="PF">French Polynesia</option>
							<option value="TF">French Southern Territories</option>
							<option value="GA">Gabon</option>
							<option value="GM">Gambia</option>
							<option value="GE">Georgia</option>
							<option value="DE">Germany</option>
							<option value="GH">Ghana</option>
							<option value="GI">Gibraltar</option>
							<option value="GR">Greece</option>
							<option value="GL">Greenland</option>
							<option value="GD">Grenada</option>
							<option value="GP">Guadeloupe</option>
							<option value="GU">Guam</option>
							<option value="GT">Guatemala</option>
							<option value="GG">Guernsey</option>
							<option value="GN">Guinea</option>
							<option value="GW">Guinea-Bissau</option>
							<option value="GY">Guyana</option>
							<option value="HT">Haiti</option>
							<option value="HM">Heard Island and Mcdonald Islands</option>
							<option value="HN">Honduras</option>
							<option value="HK">Hong Kong</option>
							<option value="HU">Hungary</option>
							<option value="IS">Iceland</option>
							<option value="IN">India</option>
							<option value="ID">Indonesia</option>
							<option value="IR">Iran</option>
							<option value="IQ">Iraq</option>
							<option value="IE">Ireland</option>
							<option value="IM">Isle of Man</option>
							<option value="IL">Israel</option>
							<option value="IT">Italy</option>
							<option value="JM">Jamaica</option>
							<option value="JP">Japan</option>
							<option value="JE">Jersey</option>
							<option value="JO">Jordan</option>
							<option value="KZ">Kazakhstan</option>
							<option value="KE">Kenya</option>
							<option value="KI">Kiribati</option>
							<option value="KP">Korea, North</option>
							<option value="KR">Korea, South</option>
							<option value="XK">Kosovo</option>
							<option value="KW">Kuwait</option>
							<option value="KG">Kyrgyzstan</option>
							<option value="LA">Lao People's Democratic Republic</option>
							<option value="LV">Latvia</option>
							<option value="LB">Lebanon</option>
							<option value="LS">Lesotho</option>
							<option value="LR">Liberia</option>
							<option value="LY">Libya</option>
							<option value="LI">Liechtenstein</option>
							<option value="LT">Lithuania</option>
							<option value="LU">Luxembourg</option>
							<option value="MO">Macao</option>
							<option value="MK">Macedonia North</option>
							<option value="MG">Madagascar</option>
							<option value="MW">Malawi</option>
							<option value="MY">Malaysia</option>
							<option value="MV">Maldives</option>
							<option value="ML">Mali</option>
							<option value="MT">Malta</option>
							<option value="MH">Marshall Islands</option>
							<option value="MQ">Martinique</option>
							<option value="MR">Mauritania</option>
							<option value="MU">Mauritius</option>
							<option value="YT">Mayotte</option>
							<option value="MX">Mexico</option>
							<option value="FM">Micronesia</option>
							<option value="MD">Moldova</option>
							<option value="MC">Monaco</option>
							<option value="MN">Mongolia</option>
							<option value="ME">Montenegro</option>
							<option value="MS">Montserrat</option>
							<option value="MA">Morocco</option>
							<option value="MZ">Mozambique</option>
							<option value="MM">Myanmar (Burma)</option>
							<option value="NA">Namibia</option>
							<option value="NR">Nauru</option>
							<option value="NP">Nepal</option>
							<option value="NL">Netherlands</option>
							<option value="AN">Netherlands Antilles</option>
							<option value="NC">New Caledonia</option>
							<option value="NZ">New Zealand</option>
							<option value="NI">Nicaragua</option>
							<option value="NE">Niger</option>
							<option value="NG">Nigeria</option>
							<option value="NU">Niue</option>
							<option value="NF">Norfolk Island</option>
							<option value="MP">Northern Mariana Islands</option>
							<option value="NO">Norway</option>
							<option value="OM">Oman</option>
							<option value="PK">Pakistan</option>
							<option value="PW">Palau</option>
							<option value="PS">Palestine</option>
							<option value="PA">Panama</option>
							<option value="PG">Papua New Guinea</option>
							<option value="PY">Paraguay</option>
							<option value="PE">Peru</option>
							<option value="PH">Philippines</option>
							<option value="PN">Pitcairn Islands</option>
							<option value="PL">Poland</option>
							<option value="PT">Portugal</option>
							<option value="PR">Puerto Rico</option>
							<option value="QA">Qatar</option>
							<option value="RE">Reunion</option>
							<option value="RO">Romania</option>
							<option value="RU">Russian Federation</option>
							<option value="RW">Rwanda</option>
							<option value="BL">Saint Barthelemy</option>
							<option value="SH">Saint Helena</option>
							<option value="KN">Saint Kitts and Nevis</option>
							<option value="LC">Saint Lucia</option>
							<option value="MF">Saint Martin</option>
							<option value="PM">Saint Pierre and Miquelon</option>
							<option value="VC">Saint Vincent and the Grenadines</option>
							<option value="WS">Samoa</option>
							<option value="SM">San Marino</option>
							<option value="ST">Sao Tome and Principe</option>
							<option value="SA">Saudi Arabia</option>
							<option value="SN">Senegal</option>
							<option value="RS">Serbia</option>
							<option value="CS">Serbia and Montenegro</option>
							<option value="SC">Seychelles</option>
							<option value="SL">Sierra Leone</option>
							<option value="SG">Singapore</option>
							<option value="SX">Sint Maarten</option>
							<option value="SK">Slovakia</option>
							<option value="SI">Slovenia</option>
							<option value="SB">Solomon Islands</option>
							<option value="SO">Somalia</option>
							<option value="ZA">South Africa</option>
							<option value="GS">
								South Georgia and the South Sandwich Islands
							</option>
							<option value="SS">South Sudan</option>
							<option value="ES">Spain</option>
							<option value="LK">Sri Lanka</option>
							<option value="SD">Sudan</option>
							<option value="SR">Suriname</option>
							<option value="SJ">Svalbard and Jan Mayen</option>
							<option value="SE">Sweden</option>
							<option value="CH">Switzerland</option>
							<option value="SY">Syria</option>
							<option value="TW">Taiwan</option>
							<option value="TJ">Tajikistan</option>
							<option value="TZ">Tanzania</option>
							<option value="TH">Thailand</option>
							<option value="TL">Timor-Leste</option>
							<option value="TG">Togo</option>
							<option value="TK">Tokelau</option>
							<option value="TO">Tonga</option>
							<option value="TT">Trinidad and Tobago</option>
							<option value="TN">Tunisia</option>
							<option value="TR">Turkey (Türkiye)</option>
							<option value="TM">Turkmenistan</option>
							<option value="TC">Turks and Caicos Islands</option>
							<option value="TV">Tuvalu</option>
							<option value="UM">U.S. Outlying Islands</option>
							<option value="UG">Uganda</option>
							<option value="UA">Ukraine</option>
							<option value="AE">United Arab Emirates</option>
							<option value="GB">United Kingdom</option>
							<option value="US">United States</option>
							<option value="UY">Uruguay</option>
							<option value="UZ">Uzbekistan</option>
							<option value="VU">Vanuatu</option>
							<option value="VA">Vatican City Holy See</option>
							<option value="VE">Venezuela</option>
							<option value="VN">Vietnam</option>
							<option value="VG">Virgin Islands, British</option>
							<option value="VI">Virgin Islands, U.S</option>
							<option value="WF">Wallis and Futuna</option>
							<option value="EH">Western Sahara</option>
							<option value="YE">Yemen</option>
							<option value="ZM">Zambia</option>
							<option value="ZW">Zimbabwe</option>
						</Select>
						<label>Timezone</label>
						<Select id="timezone" name="timezone" mb={[4]}>
							<option value="Etc/GMT+12">(UTC -12:00) Baker Island</option>
							<option value="Etc/GMT+11">(UTC -11:00) Niue</option>
							<option value="Pacific/Honolulu">(UTC -10:00) Hawaii</option>
							<option value="Pacific/Marquesas">
								(UTC -09:30) Marquesas Islands
							</option>
							<option value="America/Anchorage">(UTC -09:00) Alaska</option>
							<option value="America/Los_Angeles">
								(UTC -08:00) Pacific Time (US & Canada)
							</option>
							<option value="America/Denver">
								(UTC -07:00) Mountain Time (US & Canada)
							</option>
							<option value="America/Chicago">
								(UTC -06:00) Central Time (US & Canada)
							</option>
							<option value="America/New_York">
								(UTC -05:00) Eastern Time (US & Canada)
							</option>
							<option value="America/Halifax">
								(UTC -04:00) Atlantic Time (Canada)
							</option>
							<option value="America/St_Johns">
								(UTC -03:30) Newfoundland
							</option>
							<option value="America/Sao_Paulo">(UTC -03:00) Brasilia</option>
							<option value="Atlantic/South_Georgia">
								(UTC -02:00) South Georgia
							</option>
							<option value="Atlantic/Azores">(UTC -01:00) Azores</option>
							<option value="Etc/UTC">(UTC +00:00) UTC</option>
							<option value="Europe/London">(UTC +00:00) London</option>
							<option value="Africa/Abidjan">(UTC +00:00) Abidjan</option>
							<option value="Europe/Paris">(UTC +01:00) Paris</option>
							<option value="Europe/Berlin">(UTC +01:00) Berlin</option>
							<option value="Africa/Johannesburg">
								(UTC +02:00) Johannesburg
							</option>
							<option value="Europe/Moscow">(UTC +03:00) Moscow</option>
							<option value="Asia/Dubai">(UTC +04:00) Dubai</option>
							<option value="Asia/Karachi">(UTC +05:00) Karachi</option>
							<option value="Asia/Dhaka">(UTC +06:00) Dhaka</option>
							<option value="Asia/Jakarta">(UTC +07:00) Jakarta</option>
							<option value="Asia/Shanghai">(UTC +08:00) Shanghai</option>
							<option value="Asia/Tokyo">(UTC +09:00) Tokyo</option>
							<option value="Australia/Sydney">(UTC +10:00) Sydney</option>
							<option value="Pacific/Noumea">(UTC +11:00) Noumea</option>
							<option value="Pacific/Auckland">(UTC +12:00) Auckland</option>
							<option value="Pacific/Chatham">
								(UTC +12:45) Chatham Islands
							</option>
							<option value="Pacific/Tongatapu">(UTC +13:00) Nuku'alofa</option>
							<option value="Pacific/Kiritimati">
								(UTC +14:00) Kiritimati
							</option>
						</Select>
						<label for="language">Language</label>
						<Select id="language" name="language" mb={[4]}>
							<option value="en">English</option>
							<option value="es">Spanish</option>
							<option value="fr">French</option>
							<option value="de">German</option>
							<option value="zh">Chinese</option>
							<option value="ja">Japanese</option>
							<option value="ko">Korean</option>
							<option value="ru">Russian</option>
							<option value="ar">Arabic</option>
							<option value="pt">Portuguese</option>
							<option value="hi">Hindi</option>
							<option value="bn">Bengali</option>
							<option value="pa">Punjabi</option>
						</Select>
						<label>Email</label>
						<Input type="email" mb={[4]} />
						<label>Phone</label>
						<Input type="number" mb={[4]} />
						<p>
							These contact data will be used in the reservation confirmation
							email for your guests.
						</p>
					</ModalBody>

					<ModalFooter sx={{ justifyContent: "flex-start" }}>
						<Button
							rightIcon={<ArrowForwardIcon />}
							sx={{ backgroundColor: "rgb(51, 122, 183);", color: "white" }}
							mr={3}
						>
							Continue
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal> */}

      {/* ******* modal box for more detail ******** */}
      {/* <Modal isOpen={isOpen3} onClose={onClose3}>
				<ModalOverlay />
				<ModalContent maxWidth="70%">
					<Grid templateColumns="repeat(12, 1fr)">
						<GridItem colSpan={9}>
							<ModalHeader
								sx={{
									backgroundColor: "rgb(63, 73, 98);",
									color: "white",
									textAlign: "center",
								}}
							>
								Booking details
							</ModalHeader>
							<ModalBody>
								<Box p={5} mx="auto" mt={5}>
									<Box
										sx={{
											padding: " 30px",
											boxShadow: "rgb(204, 204, 204) 0px 8px 9px -9px;",
										}}
									>
										<p>We, Jul 17, 2024, 14:30, 2 people</p>
									</Box>
									<Grid templateColumns="repeat(12, 1fr)" gap={4}>
										<GridItem colSpan={6}>
											<FormLabel>Booking note</FormLabel>
											<Textarea placeholder="Add a note" />
										</GridItem>
										<GridItem colSpan={6}>
											<FormControl>
												<FormLabel>Customer tags</FormLabel>
												<Select placeholder="Select option">
													<option value="option1">1</option>
													<option value="option2">2</option>
													<option value="option3">3</option>
													<option value="option3">4</option>
													<option value="option3">5</option>
												</Select>
											</FormControl>
										</GridItem>
										<GridItem colSpan={3}>
											<FormControl>
												<FormLabel>Timespan</FormLabel>
												<Select placeholder="Select option">
													<option value="option1">5 min</option>
													<option value="option2">10 min</option>
													<option value="option3">15 min</option>
													<option value="option3">20 min</option>
													<option value="option3">25 min</option>
												</Select>
											</FormControl>
										</GridItem>
										<GridItem colSpan={3}>
											<FormControl>
												<FormLabel>Timespan</FormLabel>
												<Select placeholder="Select option">
													<option value="option1">
														14:00 - 15:00 (10 seats)
													</option>
													<option value="option2">
														14:30 - 15:30 (10 seats)
													</option>
													<option value="option3">
														15:00 - 16:00 (10 seats)
													</option>
													<option value="option3">
														15:30 - 16:30 (10 seats)
													</option>
													<option value="option3">
														16:00 - 17:00 (10 seats)
													</option>
												</Select>
											</FormControl>
										</GridItem>
									</Grid>
								</Box>
							</ModalBody>
						</GridItem>
						<GridItem colSpan={3} sx={{ backgroundColor: "#f7f7f7" }}>
							<ModalHeader
								sx={{
									color: "white",
									textAlign: "center",
									backgroundColor: "rgb(63, 73, 98);",
								}}
							>
								Booking Recurrence
							</ModalHeader>
							<ModalBody>
								<FormControl>
									<FormLabel>Name</FormLabel>
									<Input
										type="text"
										value={name}
										onChange={(e) => setName(e.target.value)}
									/>
								</FormControl>
								<FormControl>
									<FormLabel>Phone number</FormLabel>
									<InputGroup>
										<InputLeftElement pointerEvents="none">
											<PhoneIcon color="gray.300" />
										</InputLeftElement>
										<Input type="tel" placeholder="Phone number" />
									</InputGroup>
								</FormControl>
								<FormControl>
									<FormLabel>Email</FormLabel>
									<InputGroup>
										<InputLeftElement pointerEvents="none">
											<EmailIcon color="gray.300" />
										</InputLeftElement>
										<Input type="Email" placeholder="Email" />
									</InputGroup>
								</FormControl>
								<Checkbox>Send email notification</Checkbox>
								<Checkbox mb={[5]}>Update guest details</Checkbox>
							</ModalBody>
						</GridItem>
						<ModalFooter>
							<Button
								colorScheme="blue"
								mr={3}
								onClick={handleBackToFirstModal}
							>
								Back
							</Button>
							<Button colorScheme="blue" mr={3} onClick={handleCloseAll}>
								Close
							</Button>
						</ModalFooter>
					</Grid>
				</ModalContent>
			</Modal> */}

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
    </ChakraProvider>
  );
}
