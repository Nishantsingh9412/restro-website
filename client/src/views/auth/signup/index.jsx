import { NavLink } from "react-router-dom";
import { authTypes } from "../../../utils/constant";
import authImage from "../../../assets/img/auth/auth-image.png";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useAuthActions } from "../../../hooks/useAuthActions";
import { Input } from "../../../components/common/InputField";
import PrimaryActionButton from "../../../components/UI/PrimaryActionButton";

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
    <div className="min-h-screen flex items-center justify-center px-4 py-8 mx-auto max-w-5xl gap-10">
      {/* Form section */}
      <div className="w-full md:w-1/2 p-8 space-y-8 flex flex-col justify-center !border !border-primary rounded-xl bg-white shadow-lg">
        <div>
          <h2 className="text-center !text-2xl !font-bold text-primary mb-2">
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
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          encType="multipart/form-data"
          className="space-y-5"
        >
          <Input
            {...register("name")}
            type="text"
            label="Name"
            required
            placeholder="Your Name"
            className="w-full"
          />
          {errors.name && (
            <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>
          )}
          <Input
            {...register("email")}
            type="email"
            label="Email"
            required
            placeholder="mail@example.com"
            className="w-full"
          />
          {errors.email && (
            <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>
          )}
          <div className="relative">
            <Input
              {...register("password")}
              type={show ? "text" : "password"}
              label="Password"
              required
              placeholder="Enter password"
              className="w-full"
            />
            <button
              type="button"
              onClick={toggleShow}
              className="absolute inset-y-0 right-0 !pr-3 flex items-center !text-gray-500 text-xs cursor-pointer"
              tabIndex={-1}
            >
              {show ? <IoEyeOff /> : <IoEye />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-600 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
          <Input
            {...register("confirmPassword")}
            type="password"
            label="Confirm Password"
            required
            placeholder="Confirm your password"
            className="w-full"
          />
          {errors.confirmPassword && (
            <p className="text-red-600 text-xs mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
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
          <div className="flex justify-end">
            <NavLink
              to="/auth/forgot-password"
              className="text-xs text-primary hover:underline"
            >
              Forgot password?
            </NavLink>
          </div>
          <PrimaryActionButton
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 rounded-lg shadow-sm text-sm font-semibold transition-all duration-150"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </PrimaryActionButton>
        </form>
        <div className="mt-6 text-sm text-gray-600 text-center">
          Already have an account?{" "}
          <NavLink to="/" className="text-primary font-medium hover:underline">
            Sign In
          </NavLink>
        </div>
      </div>
      {/* Side image for large screens */}
      <div className="hidden md:block md:w-1/2 relative">
        <img
          src={authImage}
          alt="Sign Up Visual"
          className="object-cover w-full h-full opacity-90"
          loading="lazy"
        />
      </div>
    </div>
  );
}
