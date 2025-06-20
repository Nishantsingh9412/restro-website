import { NavLink } from "react-router-dom";
import { authTypes } from "../../../utils/constant";
import illustration from "../../../assets/img/auth/login-img.png";
import { RiEyeCloseLine } from "react-icons/ri";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { useAuthActions } from "../../../hooks/useAuthActions";

export default function SignUp() {
  const {
    show,
    errors,
    loading,
    register,
    onSubmit,
    toggleShow,
    handleSubmit,
    autoFillForm,
    setValue,
  } = useAuthActions({ type: authTypes.SIGN_UP });

  return (
    <div className="min-h-screen bg-primary-bg flex items-center justify-center px-2 py-8">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Illustration */}
        <div className="hidden md:flex items-center justify-center bg-primary-bg">
          <img
            src={illustration}
            alt="Sign up illustration"
            className="object-contain h-80"
          />
        </div>
        {/* Form */}
        <div className="p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-primary mb-2 text-center">
            Create Account
          </h2>
          <p className="text-gray-500 text-center mb-6">
            Join us and manage your restaurant efficiently!
          </p>
          <button
            type="button"
            onClick={autoFillForm}
            className="text-xs text-blue-500 underline mb-4 ml-auto"
          >
            Auto Fill Test Data
          </button>
          <form
            onSubmit={handleSubmit(onSubmit)}
            encType="multipart/form-data"
            className="space-y-4"
          >
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register("name")}
                type="text"
                placeholder="Your Name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="mail@example.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            {/* Password */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                {...register("password")}
                type={show ? "text" : "password"}
                placeholder="Enter password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span
                className="absolute right-3 top-9 cursor-pointer text-gray-500"
                onClick={toggleShow}
              >
                {show ? (
                  <RiEyeCloseLine size={20} />
                ) : (
                  <MdOutlineRemoveRedEye size={20} />
                )}
              </span>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                {...register("confirmPassword")}
                type="password"
                placeholder="Confirm your password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            {/* Profile Picture */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Picture
              </label>
              <input
                type="file"
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                onChange={(e) => setValue("profilePicture", e.target.files[0])}
              />
            </div>
            {/* Forgot password */}
            <div className="flex justify-end">
              <NavLink
                to="/auth/forgot-password"
                className="text-xs text-primary hover:underline"
              >
                Forgot password?
              </NavLink>
            </div>
            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary-accent transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>
          <div className="mt-6 text-sm text-gray-600 text-center">
            Already have an account?{" "}
            <NavLink
              to="/"
              className="text-primary font-medium hover:underline"
            >
              Sign In
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}
