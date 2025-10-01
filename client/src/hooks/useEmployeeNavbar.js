import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useToast } from "@chakra-ui/react";
import {
  updateEmployeeOnlineStatus,
  clearError,
  updateOdometerReading,
} from "../redux/action/Employees/employee.js";
import { logoutUser } from "../redux/action/authSlice.js";
import { clearEmpData } from "../redux/action/userSlice.js";
import { setCurrentLocation } from "../redux/action/location.js";
import { socket } from "../api/socket";
import { employeesRoles, localStorageData } from "../utils/constant.js";

const useEmployeeNavbar = () => {
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const localData = JSON.parse(
    localStorage.getItem(localStorageData.PROFILE_DATA)
  );
  const empData = useSelector((state) => state?.userReducer?.data);
  const error = useSelector((state) => state?.employee?.error);

  const [onlineStatus, setOnlineStatus] = useState(empData?.is_online || false);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isCameraPreviewModalOpen, setIsCameraPreviewModalOpen] =
    useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const cameraPreviewRef = useRef(null);

  const [isOdometerModalOpen, setIsOdometerModalOpen] = useState(false);
  const [odometerReading, setOdometerReading] = useState("");
  const [capturedOdometerPhoto, setCapturedOdometerPhoto] = useState(null);
  const locationIntervalRef = useRef(null);

  const getDistance = (prev, curr) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(curr.latitude - prev.latitude);
    const dLon = toRad(curr.longitude - prev.longitude);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(prev.latitude)) *
        Math.cos(toRad(curr.latitude)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000;
  };

  const sendLocation = (location) => {
    dispatch(setCurrentLocation(location));
    socket.emit("sendLocation", {
      delEmpName: empData?.name,
      delEmpId: empData?._id,
      adminId: empData?.created_by,
      location,
    });
  };

  const sendLiveLocation = useCallback(() => {
    const updateLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const lastLocation = location ?? {
            latitude: empData?.lastLocation?.lat,
            longitude: empData?.lastLocation?.lng,
          };

          if (
            !lastLocation ||
            getDistance(lastLocation, { latitude, longitude }) > 50
          ) {
            setLocation({ latitude, longitude });
            sendLocation({ latitude, longitude });
          }
        },
        (err) => {
          toast({
            title: "Location Error",
            description: err.message,
            status: "error",
          });
          clearInterval(locationIntervalRef.current);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    };

    if (!locationIntervalRef.current) {
      locationIntervalRef.current = setInterval(updateLocation, 10000);
    }

    return () => clearInterval(locationIntervalRef.current);
  }, [location, empData, sendLocation, toast]);

  const handleLogout = useCallback(() => {
    dispatch(logoutUser());
    dispatch(clearEmpData());
    clearInterval(locationIntervalRef.current);
    navigate("/");
  }, [dispatch, navigate]);

  const updateOnlineStatus = useCallback(async () => {
    const formData = new FormData();
    formData.append("is_online", true);
    formData.append("latitude", location?.latitude);
    formData.append("longitude", location?.longitude);
    formData.append("adminId", empData?.created_by);
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
      setOnlineStatus(true);
    } catch (err) {
      toast({ title: "Error", description: err.message, status: "error" });
    }
  }, [dispatch, location, capturedPhoto, toast]);

  const handleToggleStatus = async (e) => {
    const newStatus = e.target.checked;
    setLoading(true);
    if (newStatus) setIsLocationModalOpen(true);
    else {
      await dispatch(updateEmployeeOnlineStatus({ is_online: false }));
      toast({
        title: "Offline",
        description: "You are now offline",
        status: "info",
      });
      setOnlineStatus(false);
    }
    setLoading(false);
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
    } catch {
      toast({
        title: "Camera Permission Denied",
        description: "Please enable camera access to proceed.",
        status: "error",
      });
      setLoading(false);
    }
  };

  const capturePhoto = (setPhoto, closeModal) => {
    const track = cameraStream.getVideoTracks()[0];
    const canvas = document.createElement("canvas");
    canvas.width = cameraPreviewRef.current.videoWidth;
    canvas.height = cameraPreviewRef.current.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(
      cameraPreviewRef.current,
      0,
      0,
      canvas.width,
      canvas.height
    );
    canvas.toBlob((blob) => {
      setPhoto(blob);
      track.stop();
      setCameraStream(null);
      setImageLoading(false);
    }, "image/jpeg");
    closeModal();
  };

  const handleTakePhoto = () => {
    setImageLoading(true);
    capturePhoto(setCapturedPhoto, () => setIsCameraPreviewModalOpen(false));
  };

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

  const handleOdometerSubmission = useCallback(async () => {
    const formData = new FormData();
    formData.append("odometer_reading", odometerReading);
    formData.append("odometer_photo", capturedOdometerPhoto, "odometer.jpg");
    try {
      const res = await dispatch(updateOdometerReading(formData));
      if (res.error) throw new Error(res.error.message);
      toast({
        title: "Submitted",
        description: "Odometer reading submitted",
        status: "success",
      });
      await updateOnlineStatus();
      setIsOdometerModalOpen(false);
      setOdometerReading("");
      setCapturedOdometerPhoto(null);
    } catch (err) {
      toast({ title: "Error", description: err.message, status: "error" });
    }
  }, [
    dispatch,
    odometerReading,
    capturedOdometerPhoto,
    updateOnlineStatus,
    toast,
  ]);

  useEffect(() => {
    if (error) {
      toast({ title: "Error", description: error, status: "error" });
      dispatch(clearError());
    }
  }, [dispatch, error, toast]);

  useEffect(() => {
    if (cameraPreviewRef.current && cameraStream) {
      cameraPreviewRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  useEffect(() => {
    const token = localData?.token;
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) handleLogout();
    }
  }, [handleLogout, localData?.token]);

  useEffect(() => {
    if (empData?.is_online) setOnlineStatus(true);
  }, [empData]);

  useEffect(() => {
    if (onlineStatus && empData?.role === employeesRoles.DELIVERY_BOY) {
      sendLiveLocation();
    } else {
      clearInterval(locationIntervalRef.current);
    }
    return () => clearInterval(locationIntervalRef.current);
  }, [onlineStatus]);

  return {
    empData,
    onlineStatus,
    loading,
    imageLoading,
    cameraPreviewRef,
    modals: {
      isLocationModalOpen,
      isCameraPreviewModalOpen,
      isOdometerModalOpen,
      capturedPhoto,
      capturedOdometerPhoto,
    },
    modalHandlers: {
      setIsLocationModalOpen,
      setIsCameraPreviewModalOpen,
      setIsOdometerModalOpen,
    },
    previewHandlers: {
      handleCameraCapture,
      handleTakePhoto,
      setCapturedPhoto,
      setCapturedOdometerPhoto,
    },
    odometerHandlers: {
      odometerReading,
      setOdometerReading,
      handleOdometerCapture,
      handleOdometerSubmission,
    },
    handleToggleStatus,
    handleLogout,
    updateOnlineStatus,
  };
};

export default useEmployeeNavbar;
