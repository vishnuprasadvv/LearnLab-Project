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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  authSuccess,
  changeProfileImageThunk,
  editProfileThunk,
  getUserDataThunk,
  sendOtp,
} from "@/features/authSlice";
import { User } from "@/types/userTypes";
import { useFormik } from "formik";
import { PencilIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import EmailOtpVerification from "./EmailOtpVerification";
import LoadingScreen from "@/components/common/Loading/LoadingScreen";

const ProfileEdit = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [profileData, setProfileData] = useState<User | null>(null);
  const [error, setError] = useState("");
  const { user } = useAppSelector((state) => state.auth);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [originalEmail, setOriginalEmail] = useState("");
  const [otpPopUp, setOtpPopUpVisible] = useState(false);

  if (!user) {
    return <>userNotfound</>;
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await dispatch(getUserDataThunk(user._id)).unwrap();
        setProfileData(response.user);
        setOriginalEmail(response.user.email);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        toast.error("failed to fetch profile");
      }
    };

    fetchProfile();
  }, [user, isUploading]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: profileData?.email || "",
      firstName: profileData?.firstName || "",
      lastName: profileData?.lastName || "",
      phone: profileData?.phone || "",
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
            return data.message || "Profile updated successfully";
          },
          error: (err) => {
            return err?.message || "User edit failed";
          },
        });

        if (email !== originalEmail) {
          setOtpPopUpVisible(true);
          localStorage.setItem("userEmail", email);
          try {
           const sendOtpresponse =  dispatch(sendOtp({email}))
           await toast.promise(sendOtpresponse, {
            loading: 'Sending OTP...',
            success: 'OTP sent successfully, Check you email.',
            error:'Failed to send otp'
           })
          } catch (error) {
            console.error('otp send',error)
          }
        }
        
      } catch (err: any) {
        //dispatch(setError(err?.message))
        console.error("User Edit failed:", err);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      // Generate a preview URL for the selected file
      const previewURL = URL.createObjectURL(file);
      setPreviewImage(previewURL);
      //open dialog after selecting image
      setIsDialogOpen(true);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      console.error("File input reference is null!");
    }
  };

  const handleChangeProfileImage = async () => {
    try {
      if (!profileImage) {
        setError("Please select an image to upload");
        toast.error(error);
        return;
      }
      //set uploading
      setIsUploading(true);

      const formData = new FormData();
      formData.append("profileImage", profileImage);

      const response = dispatch(
        changeProfileImageThunk({ userId: user._id, formData })
      ).unwrap();

      await toast.promise(response, {
        loading: "Uploading profile image...",
        success: (data: any) => {
          return data.message || "Profile image changed successfully";
        },
        error: (err) => {
          return err?.message || "Profile image update failed";
        },
      });
      setIsDialogOpen(false);
      setIsUploading(false);
      setProfileImage(null);
    } catch (error) {
      toast.error('Failed to change profile image')
    } finally {
      setIsUploading(false);
    }
  };


  return (
    <div className="container mx-auto px-4 py-8">
      {
        loading ? (
          <LoadingScreen />
        ) : (
          <div className="grid gap-6 md:grid-cols-1">
          {otpPopUp ? (
            <EmailOtpVerification  setPopUp={setOtpPopUpVisible}/>
          ) : (
            <Card className="w-full flex flex-col items-center">
              <CardHeader className="text-center">
                <div className="text-xl">Edit Profile</div>
              </CardHeader>
              <div className="text-center rounded-full bg-slate-200 w-20 h-20 relative">
                <Avatar className="relative overflow-hidden mx-auto w-full h-full bg-slate-300 rounded-full">
                  {isUploading && (
                    <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center rounded-full">
                      <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  <AvatarImage
                    src={
                      profileData?.profileImageUrl ||
                      "https://avatar.iran.liara.run/public/36"
                    }
                  />
                  <AvatarFallback>
                    <img
                      src="https://avatar.iran.liara.run/public/36"
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </AvatarFallback>
                </Avatar>
                <div
                  className="absolute bottom-0 right-0  bg-blue-500 rounded-full w-6 h-6 text-white flex items-center justify-center justify-self-end
               hover:bg-blue-600 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <PencilIcon className="h-4 w-4" onClick={triggerFileInput} />
                </div>
              </div>
  
              <div className="flex justify-center gap-2 pt-5 ">
                <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <AlertDialogContent>
                    <AlertDialogHeader className="items-center">
                      <div className="flex justify-center items-center w-20 h-20">
                        <img
                          src={
                            previewImage ||
                            "https://avatar.iran.liara.run/public/36"
                          }
                          alt="Avatar"
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <AlertDialogTitle>Preview of image</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will change your profile image. Are you sure?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-full">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-blue-600 rounded-full"
                        type="button"
                        onClick={handleChangeProfileImage}
                      >
                        Yes
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
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
                              : "bg-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600"
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
          )}
        </div>
        )
      }
      
    </div>
  );
};

export default ProfileEdit;
