import { useAppDispatch, useAppSelector } from "../../app/hooks";

import {
  startLoading,
  setError,
  endLoading,
  clearError,
} from "../../features/authSlice";
import { register } from "../../features/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import "react-google-signin-button/dist/button.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { EyeClosed, EyeIcon } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import { formikPasswordValidation } from "@/utils/formikPasswordValidator";

const Signup = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, isAuthenticated } = useAppSelector((state) => state.auth);

  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  useEffect(() => {
    dispatch(clearError());

    if (isAuthenticated) {
      navigate("/");
    }
  }, []);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible((prev) => !prev);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      confirmPassword: "",
      phone: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .min(3, "Name must be atleast 3 characters")
        .required("First name is required"),
      lastName: Yup.string()
        .min(3, "Name must be atleast 3 characters")
        .required("Last name is required"),
      email: Yup.string()
        .email("Invalid email adress")
        .required("Email is required"),
      password: formikPasswordValidation(),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Password miss match")
        .required("Confirm password is required"),
      phone: Yup.string()
        .required("Mobile number is required")
        .matches(
          /^[6-9]\d{9}$/,
          "Mobile number must be 10 digits and start with 6, 7, 8, or 9"
        ),
    }),
    validateOnChange: true,
    onSubmit: async (values) => {
      dispatch(startLoading());
      try {
        const result = dispatch(
          register({
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            password: values.password,
            phone: values.phone,
          })
        ).unwrap();

        await toast.promise(result, {
          loading: "Creating user Account...",
          success: (data) => {
            return data.message || " User account created";
          },
          error: (err) => {
            return err?.message || "Signup failed";
          },
        });
        const response = await result;
        sessionStorage.setItem("userEmail", response.user.email);
        navigate("/verify-account");
      } catch (err: any) {
        dispatch(setError(err?.message));
        if (err.message === "Please verify your account") {
          toast.error(err.message);
          navigate("/verify-account");
        }
        toast.error(err?.message || "Signup failed");
        console.error("Signup failed:", err);
      } finally {
        dispatch(endLoading());
      }
    },
  });

  return (
    <div className=" min-h-[90vh]">
      <div className="md:w-1/3 lg:w-1/4 sm:w-1/2 items-center mx-auto border rounded-md p-6 mt-10 dark:bg-slate-800">
        <h1 className="text-2xl font-bold text-blue-600 text-center p-4 ">
          Sign Up
        </h1>
        <form onSubmit={formik.handleSubmit}>
          <div className="flex flex-col gap-2 mt-5">
            <div>
              <Input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="First name"
                value={formik.values.firstName}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                className={`w-full dark:bg-slate-700 p-2 mb-1 border ${formik.touched.firstName && formik.errors.firstName ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`}
              />
              {formik.touched.firstName && formik.errors.firstName && (
                <div style={{ color: "red", fontSize: "12px" }}>
                  {formik.errors.firstName}
                </div>
              )}
            </div>
            <div>
              <Input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Last name"
                value={formik.values.lastName}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                className={`w-full dark:bg-slate-700 p-2 mb-1 border ${formik.touched.lastName && formik.errors.lastName ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`}
              />
              {formik.touched.lastName && formik.errors.lastName ? (
                <div style={{ color: "red", fontSize: "12px" }}>
                  {formik.errors.lastName}
                </div>
              ) : null}
            </div>

            <div>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                value={formik.values.email}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                className={`w-full dark:bg-slate-700 p-2 mb-1 border ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`}
              />
              {formik.touched.email && formik.errors.email ? (
                <div style={{ color: "red", fontSize: "12px" }}>
                  {formik.errors.email}
                </div>
              ) : null}
            </div>

            <div>
              <Input
                type="text"
                id="phone"
                name="phone"
                placeholder="phone"
                value={formik.values.phone}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                className={`w-full dark:bg-slate-700 p-2 mb-1 border ${formik.touched.phone && formik.errors.phone ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`}
              />
              {formik.touched.phone && formik.errors.phone ? (
                <div style={{ color: "red", fontSize: "12px" }}>
                  {formik.errors.phone}
                </div>
              ) : null}
            </div>
            <div>
              <div className="flex">
                <Input
                  type={isPasswordVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="password"
                  value={formik.values.password}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  className={`w-full dark:bg-slate-700 p-2 mb-1 border ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  style={{
                    position: "relative",
                    marginLeft: "-30px",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                  }}
                >
                  {isPasswordVisible ? (
                    <EyeIcon className="size-4 text-gray-400" />
                  ) : (
                    <EyeClosed className="size-4 text-gray-400" />
                  )}
                </button>
              </div>

              {formik.touched.password && formik.errors.password ? (
                <div style={{ color: "red", fontSize: "12px" }}>
                  {formik.errors.password}
                </div>
              ) : null}
            </div>
            <div>
              <div className="flex">
                <Input
                  type={isConfirmPasswordVisible ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formik.values.confirmPassword}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  className={`w-full dark:bg-slate-700 p-2 mb-1 border ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`}
                />

                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  style={{
                    position: "relative",
                    marginLeft: "-30px",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                  }}
                >
                  {isConfirmPasswordVisible ? (
                    <EyeIcon className="size-4 text-gray-400" />
                  ) : (
                    <EyeClosed className="size-4 text-gray-400" />
                  )}
                </button>
              </div>

              {formik.touched.confirmPassword &&
              formik.errors.confirmPassword ? (
                <div style={{ color: "red", fontSize: "12px" }}>
                  {formik.errors.confirmPassword}
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex justify-center pt-5">
            <Button
              className="bg-blue-600 dark:text-white dark:bg-blue-700 dark:hover:bg-blue-600 rounded-full w-full hover:bg-blue-700"
              type="submit"
              disabled={loading}
            >
              Signup
            </Button>
          </div>
        </form>
        <div className="flex justify-center pt-5">
          <span>Or you can </span>
        </div>
        <div className="flex justify-center pt-5">
          <GoogleLoginButton />
        </div>
        <div className="flex justify-center pt-5">
          <span>Already have an account? </span>
          <Link to={"/login"} className="pl-2 font-bold text-blue-600">
            <span>Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
