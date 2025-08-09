import { useCallback, useState, useEffect } from "react";
import { useToast } from "../../../contexts/useToast";
import { logoutUser } from "../../../redux/action/authSlice";
import { clearEmpData } from "../../../redux/action/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../useModal";
import { socket } from "../../../api/socket";
import { employeesRoles } from "../../../utils/constant.js";
import { setCurrentLocation } from "../../../redux/action/location.js";
import {
  updateEmployeeOnlineStatus,
  clearError,
  updateOdometerReading,
} from "../../../redux/action/Employees/employee.js";

export const useDeliveryDashboard = () => {
  const showToast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userData = useSelector((state) => state.userReducer?.data);
  const empData = useSelector((state) => state?.userReducer?.data);
  const error = useSelector((state) => state?.employee?.error);

  const [location, setLocation] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState(
    userData?.is_online || false
  );
  const [cameraStream, setCameraStream] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [cameraPreview, setCameraPreview] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [odometerReading, setOdometerReading] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationInterval, setLocationInterval] = useState(null);
  const [capturedOdometerPhoto, setCapturedOdometerPhoto] = useState(null);

  const modals = {
    locationModal: useModal(),
    cameraModal: useModal(),
    odometerModal: useModal(),
    livePhotoModal: useModal(),
  };

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
      showToast("You are now online", "success");
      setCapturedPhoto(null);
      setOnlineStatus(true);
    } catch (err) {
      showToast(err.message, "error");
    }
  }, [
    location?.latitude,
    location?.longitude,
    empData?.created_by,
    capturedPhoto,
    dispatch,
    showToast,
  ]);

  const handleLogout = useCallback(() => {
    dispatch(logoutUser());
    dispatch(clearEmpData());
    clearInterval(locationInterval);
    navigate("/");
  }, [dispatch, navigate, locationInterval]);

  const handleToggleStatus = async () => {
    const newStatus = true;
    setLoading(true);
    if (newStatus) {
      modals.locationModal.onOpen();
    } else {
      await dispatch(updateEmployeeOnlineStatus({ is_online: false }));
      showToast("You are now offline", "info");
      setOnlineStatus(false);
    }
    setLoading(false);
  };

  const handleLocationPermission = () => {
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        handleCameraCapture();
        modals.livePhotoModal.onOpen();
        // setIsCameraPreviewModalOpen(true);
      },
      () => {
        showToast("Please enable location access to proceed.", "error");
        setLoading(false);
      }
    );
    // setIsLocationModalOpen(false);
    modals.locationModal.onOpen();
    setLocationLoading(false);
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
    } catch {
      showToast("Please enable camera access to proceed.", "error");
      setLoading(false);
    }
  };

  const handleTakePhoto = () => {
    setImageLoading(true);
    capturePhoto(setCapturedPhoto);
  };

  const handleConfirmPhoto = async () => {
    modals.livePhotoModal.onClose();
    if (empData?.role === employeesRoles.DELIVERY_BOY) {
      handleCameraCapture();
      modals.odometerModal.onOpen();
    } else {
      setCapturedPhoto(null);
      await updateOnlineStatus();
    }
  };
  // Discarding Live Photo
  const handleDiscardLivePhoto = () => {
    setCapturedPhoto(null);
    setCameraStream(null);
    modals.livePhotoModal.onClose();
    // Reset online status toggle attempt
    setOnlineStatus(false);
  };

  const handleOdometerCapture = () => {
    capturePhoto(setCapturedOdometerPhoto);
  };

  // Discarding Odometer
  const handleDiscardOdometer = () => {
    setCapturedPhoto(null);
    setCapturedOdometerPhoto(null);
    setOdometerReading("");
    setCameraStream(null);
    modals.odometerModal.onClose();
    // Reset online status toggle attempt
    setOnlineStatus(false);
  };

  const handleOdometerSubmission = useCallback(async () => {
    const formData = new FormData();
    formData.append("odometer_reading", odometerReading);
    formData.append("odometer_photo", capturedOdometerPhoto, "odometer.jpg");

    try {
      const res = await dispatch(updateOdometerReading(formData));
      if (res.error)
        throw new Error(res.error.message || "Something went wrong");
      showToast(
        "Your odometer reading has been successfully submitted.",
        "success"
      );
      await updateOnlineStatus();
      modals.odometerModal.onClose();
      setOdometerReading("");
      setCapturedOdometerPhoto(null);
    } catch {
      showToast("Failed to submit odometer data", "error");
    }
  }, [
    odometerReading,
    capturedOdometerPhoto,
    dispatch,
    showToast,
    updateOnlineStatus,
    modals.odometerModal,
  ]);

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
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 1000;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const sendLocation = (loc) => {
    dispatch(setCurrentLocation(loc));
    socket.emit("sendLocation", {
      delEmpName: empData?.name,
      delEmpId: empData?._id,
      adminId: empData?.created_by,
      location: loc,
    });
  };

  const capturePhoto = (setPhoto) => {
    const track = cameraStream.getVideoTracks()[0];
    const canvas = document.createElement("canvas");
    canvas.width = cameraPreview.videoWidth;
    canvas.height = cameraPreview.videoHeight;
    canvas
      .getContext("2d")
      .drawImage(cameraPreview, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      setPhoto(blob);
      setCameraStream(null);
      track.stop();
      setImageLoading(false);
    }, "image/jpeg");
  };

  const handleRetake = (setRetake) => {
    setRetake(null);
    handleCameraCapture();
  };

  const sendLiveLocation = useCallback(() => {
    let intervalId = null;
    const updateLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
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
          const messages = {
            1: "Please enable location access to send live location.",
            2: "Location currently unavailable, will retry later.",
            3: "Unable to fetch location in time.",
          };
          showToast(
            messages[err.code] || "Failed to get location data",
            "error"
          );
          if (intervalId) clearInterval(intervalId);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    };

    navigator.permissions.query({ name: "geolocation" }).then((result) => {
      if (result.state === "granted" || result.state === "prompt") {
        updateLocation();
      } else {
        showToast(
          "Location access is blocked. Please enable it in settings.",
          "error"
        );
      }
    });

    if (!locationInterval) {
      intervalId = setInterval(updateLocation, 10000);
      setLocationInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [
    locationInterval,
    location,
    empData?.lastLocation?.lat,
    empData?.lastLocation?.lng,
    sendLocation,
    showToast,
  ]);

  useEffect(() => {
    if (error) {
      showToast(error, "error");
      dispatch(clearError());
    }
  }, [dispatch, error, showToast]);

  useEffect(() => {
    if (cameraPreview && cameraStream) {
      cameraPreview.srcObject = cameraStream;
    }
  }, [cameraStream, cameraPreview]);

  useEffect(() => {
    if (empData?.is_online) setOnlineStatus(true);
  }, [empData]);

  useEffect(() => {
    if (onlineStatus && empData?.role === employeesRoles.DELIVERY_BOY) {
      sendLiveLocation();
    } else {
      clearInterval(locationInterval);
    }
    return () => clearInterval(locationInterval);
  }, [empData?.role, locationInterval, onlineStatus, sendLiveLocation]);

  return {
    modals,
    empData,
    onlineStatus,
    isLoading,
    locationLoading,
    capturedPhoto,
    imageLoading,
    cameraPreview,
    odometerReading,
    capturedOdometerPhoto,
    setCameraPreview,
    setCapturedPhoto,
    setOdometerReading,
    setCapturedOdometerPhoto,
    handleLogout,
    handleRetake,
    handleToggleStatus,
    handleLocationPermission,
    handleCameraCapture,
    handleDiscardLivePhoto,
    handleConfirmPhoto,
    handleTakePhoto,
    handleOdometerCapture,
    handleDiscardOdometer,
    handleOdometerSubmission,
  };
};
