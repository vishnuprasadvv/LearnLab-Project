import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { EyeClosed, EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createUser } from "@/api/adminApi";
import { formikPasswordValidation } from "@/utils/formikPasswordValidator";

function AddUser() {
  const [role, setRole] = useState("student");
  const [userStatus, setUserStatus] = useState<string>("active");
  const navigate = useNavigate();

  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible((prev) => !prev);
  };

  const handleUserStatusChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUserStatus(event.target.value);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      confirmPassword: "",
      phone: "",
      role: "",
      userStatus: "",
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
    onSubmit: async (values) => {
      const { firstName, lastName, email, phone, password } = values;
      try {
        const result = createUser(
          firstName,
          lastName,
          email,
          phone,
          password,
          role,
          userStatus
        );
        await toast.promise(result, {
          loading: "Creating user Account...",
          success: " User created",
          error: (err) => {
            return err?.response?.data?.message || "User creation failed";
          },
        });
      } catch (err: any) {
        console.error("User creation failed:", err);
      }
    },
  });

  const handleBack = () => {
    navigate("/admin/users"); // Navigate back to the previous page
  };
  return (
    <div className="md:w-1/2 sm:w-1/2  items-center mx-auto border rounded-md p-6 mt-10">
      <h1 className="text-2xl font-bold text-blue-600 text-center p-4 ">
        Add new user
      </h1>
      <Toaster />
      <form onSubmit={formik.handleSubmit}>
        <div className="flex flex-col gap-3 mt-5">
          <div>
            <Input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="First name"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              className="w-full"
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "5px",
                border:
                  formik.touched.firstName && formik.errors.firstName
                    ? "1px solid red"
                    : "1px solid #ccc",
              }}
            />
            {formik.touched.firstName && formik.errors.firstName ? (
              <div style={{ color: "red", fontSize: "12px" }}>
                {formik.errors.firstName}
              </div>
            ) : null}
          </div>
          <div>
            <Input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Last name"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              className="w-full"
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "5px",
                border:
                  formik.touched.lastName && formik.errors.lastName
                    ? "1px solid red"
                    : "1px solid #ccc",
              }}
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
              onChange={formik.handleChange}
              className="w-full"
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "5px",
                border:
                  formik.touched.email && formik.errors.email
                    ? "1px solid red"
                    : "1px solid #ccc",
              }}
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
              onChange={formik.handleChange}
              className="w-full"
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "5px",
                border:
                  formik.touched.phone && formik.errors.phone
                    ? "1px solid red"
                    : "1px solid #ccc",
              }}
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
                onChange={formik.handleChange}
                className="w-full"
                style={{
                  width: "100%",
                  padding: "8px",
                  marginBottom: "5px",
                  border:
                    formik.touched.password && formik.errors.password
                      ? "1px solid red"
                      : "1px solid #ccc",
                }}
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
                onChange={formik.handleChange}
                className="w-full"
                style={{
                  width: "100%",
                  padding: "8px",
                  marginBottom: "5px",
                  border:
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                      ? "1px solid red"
                      : "1px solid #ccc",
                }}
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

            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <div style={{ color: "red", fontSize: "12px" }}>
                {formik.errors.confirmPassword}
              </div>
            ) : null}
          </div>

          <span className="pt-5 font-bold">Select user role</span>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">{role}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Select user role</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={role} onValueChange={setRole}>
                  <DropdownMenuRadioItem value="student">
                    Student
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="instructor">
                    Instructor
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="admin">
                    Admin
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <span className="pt-5 font-bold">User Status</span>
          <div className="pl-4">
            <label>
              <input
                type="radio"
                name="option"
                value="active"
                checked={userStatus === "active"}
                onChange={handleUserStatusChange}
              />
              Active
            </label>
          </div>
          <div className="pl-4">
            <label htmlFor="">
              <input
                type="radio"
                name="option"
                value="inactive"
                checked={userStatus === "inactive"}
                onChange={handleUserStatusChange}
              />
              Inactive
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-5 ">
          <Button
            className="border border-slate-200 bg-white text-blue-600 rounded-full  hover:bg-slate-100"
            type="button"
            onClick={handleBack}
          >
            Cancel
          </Button>
          <Button
            className="bg-blue-600 rounded-full  hover:bg-blue-700"
            type="submit"
          >
            Create
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AddUser;
