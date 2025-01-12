
import { useAppDispatch } from "@/app/hooks";
import LoadingScreen from "@/components/common/Loading/LoadingScreen";
import PasswordFieldTwo from "@/components/common/PasswordField/PasswordFieldtwo";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { changePasswordThunk } from "@/features/authSlice";
import { useFormik } from "formik";
import { useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";

const ProfileChangePassword = () => {
  const [loading, setLoading] = useState(false)

  const dispatch = useAppDispatch()

  const validationSchema = Yup.object({
    oldPassword: Yup.string()
      .min(6, "Password must be atleast 6 characters")
      .required("Password is required"),
      newPassword:  Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required')
      .test('min-length', 'Must be at least 6 characters', (value) =>
        value ? value.length >= 6 : false
      )
      .test('has-uppercase', 'Must contain at least one uppercase letter', (value) =>
        value ? /[A-Z]/.test(value) : false
      )
      .test('has-lowercase', 'Must contain at least one lowercase letter', (value) =>
        value ? /[a-z]/.test(value) : false
      )
      .test('has-number', 'Must contain at least one number', (value) =>
        value ? /\d/.test(value) : false
      )
      .test(
        'has-special-char',
        'Must contain at least one special character (@, $, !, %, *, ?, &)',
        (value) => (value ? /[@$!%*?&]/.test(value) : false)
      ),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")],"Password miss match")
      .required("Confirm password is required"),
  })

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values,{resetForm}) => {
      setLoading(true)
     const {oldPassword, newPassword} = values

      try{
        const response = await dispatch(changePasswordThunk({oldPassword, newPassword})).unwrap()
        toast.success(response.message || 'Password changed successfully')
        resetForm()
      }catch(error:any){
        console.error('change password error',error.message)
        toast.error(error.message || 'Change password failed')
      }finally{
        setLoading(false)
      }
    },
  });

  
  return (

  
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6 md:grid-cols-1">
      {
      loading ? (
        <LoadingScreen />
      ) : (
        <Card className="w-full flex flex-col items-center">
          <CardHeader className="text-center">
            <div className="text-xl">Edit Password</div>
          </CardHeader>
          <form onSubmit={formik.handleSubmit} className="w-full">
            <CardContent className="min-w-full place-items-center">
              <div className="flex flex-col gap-5 md:w-1/2 w-full items-stretch">
                <div className="space-y-1">
                  <label htmlFor="oldPassword">Old password:</label>
                  <PasswordFieldTwo
                    className={`${
                      formik.touched.oldPassword &&
                      formik.errors.oldPassword &&
                      "border-red-500"
                    } py-6`}
                    value={formik.values.oldPassword}
                    placeholder="Enter old password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    touched = {formik.touched.oldPassword}
                    name="oldPassword"
                    id="oldPassword"
                  />
                  {formik.touched.oldPassword && formik.errors.oldPassword && (
                    <span className="text-xs text-red-500">
                      {formik.errors.oldPassword}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  <label htmlFor="newPassword">New password:</label>
                  <PasswordFieldTwo
                    className={`${
                      formik.touched.newPassword &&
                      formik.errors.newPassword &&
                      "border-red-500"
                    } py-6`}
                    value={formik.values.newPassword}
                    placeholder="Enter new Password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    touched = {formik.touched.newPassword}
                    name="newPassword"
                    id="newPassword"
                  />
                  {formik.touched.newPassword && formik.errors.newPassword && (
                    <span className="text-xs text-red-500">
                      {formik.errors.newPassword}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  <label htmlFor="confirmNewPassword">Confirm new password:</label>
                  <PasswordFieldTwo
                    className={`${
                      formik.touched.confirmNewPassword &&
                      formik.errors.confirmNewPassword &&
                      "border-red-500"
                    } py-6`}
                    value={formik.values.confirmNewPassword}
                    placeholder="Enter confirm new password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    touched = {formik.touched.confirmNewPassword}
                    name="confirmNewPassword"
                    id="confirmNewPassword"
                  />
                  {formik.touched.confirmNewPassword &&
                    formik.errors.confirmNewPassword && (
                      <span className="text-xs text-red-500">
                        {formik.errors.confirmNewPassword}
                      </span>
                    )}
                </div>
                <div className="flex justify-center gap-2 pt-5 ">
                  <AlertDialog>
                    <AlertDialogTrigger className={`${!formik.isValid || !formik.dirty ? 'bg-blue-300' : 'bg-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600'}   text-white p-2 font-semibold rounded-lg py-2`} disabled={!formik.isValid || !formik.dirty}>
                        Change Password
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will change your password.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className='rounded-full'>Cancel</AlertDialogCancel>
                        <AlertDialogAction className='bg-blue-600 rounded-full' type="button" onClick={()=> formik.submitForm()} >Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </form>
        </Card>
      )
    }
        
      </div>
    </div>
  );
};

export default ProfileChangePassword;
