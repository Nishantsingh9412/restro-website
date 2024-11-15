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
} from "@chakra-ui/react";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../redux/action/auth.js";
import {
  updateEmployeeOnlineStatus,
  clearError,
} from "../../redux/action/Employees/employee.js";

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
  const [loading, setLoading] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isCameraPreviewModalOpen, setIsCameraPreviewModalOpen] =
    useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [cameraPreview, setCameraPreview] = useState(null);

  const handleLogout = useCallback(() => {
    dispatch(logoutUser());
    navigate("/");
  }, [dispatch, navigate]);

  const updateStatus = useCallback(
    async (status) => {
      const formData = new FormData();
      formData.append("is_online", status);
      if (status) {
        formData.append("latitude", location?.latitude);
        formData.append("longitude", location?.longitude);
        formData.append("live_photo", capturedPhoto);
      }
      try {
        const res = await dispatch(
          updateEmployeeOnlineStatus(status ? formData : { is_online: status })
        );
        if (res.error)
          throw new Error(res.error.message || "Something went wrong");
        toast({
          title: status ? "Online" : "Offline",
          description: status ? "You are now online" : "You are now offline",
          status: status ? "success" : "info",
        });
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, location, capturedPhoto, toast]
  );

  const handleToggleStatus = async (e) => {
    const newStatus = e.target.checked;
    setLoading(true);
    if (newStatus) {
      if (!location) setIsLocationModalOpen(true);
      else await handleCameraCapture();
    } else {
      await updateStatus(false);
    }
    setLoading(false);
  };

  const handleLocationPermission = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLocationModalOpen(false);
        handleCameraCapture();
      },
      () => {
        toast({
          title: "Location Permission Denied",
          description: "Please enable location access to proceed.",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
        setIsLocationModalOpen(false);
        setLoading(false);
      }
    );
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      setIsCameraPreviewModalOpen(true);
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

  const handleConfirmPhoto = async () => {
    await updateStatus(true);
    setIsCameraPreviewModalOpen(false);
    setCapturedPhoto(null);
  };

  const handleTakePhoto = async () => {
    const track = cameraStream.getVideoTracks()[0];
    const imageCapture = new ImageCapture(track);
    setIsCameraPreviewModalOpen(false);
    setImageLoading(true);
    const photo = await imageCapture.takePhoto();
    track.stop();
    setCapturedPhoto(photo);
    setCameraStream(null);
    setImageLoading(false);
  };

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

  useEffect(() => {
    if (cameraPreview && cameraStream) {
      cameraPreview.srcObject = cameraStream;
    }
  }, [cameraStream, cameraPreview]);

  useEffect(() => {
    const token = localData?.token;
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) handleLogout();
    }
  }, [handleLogout, localData?.token]);

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

      <Modal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Location Permission</ModalHeader>
          <ModalBody>Please grant location access to proceed.</ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleLocationPermission}>
              Allow
            </Button>
            <Button
              variant="ghost"
              onClick={() => setIsLocationModalOpen(false)}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isCameraPreviewModalOpen}
        onClose={() => {
          setIsCameraPreviewModalOpen(false);
          if (cameraStream) {
            cameraStream.getTracks().forEach((track) => track.stop());
            setCameraStream(null);
          }
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Camera Preview</ModalHeader>
          <ModalBody>
            <video
              ref={(el) => setCameraPreview(el)}
              autoPlay
              style={{ width: "100%" }}
            />
          </ModalBody>
          <ModalFooter>
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
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={!!capturedPhoto} onClose={() => setCapturedPhoto(null)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Preview Photo</ModalHeader>
          <ModalBody>
            {capturedPhoto && (
              <Image src={URL.createObjectURL(capturedPhoto)} alt="Preview" />
            )}
          </ModalBody>
          <ModalFooter>
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
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
