import {
  Avatar,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Switch,
  Text,
  useColorModeValue,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Image,
  Spinner,
  Input,
} from "@chakra-ui/react";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../redux/action/auth.js";
import {
  updateEmployeeOnlineStatus,
  clearError,
  updateOdometerReading,
} from "../../redux/action/Employees/employee.js";
import { set } from "date-fns";

// Modal component for displaying different modals
const ModalComponent = ({ isOpen, onClose, title, body, footer }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>{title}</ModalHeader>
      <ModalBody>{body}</ModalBody>
      <ModalFooter>{footer}</ModalFooter>
    </ModalContent>
  </Modal>
);

export default function EmployeeNavbarLinks() {
  const menuBg = useColorModeValue("white", "navy.800");
  const shadow = useColorModeValue(
    "14px 17px 40px 4px rgba(112, 144, 176, 0.18)",
    "14px 17px 40px 4px rgba(112, 144, 176, 0.06)"
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const localData = JSON.parse(localStorage.getItem("ProfileData"));
  const empData = useSelector((state) => state?.userReducer?.data);
  const error = useSelector((state) => state?.employee?.error);
  const empStatus = useSelector((state) => state?.employee?.status);

  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isCameraPreviewModalOpen, setIsCameraPreviewModalOpen] =
    useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [cameraPreview, setCameraPreview] = useState(null);
  const [isOdometerModalOpen, setIsOdometerModalOpen] = useState(false);
  const [odometerReading, setOdometerReading] = useState("");
  const [capturedOdometerPhoto, setCapturedOdometerPhoto] = useState(null);

  // Handle user logout
  const handleLogout = useCallback(() => {
    dispatch(logoutUser());
    navigate("/");
  }, [dispatch, navigate]);

  // Update employee online status
  const updateOnlineStatus = useCallback(async () => {
    const formData = new FormData();
    formData.append("is_online", true);
    formData.append("latitude", location?.latitude);
    formData.append("longitude", location?.longitude);
    formData.append("live_photo", capturedPhoto, "photo.jpg");

    try {
      const res = await dispatch(updateEmployeeOnlineStatus(formData));
      if (res.error)
        throw new Error(res.error.message || "Something went wrong");
      toast({
        title: "Online",
        description: "You are now online",
        status: "success",
      });
      setCapturedPhoto(null);
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: err.message, status: "error" });
    }
  }, [dispatch, location, capturedPhoto, toast]);

  // Handle toggle status switch
  const handleToggleStatus = async (e) => {
    const newStatus = e.target.checked;
    setLoading(true);
    if (newStatus) {
      setIsLocationModalOpen(true);
    } else {
      await dispatch(updateEmployeeOnlineStatus({ is_online: false }));
      toast({
        title: "Offline",
        description: "You are now offline",
        status: "info",
      });
    }
    setLoading(false);
  };

  // Handle location permission
  const handleLocationPermission = () => {
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        handleCameraCapture();
        console.log(location);
        setIsCameraPreviewModalOpen(true);
      },
      () => {
        toast({
          title: "Location Permission Denied",
          description: "Please enable location access to proceed.",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
        setLoading(false);
      }
    );
    setIsLocationModalOpen(false);
    setLocationLoading(false);
  };

  // Handle camera capture
  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
    } catch {
      toast({
        title: "Camera Permission Denied",
        description: "Please enable camera access to proceed.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  // Handle confirm photo
  const handleConfirmPhoto = async () => {
    setIsCameraPreviewModalOpen(false);
    if (empData?.role === "Delivery Boy") {
      handleCameraCapture();
      setIsOdometerModalOpen(true);
    } else {
      setCapturedPhoto(null);
      await updateOnlineStatus();
    }
  };

  // Capture photo from camera stream
  const capturePhoto = (setPhoto, closeModal) => {
    const track = cameraStream.getVideoTracks()[0];
    const canvas = document.createElement("canvas");
    canvas.width = cameraPreview.videoWidth;
    canvas.height = cameraPreview.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(cameraPreview, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      setPhoto(blob);
      setCameraStream(null);
      track.stop();
      setImageLoading(false);
    }, "image/jpeg");
    closeModal();
  };

  // Handle take photo
  const handleTakePhoto = () => {
    setImageLoading(true);
    capturePhoto(setCapturedPhoto, () => setIsCameraPreviewModalOpen(false));
  };

  // Handle odometer capture
  const handleOdometerCapture = () => {
    if (!odometerReading) {
      toast({
        title: "Error",
        description: "Please enter odometer reading",
        status: "error",
      });
      return;
    }
    capturePhoto(setCapturedOdometerPhoto, () => setIsOdometerModalOpen(false));
  };

  // Handle odometer submission
  const handleOdometerSubmission = useCallback(async () => {
    const formData = new FormData();
    formData.append("odometer_reading", odometerReading);
    formData.append("odometer_photo", capturedOdometerPhoto, "odometer.jpg");

    try {
      const res = await dispatch(updateOdometerReading(formData));
      if (res.error)
        throw new Error(res.error.message || "Something went wrong");
      toast({
        title: "Odometer Submitted",
        description: "Your odometer reading has been successfully submitted.",
        status: "success",
      });
      await updateOnlineStatus();
      setIsOdometerModalOpen(false);
      setOdometerReading("");
      setCapturedOdometerPhoto(null);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to submit odometer data",
        status: "error",
      });
    }
  }, [
    dispatch,
    odometerReading,
    capturedOdometerPhoto,
    updateOnlineStatus,
    toast,
  ]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      dispatch(clearError());
    }
  }, [dispatch, error, toast]);

  // Set camera preview stream
  useEffect(() => {
    if (cameraPreview && cameraStream) {
      cameraPreview.srcObject = cameraStream;
    }
  }, [cameraStream, cameraPreview]);

  // Check token expiration
  useEffect(() => {
    const token = localData?.token;
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) handleLogout();
    }
  }, [handleLogout, localData?.token]);

  // Show loading spinner if image is loading
  if (imageLoading) {
    return (
      <Flex justifyContent="center" alignItems="center">
        <Spinner size="md" />
      </Flex>
    );
  }

  return (
    <>
      <Flex
        w={{ sm: "100%", md: "auto" }}
        alignItems="center"
        flexDirection="row"
        p="10px"
        borderRadius="30px"
        boxShadow={shadow}
      >
        <Menu>
          <MenuButton>
            <Avatar
              color="white"
              name={empData?.name || "Employee"}
              bg="#11047A"
              size="sm"
              w="40px"
              h="40px"
            />
          </MenuButton>
          <MenuList boxShadow={shadow} mt="10px" bg={menuBg} border="none">
            <Text ps="10px" pt="16px" pb="10px" fontSize="sm" fontWeight="700">
              👋 Hey, {empData?.name || "Employee"}
            </Text>
            <MenuItem>
              <Text fontSize="sm" mr={10}>
                Receive Deliveries
              </Text>
              <Switch
                isChecked={empStatus?.is_online || empData?.is_online}
                onChange={handleToggleStatus}
                isDisabled={loading}
              />
            </MenuItem>
            <MenuItem color="red.400" onClick={handleLogout}>
              <Text fontSize="sm">Log out</Text>
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>

      <ModalComponent
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        title="Location Permission"
        body="Please grant location access to proceed."
        footer={
          <>
            <Button colorScheme="blue" onClick={handleLocationPermission}>
              {locationLoading ? <Spinner size="sm" /> : "Allow"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setIsLocationModalOpen(false)}
            >
              Cancel
            </Button>
          </>
        }
      />

      <ModalComponent
        isOpen={isCameraPreviewModalOpen}
        onClose={() => {
          setIsCameraPreviewModalOpen(false);
          if (cameraStream) {
            cameraStream.getTracks().forEach((track) => track.stop());
            setCameraStream(null);
          }
        }}
        title="Camera Preview"
        body={
          <video
            ref={(el) => setCameraPreview(el)}
            autoPlay
            style={{ width: "100%" }}
          />
        }
        footer={
          <>
            <Button colorScheme="blue" onClick={handleTakePhoto}>
              Capture
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setIsCameraPreviewModalOpen(false);
                if (cameraStream) {
                  cameraStream.getTracks().forEach((track) => track.stop());
                  setCameraStream(null);
                }
              }}
            >
              Cancel
            </Button>
          </>
        }
      />

      <ModalComponent
        isOpen={!!capturedPhoto}
        onClose={() => setCapturedPhoto(null)}
        title="Preview Photo"
        body={
          capturedPhoto && (
            <Image src={URL.createObjectURL(capturedPhoto)} alt="Preview" />
          )
        }
        footer={
          <>
            <Button colorScheme="blue" onClick={handleConfirmPhoto}>
              Confirm
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setCapturedPhoto(null);
                setIsCameraPreviewModalOpen(true);
                handleCameraCapture();
              }}
            >
              Retake
            </Button>
          </>
        }
      />

      <ModalComponent
        isOpen={!!capturedOdometerPhoto}
        onClose={() => setCapturedOdometerPhoto(null)}
        title="Preview Odometer"
        body={
          capturedOdometerPhoto && (
            <Image
              src={URL.createObjectURL(capturedOdometerPhoto)}
              alt="Preview"
            />
          )
        }
        footer={
          <>
            <Button colorScheme="blue" onClick={handleOdometerSubmission}>
              Confirm
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setCapturedOdometerPhoto(null);
                setIsOdometerModalOpen(true);
                handleCameraCapture();
              }}
            >
              Retake
            </Button>
          </>
        }
      />

      <ModalComponent
        isOpen={isOdometerModalOpen}
        onClose={() => setIsOdometerModalOpen(false)}
        title="Odometer Reading"
        body={
          <>
            <Input
              placeholder="Enter Odometer Reading"
              value={odometerReading}
              onChange={(e) => setOdometerReading(e.target.value)}
              required
              mb={4}
            />
            <video
              ref={(el) => setCameraPreview(el)}
              autoPlay
              style={{ width: "100%" }}
            />
          </>
        }
        footer={
          <>
            <Button colorScheme="blue" onClick={handleOdometerCapture}>
              Capture Odometer Photo
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setIsOdometerModalOpen(false);
                if (cameraStream) {
                  cameraStream.getTracks().forEach((track) => track.stop());
                  setCameraStream(null);
                }
              }}
            >
              Cancel
            </Button>
          </>
        }
      />
    </>
  );
}