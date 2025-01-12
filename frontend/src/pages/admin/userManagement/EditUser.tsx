import { useEffect, useState } from 'react'
import { useFormik} from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { endLoading, setError, startLoading } from '@/features/authSlice';
import { useAppDispatch } from '@/app/hooks';
import { useNavigate, useParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {  editUserGet, editUserPost } from '@/api/adminApi';

function EditUser() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)


  const { id } = useParams();

   // Fetch user details when component mounts
   useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await editUserGet(id as string)// Populate form with existing user data
        const userData = response.user;

        formik.setValues({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          //password: '', // Reset password for security reasons
         // confirmPassword: '', // Also reset confirm password
          role: userData.role || 'student',
          userStatus: userData.status || 'active',
        });
        
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch user details.');
      } 
    };

    fetchUser();
  }, [id]);

    const formik = useFormik({
        initialValues: {
          email : '',
        //  password: '',
          firstName: '',
          lastName:  '',
         // confirmPassword:'',
          phone : '',
          role: '',
          userStatus: ''
        },
        validationSchema : Yup.object({
            firstName: Yup.string()
            .min(3, 'Name must be atleast 3 characters')
            .required('First name is required'),
            lastName: Yup.string()
            .min(3, 'Name must be atleast 3 characters')
            .required('Last name is required'),
          email: Yup.string()
          .email('Invalid email adress')
          .required('Email is required'),
          // password: Yup.string()
          // .min(5, 'Password must be atleast 5 characters')
          // .required('Password is required'),
          // confirmPassword: Yup.string()
          // .oneOf([Yup.ref('password')], 'Password miss match')
          // .required('Confirm password is required'),
          phone: Yup.string()
          .required('Mobile number is required')
        .matches(
          /^[6-9]\d{9}$/,
          'Mobile number must be 10 digits and start with 6, 7, 8, or 9'
        )
        }),
        onSubmit : async(values) => {
            dispatch(startLoading())
            const {firstName, lastName, email, phone, role, userStatus} = values
          try {
    
             const result =  editUserPost(firstName, lastName, email, phone, role, userStatus, id as string)
            await toast.promise(result, {
              loading: 'Editing user data...',
              success:" User edited",
              error: (err) => {
                return err?.response?.data?.message || 'User edit failed'
              }
    
              }
            )
          } catch (err: any) {
            dispatch(setError(err?.message))
            console.error('User Edit failed:', err);
          }finally{
            dispatch(endLoading())
          }
        }
        
      })

      const handleBack = () => {
        navigate('/admin/users'); // Navigate back to the previous page
      };
  return (
    <div className='md:w-1/2 sm:w-1/2  items-center mx-auto border rounded-md p-6 mt-10'>
    <h1 className='text-2xl font-bold text-blue-600 text-center p-4 '>Edit user</h1>
      <form onSubmit={formik.handleSubmit} >
    <div className='flex flex-col gap-3 mt-5'>
    <div >
      <Input type="text" id='firstName' name='firstName' placeholder='First name' value={loading ? 'loading...' : formik.values.firstName} onChange={formik.handleChange} className='w-full'
       style={{
          width: '100%',
          padding: '8px',
          marginBottom: '5px',
          border: formik.touched.firstName && formik.errors.firstName ? '1px solid red' : '1px solid #ccc',
        }}/>
         {formik.touched.firstName && formik.errors.firstName ? (
          <div style={{ color: 'red', fontSize: '12px' }}>{formik.errors.firstName}</div>
        ) : null}
    </div>
    <div >
      <Input type="text" id='lastName' name='lastName' placeholder='Last name' value={formik.values.lastName} onChange={formik.handleChange} className='w-full'
       style={{
          width: '100%',
          padding: '8px',
          marginBottom: '5px',
          border: formik.touched.lastName && formik.errors.lastName ? '1px solid red' : '1px solid #ccc',
        }}/>
         {formik.touched.lastName && formik.errors.lastName ? (
          <div style={{ color: 'red', fontSize: '12px' }}>{formik.errors.lastName}</div>
        ) : null}
    </div>
    
    <div >
      <Input type="email" id='email' name='email' placeholder='Email' value={formik.values.email} onChange={formik.handleChange} className='w-full'
       style={{
          width: '100%',
          padding: '8px',
          marginBottom: '5px',
          border: formik.touched.email && formik.errors.email ? '1px solid red' : '1px solid #ccc',
        }}/>
         {formik.touched.email && formik.errors.email ? (
          <div style={{ color: 'red', fontSize: '12px' }}>{formik.errors.email}</div>
        ) : null}
    </div>
    
    <div >
      <Input type="text" id='phone' name='phone' placeholder='phone' value={formik.values.phone} onChange={formik.handleChange} className='w-full'
       style={{
          width: '100%',
          padding: '8px',
          marginBottom: '5px',
          border: formik.touched.phone && formik.errors.phone ? '1px solid red' : '1px solid #ccc',
        }}/>
         {formik.touched.phone && formik.errors.phone ? (
          <div style={{ color: 'red', fontSize: '12px' }}>{formik.errors.phone}</div>
        ) : null}
    </div>


    <div >

      {/* <div className='flex'>
      <Input type={ isPasswordVisible ? "text" : "password"} id='password' name='password' placeholder='password' value={formik.values.password} onChange={formik.handleChange} className='w-full'
       style={{
          width: '100%',
          padding: '8px',
          marginBottom: '5px',
          border: formik.touched.password && formik.errors.password ? '1px solid red' : '1px solid #ccc',
        }}/>
        <button type='button' onClick={togglePasswordVisibility}
        style={{
          position: 'relative',
          marginLeft: '-30px',
          border: 'none',
          background: 'none',
          cursor: 'pointer',
        }}>{isPasswordVisible ? <EyeIcon className='size-4 text-gray-400'/> : <EyeClosed className='size-4 text-gray-400'/>}
        </button>
        </div>

         {formik.touched.password && formik.errors.password ? (
          <div style={{ color: 'red', fontSize: '12px' }}>{formik.errors.password}</div>
        ) : null} */}
    </div>
    <div>
      {/* <div className='flex'>

      <Input type={isConfirmPasswordVisible ? "text" : "password"} id='confirmPassword' name='confirmPassword' placeholder='Confirm password' value={formik.values.confirmPassword} onChange={formik.handleChange} className='w-full'
       style={{
          width: '100%',
          padding: '8px',
          marginBottom: '5px',
          border: formik.touched.confirmPassword && formik.errors.confirmPassword ? '1px solid red' : '1px solid #ccc',
        }}/>

        <button type='button' onClick={toggleConfirmPasswordVisibility}  
        style={{
            position: 'relative',
            marginLeft: '-30px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
          }}>{isConfirmPasswordVisible ? <EyeIcon className='size-4 text-gray-400'/> : <EyeClosed className='size-4 text-gray-400'/>}
        </button>

        </div>

         {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
          <div style={{ color: 'red', fontSize: '12px' }}>{formik.errors.confirmPassword}</div>
        ) : null} */}
    </div>

    <span className='pt-5 font-bold'>Select user role</span>
    <div>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{formik.values.role}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Select user role</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={formik.values.role} onValueChange={(value) => formik.setFieldValue('role', value)}>
          <DropdownMenuRadioItem value="student">Student</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="instructor">Instructor</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="admin">Admin</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
    </div>
    
      <span className='pt-5 font-bold'>User Status</span>
      <div className='pl-4'>
        <label htmlFor='active'>
          <input
            id='active'
            type="radio"
            name="status"
            value="active"
            checked={formik.values.userStatus === 'active'}
            onChange={() => formik.setFieldValue('userStatus', 'active')}
          />
          Active
        </label>
      </div>
      <div className='pl-4'>
        <label htmlFor='inactive'>
          <input
            id='inactive'
            type="radio"
            name="status"
            value="inactive"
            checked={formik.values.userStatus === 'inactive'}
            onChange={() =>formik.setFieldValue('userStatus', 'inactive')}
          />
          Inactive
        </label>
      </div>

    </div>
    
    <div className='flex justify-end gap-2 pt-5 '>
      <Button className='border border-slate-200 bg-white text-blue-600 rounded-full  hover:bg-slate-100' type="button" onClick={handleBack} disabled={loading}>Cancel</Button>
      <Button className='bg-blue-600 rounded-full  hover:bg-blue-700' type="submit" disabled={loading}>Save</Button>
    </div>

    </form>
        
  </div>
  )
}

export default EditUser