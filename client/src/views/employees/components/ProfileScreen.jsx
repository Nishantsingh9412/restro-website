// ProfilePage.jsx

import { FiArrowLeft, FiUser } from "react-icons/fi";
import { Input } from "../../../components/common/InputField.jsx";
import { useNavigate } from "react-router-dom";
import PrimaryActionButton from "../../../components/UI/PrimaryActionButton.jsx";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { Dialog_Boxes } from "../../../utils/constant.js";
import { useEffect, useState } from "react";
import {
  updateProfilePicAction,
  updateProfileDetailsAction,
} from "../../../redux/action/userSlice.js";

export default function ProfilePage() {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.userReducer.data);
  return (
    <div className="w-full h-screen bg-white flex flex-col p-8">
      <div className="flex gap-3 items-center my-5">
        <button
          className="rounded-full !p-5 !bg-gray-200 text-center"
          onClick={() => navigate(-1)}
        >
          <FiArrowLeft className="text-2xl" />
        </button>
        <div>
          <h2 className="!text-xl !font-semibold !text-gray-800">Profile</h2>
          <p className="!text-gray-500 !text-sm">
            Manage your account information
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Card */}
        <ProfileCard userData={userData} />

        {/* Right Card */}
        <ProfileForm userData={userData} />
      </div>
    </div>
  );
}

// ProfileCard.jsx

function ProfileCard({ userData }) {
  const [image, setImage] = useState(userData?.profile_picture || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const dispatch = useDispatch();
  return (
    <div className="bg-white !border !rounded-2xl shadow-sm p-6 w-full lg:w-1/3 ">
      <div className="flex items-center gap-2 md:gap-5 ">
        <div className="!w-28 !h-28 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 !text-2xl">
          {userData?.profile_picture ? (
            <img
              src={userData?.profile_picture || image}
              alt="profile-photo"
              aria-label="photo"
              id="image-preview"
              className="rounded-full object-cover !w-28 !h-28"
            />
          ) : (
            <span className="material-icons">
              <FiUser />
            </span>
          )}
        </div>
        <div className="">
          <h3 className="!mt-4 !font-bold text-gray-800 !text-2xl">
            {userData?.name ?? "User"}
          </h3>
          <p className="text-gray-500 text-lg">
            {userData?.role ?? "Employee"}
          </p>
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        {/* Change Photo: open file input for gallery/photo upload */}
        <form onSubmit={(e) => e.preventDefault()} className="flex-1">
          <label className="w-full">
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={async (e) => {
                setError("");
                setSuccess("");
                const file = e.target.files[0];
                if (!file) {
                  setError("No file selected.");
                  return;
                }
                if (!/^image\/(jpeg|jpg|png|webp)$/.test(file.type)) {
                  setError("Only JPG, PNG, or WEBP images allowed.");
                  return;
                }
                if (file.size > 5 * 1024 * 1024) {
                  setError("File size must be less than 5MB.");
                  return;
                }
                setUploading(true);
                try {
                  const formData = new FormData();
                  formData.append("profile_picture", file);
                  formData.append("role", userData?.role || "employee");
                  // Dispatch redux action
                  const resultAction = await dispatch(
                    updateProfilePicAction(formData)
                  );
                  if (resultAction?.error) {
                    setError(resultAction.error.message || "Upload failed.");
                  } else {
                    setSuccess("Photo updated!");
                    const url = URL.createObjectURL(file);
                    setImage(url);
                  }
                } catch (err) {
                  setError("Upload failed. Try again.", err.message);
                }
                setUploading(false);
              }}
            />
            <PrimaryActionButton
              className="rounded-md !border w-full"
              bgColor=""
              textColor="text-black"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.target
                  .closest("label")
                  .querySelector("input[type=file]")
                  .click();
              }}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Change Photo"}
            </PrimaryActionButton>
          </label>
        </form>
        <PrimaryActionButton
          className="rounded-md !border"
          bgColor=""
          textColor="text-black"
          onClick={() =>
            Dialog_Boxes.showCustomAlert(
              "Profile Photo",
              "Are you sure you want to remove your photo?",
              "center",
              () => {
                setImage(null);
                setSuccess("");
                setError("");
              }
            )
          }
          disabled={uploading}
        >
          Remove
        </PrimaryActionButton>
      </div>
      {(error || success) && (
        <p
          className={`mt-2 text-xs ${
            error ? "text-red-500" : "text-green-500"
          }`}
        >
          {error || success}
        </p>
      )}

      <p className="!mt-3 !mr-2 text-xs text-gray-400">
        Tip: Clear, centered headshot works best.
      </p>
    </div>
  );
}

ProfileCard.propTypes = {
  userData: PropTypes.any,
};

// ProfileForm.jsx
function ProfileForm({ userData }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    experience: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setFormData({
      name: userData?.name || "",
      phone: userData?.phone || "",
      email: userData?.email || "",
      experience: userData?.experience || "",
      bio: userData?.bio || "",
    });
  }, [userData]);

  // Validate fields
  const validate = () => {
    if (!formData.name.trim()) return "Full Name is required.";
    if (!formData.phone.trim() || !/^\+?[0-9\s-]{10,}$/.test(formData.phone))
      return "Valid phone is required.";
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email))
      return "Valid email is required.";
    if (
      formData.experience === "" ||
      isNaN(formData.experience) ||
      Number(formData.experience) < 0
    )
      return "Experience must be a non-negative number.";

    return null;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle submit
  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setLoading(true);
    try {
      const res = await dispatch(
        updateProfileDetailsAction({ formData, role: userData?.role })
      );
      if (res.error) {
        setError(res.error);
      } else setSuccess("Profile updated successfully!");
    } catch (e) {
      setError("Failed to update profile. Try again.", e.message);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white !border rounded-2xl shadow-sm p-6 w-full lg:w-2/3 flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-2  md:gap-x-4">
        <Input
          type="text"
          label="Full Name"
          className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring focus:ring-blue-200"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        <Input
          type="text"
          label="Phone"
          className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring focus:ring-blue-200"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <Input
          label="Email"
          type="email"
          className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring focus:ring-blue-200"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <Input
          type="number"
          className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring focus:ring-blue-200"
          name="experience"
          label="Experience (years)"
          value={formData.experience}
          onChange={handleChange}
          required
          min={0}
          step={0.1}
        />

        <div className="md:col-span-2">
          <label className="text-sm text-primary ml-3 mt-0">Bio</label>
          <textarea
            type="textarea"
            placeholder="Short bio, expertise, preferences..."
            className="w-full !-mt-1 !px-3 !py-2 !border rounded-lg text-sm focus:ring focus:ring-blue-200"
            name="bio"
            rows={4}
            value={formData.bio}
            onChange={handleChange}
          />
        </div>
      </div>

      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
      {success && <p className="text-xs text-green-500 mt-2">{success}</p>}

      <div className="flex justify-end gap-3 mt-6">
        <PrimaryActionButton
          className="rounded-md !border"
          bgColor=""
          textColor="text-black"
          onClick={() => {
            navigate("/employees/documents");
          }}
        >
          Documents
        </PrimaryActionButton>
        <PrimaryActionButton
          className="rounded-md"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </PrimaryActionButton>
      </div>
    </div>
  );
}

ProfileForm.propTypes = {
  userData: PropTypes.any,
};
