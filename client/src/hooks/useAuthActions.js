// hooks/useAuthForm.js
import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useToast } from "../contexts/useToast";
import { authTypes } from "../utils/constant";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginAdmin,
  loginEmployee,
  signUpAdmin,
} from "../redux/action/authSlice";

// ------------------------ SCHEMAS ------------------------
const adminLoginSchema = z.object({
  email: z.string().nonempty("Email is required").email("Invalid email"),
  password: z.string().nonempty("Password is required"),
});

const employeeLoginSchema = z.object({
  country_code: z.string().nonempty("Country code is required"),
  phone: z.string().nonempty("Phone is required"),
  memberId: z.string().nonempty("Member ID is required"),
});

const signUpSchema = z
  .object({
    name: z.string().min(3, "Name too short").max(20, "Name too long"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Too short").max(20, "Too long"),
    confirmPassword: z.string(),
    profilePicture: z.any().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ------------------------ HOOK ------------------------
export const useAuthActions = ({ type = authTypes.LOG_IN }) => {
  const showToast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toggleShow = () => setShow(!show);

  // Schema and default values
  const schemaMap = {
    [authTypes.LOG_IN]: adminLoginSchema,
    [authTypes.LOG_IN_EMP]: employeeLoginSchema,
    [authTypes.SIGN_UP]: signUpSchema,
  };

  const defaultValuesMap = {
    [authTypes.LOG_IN]: { email: "", password: "" },
    [authTypes.LOG_IN_EMP]: { country_code: "", phone: "", memberId: "" },
    [authTypes.SIGN_UP]: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      profilePicture: undefined,
    },
  };

  const form = useForm({
    resolver: zodResolver(schemaMap[type]),
    defaultValues: defaultValuesMap[type],
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = form;

  const handleRouteByRole = (role) => {
    const route = role?.split(" ")[0]?.toLowerCase();
    navigate(`/employee/${route}/dashboard`);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      let res;

      if (type === authTypes.LOG_IN) {
        res = await dispatch(
          loginAdmin({ email: data.email, password: data.password })
        );
        // if (res.payload?.success) navigate("/admin/dashboard/default");
        if (res.payload?.success) navigate("/landing-page");
      } else if (type === authTypes.LOG_IN_EMP) {
        res = await dispatch(
          loginEmployee({
            phone: data.phone,
            country_code: data.country_code,
            membership_id: data.memberId,
          })
        );
        if (res.payload?.success) handleRouteByRole(res.payload.result.role);
      } else if (type === authTypes.SIGN_UP) {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("password", data.password);
        if (data.profilePicture instanceof File) {
          formData.append("profile_picture", data.profilePicture);
        }
        res = await dispatch(signUpAdmin(formData));
        if (res.payload?.success) navigate("/admin/dashboard/default");
      }

      if (!res?.payload?.success) showToast(res.payload, "error");
    } catch (err) {
      console.error("Auth error", err);
    } finally {
      setLoading(false);
    }
  };

  const autoFillForm = () => {
    const uniqueNumber = Math.floor(Math.random() * 1000);
    if (type === authTypes.SIGN_UP) {
      setValue("name", `John Doe ${uniqueNumber}`);
      setValue("email", `johndoe${uniqueNumber}@example.com`);
      setValue("password", "111111");
      setValue("confirmPassword", "111111");
    } else if (type === authTypes.LOG_IN) {
      setValue("email", "admin@example.com");
      setValue("password", "111111");
    }
  };

  return {
    show,
    toggleShow,
    loading,
    register,
    errors,
    handleSubmit,
    onSubmit,
    autoFillForm,
    form,
    setValue,
  };
};
