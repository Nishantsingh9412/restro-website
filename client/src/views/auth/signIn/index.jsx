import { useState } from "react";
import { authTypes} from "../../../utils/constant";
import { useAuthActions } from "../../../hooks/useAuthActions";
import { Link } from "react-router-dom";
import { Input } from "../../../components/common/InputField";
import PrimaryActionButton from "../../../components/UI/PrimaryActionButton";
import authImage from "../../../assets/img/auth/auth-image.png";
import { IoEye, IoEyeOff } from "react-icons/io5";

export default function SignInPage() {
  const [authType, setAuthTypes] = useState(authTypes.LOG_IN);
  const isAdmin = authType === authTypes.LOG_IN;
  const {
    register,
    handleSubmit,
    errors,
    onSubmit,
    loading,
    show,
    toggleShow,
    form,
  } = useAuthActions({ type: authType });

  const handleTestClick = () => {
    if (authType === authTypes.LOG_IN) {
      form.setValue("email", "nizx@gmail.com");
      form.setValue("password", "123456");
    } else {
      form.setValue("country_code", "49");
      form.setValue("phone", "1234567892");
      form.setValue("memberId", "DxB3SYiOIW");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  px-4 py-8 mx-auto max-w-5xl gap-10">
      {/* <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg flex flex-col md:flex-row overflow-hidden gap-10 "> */}
      {/* Form section */}
      <div className="w-full md:w-1/2 p-8 space-y-8 flex flex-col justify-center !border !border-primary rounded-xl ">
        <div>
          <h2 className="text-center !text-2xl !font-bold text-primary mb-2">
            Sign In
          </h2>
          {/* Tab selector for Admin/Employee */}
          <div className="flex justify-center gap-0 mt-4 border-b border-gray-200">
            <div
              className={`px-8 py-2 cursor-pointer font-semibold text-base transition relative
                ${isAdmin ? "text-primary" : "text-gray-500"}
              `}
              onClick={() => setAuthTypes(authTypes.LOG_IN)}
            >
              Admin
              <span
                className={`absolute left-0 right-0 -bottom-[1px] h-[3px] rounded-t bg-primary transition-all duration-300
                  ${isAdmin ? "opacity-100" : "opacity-0"}`}
              />
            </div>
            <div
              className={`px-8 py-2 cursor-pointer font-semibold text-base transition relative
                ${!isAdmin ? "text-green-600" : "text-gray-500"}
              `}
              onClick={() => setAuthTypes(authTypes.LOG_IN_EMP)}
            >
              Employee
              <span
                className={`absolute left-0 right-0 -bottom-[1px] h-[3px] rounded-t bg-green-600 transition-all duration-300
                  ${!isAdmin ? "opacity-100" : "opacity-0"}`}
              />
            </div>
          </div>
        </div>
        {/* Greet Message For User */}
        <div className="mb-5">
          <h2 className="!text-xl !font-semibold text-gray-800">
            Welcome to türgastro! 👋🏻
          </h2>
          <p className="text-gray-500 text-xs">
            Please sign-in to your account and start the adventure
          </p>
        </div>

        <form
          className="space-y-5"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          {isAdmin ? (
            <>
              <Input
                id="email"
                name="email"
                type="email"
                {...register("email")}
                label="Email"
                required
                autoComplete="username"
              />
              {errors.email && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}

              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={show ? "text" : "password"}
                  {...register("password")}
                  className="w-full"
                  label="Password"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={toggleShow}
                  className="absolute inset-y-0 right-0 !pr-3 flex items-center !text-gray-500 text-xs  cursor-pointer"
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

              <div className="flex justify-end text-xs">
                <Link
                  to="/auth/forgot-password"
                  className="text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </>
          ) : (
            <>
              <Input
                id="phone"
                name="phone"
                type="tel"
                {...register("phone")}
                className="w-full"
                placeholder="Phone number"
                autoComplete="tel"
              />
              {errors.phone && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.phone.message}
                </p>
              )}

              <Input
                id="memberId"
                name="memberId"
                type="text"
                {...register("memberId")}
                className="w-full"
                placeholder="DxB3SYiOIW"
                autoComplete="off"
              />
              {errors.memberId && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.memberId.message}
                </p>
              )}
            </>
          )}

          <div className="flex flex-col gap-3">
            <PrimaryActionButton
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 rounded-lg shadow-sm text-sm font-semibold transition-all duration-150"
            >
              {loading ? "Signing In..." : "Sign In"}
            </PrimaryActionButton>
            <PrimaryActionButton
              type="button"
              onClick={handleTestClick}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100"
            >
              Test Application
            </PrimaryActionButton>
          </div>

          <p className="text-center text-sm text-gray-600 mt-2">
            Not registered yet?{" "}
            <Link
              to="/auth/sign-up"
              className="text-primary font-medium hover:underline"
            >
              Create an Account
            </Link>
          </p>
        </form>
      </div>
      {/* Side image for large screens */}
      <div className="hidden md:block md:w-1/2 relative">
        <img
          src={authImage}
          alt="Sign In Visual"
          className="object-cover w-full h-full opacity-90"
          loading="lazy"
        />
      </div>
      {/* </div> */}
    </div>
  );
}
