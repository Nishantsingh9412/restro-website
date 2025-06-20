// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { authTypes, userTypes } from "../../../utils/constant";
import { useAuthActions } from "../../../hooks/useAuthActions";
import { Link } from "react-router-dom";

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
      form.setValue("country_code", "91");
      form.setValue("phone", "1234567892");
      form.setValue("memberId", "DxB3SYiOIW");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-bg px-4 py-8">
      {/* <ToastContainer /> */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-primary mb-2">
            Sign In
          </h2>
          <div className="flex justify-center gap-4 mt-4">
            <button
              className={`px-6 py-2 rounded-lg font-semibold border-2 transition-all duration-150 ${
                isAdmin
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-primary border-primary hover:bg-primary-accent hover:text-white"
              }`}
              onClick={() => setAuthTypes(userTypes.ADMIN)}
              type="button"
            >
              Admin
            </button>
            <button
              className={`px-6 py-2 rounded-lg font-semibold border-2 transition-all duration-150 ${
                !isAdmin
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-green-600 border-green-600 hover:bg-green-100"
              }`}
              onClick={() => setAuthTypes(authTypes.LOG_IN_EMP)}
              type="button"
            >
              Employee
            </button>
          </div>
        </div>

        <form
          className="space-y-6"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          {isAdmin ? (
            <>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  {...register("email")}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
                  placeholder="mail@example.com"
                  autoComplete="username"
                />
                {errors.email && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={show ? "text" : "password"}
                    {...register("password")}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={toggleShow}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 text-xs"
                    tabIndex={-1}
                  >
                    {show ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

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
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  {...register("phone")}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-600 focus:border-green-600"
                  placeholder="Phone number"
                  autoComplete="tel"
                />
                {errors.phone && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="memberId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Member ID
                </label>
                <input
                  id="memberId"
                  name="memberId"
                  type="text"
                  {...register("memberId")}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-600 focus:border-green-600"
                  placeholder="DxB3SYiOIW"
                  autoComplete="off"
                />
                {errors.memberId && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.memberId.message}
                  </p>
                )}
              </div>
            </>
          )}

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 rounded-lg shadow-sm text-sm font-semibold transition-all duration-150 ${
                isAdmin
                  ? "bg-primary hover:bg-primary-accent text-white"
                  : "bg-green-600 hover:bg-green-700 text-white"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
            <button
              type="button"
              onClick={handleTestClick}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100"
            >
              Test Application
            </button>
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
    </div>
  );
}
