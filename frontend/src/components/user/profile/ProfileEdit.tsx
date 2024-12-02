import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authSuccess, editProfileThunk, setError } from "@/features/authSlice";
import { useFormik } from "formik";
import { useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";

const ProfileEdit = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const { user } = useAppSelector((state) => state.auth);

  if (!user) {
    return <>userNotfound</>;
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: user?.email || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
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
      phone: Yup.string()
        .required("Mobile number is required")
        .matches(
          /^[6-9]\d{9}$/,
          "Mobile number must be 10 digits and start with 6, 7, 8, or 9"
        ),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      const { firstName, lastName, email, phone } = values;
      try {
        const result: any = dispatch(
          editProfileThunk({ firstName, lastName, email, phone })
        ).unwrap();

        await toast.promise(result, {
          loading: "Editing user data...",
          success: (data: any) => {
            const updatedUser = data.user;
            dispatch(authSuccess({ user: updatedUser }));
            console.log("user state ", user);
            return data.message || "Profile updated successfully";
          },
          error: (err) => {
            return err?.response?.data?.message || "User edit failed";
          },
        });
      } catch (err: any) {
        //dispatch(setError(err?.message))
        console.error("User Edit failed:", err);
      } finally {
        setLoading(false);
      }
    },
  });
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6 md:grid-cols-1">
        <Card className="w-full flex flex-col items-center">
          <CardHeader className="text-center">
            <div className="text-xl">Edit Profile</div>
          </CardHeader>
          <form onSubmit={formik.handleSubmit} className="w-full">
          <CardContent className="min-w-full place-items-center">
            <div className="flex flex-col gap-5 md:w-1/2 w-full items-stretch">
                <div>
                  <Input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="First name"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`${
                      formik.touched.firstName &&
                      formik.errors.firstName &&
                      "border-red-500"
                    } py-6 w-full`}
                  />
                  {formik.touched.firstName && formik.errors.firstName && (
                    <span className="text-xs text-red-500">
                      {formik.errors.firstName}{" "}
                    </span>
                  )}
                </div>
                <div>
                  <Input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Last name"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`${
                      formik.touched.lastName &&
                      formik.errors.lastName &&
                      "border-red-500"
                    } py-6 w-full`}
                  />
                  {formik.touched.lastName && formik.errors.lastName && (
                    <span className="text-xs text-red-500">
                      {formik.errors.lastName}
                    </span>
                  )}
                </div>

                <div>
                  <Input
                    type="text"
                    id="email"
                    name="email"
                    placeholder="Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`${
                      formik.touched.email &&
                      formik.errors.email &&
                      "border-red-500"
                    } py-6 w-full`}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <span className="text-xs text-red-500">
                      {formik.errors.email}
                    </span>
                  )}
                </div>

                <div>
                  <Input
                    type="text"
                    id="phone"
                    name="phone"
                    placeholder="phone"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`${
                      formik.touched.phone &&
                      formik.errors.phone &&
                      "border-red-500"
                    } py-6 w-full`}
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <span className="text-xs text-red-500">
                      {formik.errors.phone}
                    </span>
                  )}
                </div>

                <div className="flex justify-center gap-2 pt-5 ">
                  <AlertDialog>
                    <AlertDialogTrigger
                      className={`${
                        !formik.isValid || !formik.dirty
                          ? "bg-blue-300"
                          : "bg-blue-500"
                      }   text-white p-2 font-semibold rounded-lg py-2`}
                      disabled={!formik.isValid || !formik.dirty}
                    >
                      Edit profile
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will change your
                          profile details permanently.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-full">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-blue-600 rounded-full"
                          type="button"
                          onClick={() => formik.submitForm()}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
            </div>
          </CardContent>
              </form>
        </Card>
      </div>
    </div>
  );
};

export default ProfileEdit;
