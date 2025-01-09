import { useState } from 'react'
import { Formik, Form, ErrorMessage, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from "@/components/ui/textarea"
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { registerInstructorThunk } from '@/features/authSlice';
import { RegisterInstructorFormValues } from '@/types/instructor';
import ArrayField from '@/components/common/ArrayField/ArrayField';
import toast from 'react-hot-toast';
import PasswordField from '@/components/common/PasswordField/PasswordField';


function RegisterInstructor() {

    const dispatch = useAppDispatch();
    const {user}:any = useAppSelector((state) => state.auth) || ''
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    const nextStep = () => {
        setStep((prevStep) => prevStep + 1);
    };

    const prevStep = () => {
        setStep((prevStep) => prevStep - 1);
    };

    const handleSubmit = async (values: RegisterInstructorFormValues) => {
        // Call backend API to save instructor details
        try {
            const response = await dispatch(registerInstructorThunk({data: values, userId: user._id})).unwrap();
            toast.success(response?.message)
            navigate('/')
        } catch (error: any) {
            console.error(error?.message )
            toast.error(error?.message || 'Something went wrong!')
        }
    };

    // Validation Schema
    const validationSchema = Yup.object({
        comment: Yup.string().min(10, 'Comments must be at least 10 characters').required('Field should not be empty'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        experience: Yup.number().required('Experience is required').positive('Experience must be a positive number').integer('Experience must be a number'),
        expertise: Yup.array().of(Yup.string().required('Expertise required')).min(1, 'Atleast one course interest required').required('Add your course interests'),
        qualifications: Yup.array().of(Yup.string().required('Qualifications are required')).min(1, 'At least one qualification required').required('Qualifications are required'),
        // resume: Yup.mixed()
        //     .required('Resume is required')
        //     .test('fileFormat', 'Unsupported file format', (value: any) => {
        //         // Ensure a file is selected and check file type (if necessary)
        //         return value ? ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(value.type) : false;
        //     }),
    });
    return (
        <div className='md:w-1/3 lg:w-1/3 sm:w-1/2 items-center mx-auto border rounded-md p-6 mt-10 max-w-full dark:bg-slate-950'>
            <div className="instructor-register-form ">
                <h2 className='text-2xl font-bold text-blue-600 text-center p-4 '>Instructor Registration</h2>

                <Formik
                    initialValues={{
                        password: '',
                        expertise: [],
                        qualifications: [],
                        comment: '',
                        experience: '',
                        // resume: null
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, setFieldValue, dirty, values, errors, touched }) => (
                        <Form className="form ">
                            {step === 1 && (
                                <div className='flex flex-col gap-5 mt-5'>
                                    <div>
                                        <ArrayField name='qualifications' label='Qualifications' values={values.qualifications} onChange={(newValue) => setFieldValue('qualifications', newValue)}/>
                                        <ErrorMessage name="qualifications" component="div" className="text-red-500 text-sm mt-1" />
                                        
                                    </div>

                                    <div>
                                        <label htmlFor="experience" className='text font-bold'>Experience in teaching in years :</label>
                                        <Field as={Input} type='number' name="experience" id="experience" placeholder="Experience" className="dark:bg-slate-800" />
                                        <ErrorMessage name="experience" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>
                                    <div>
                                       <ArrayField name='expertise' label='Course interests' values={values.expertise} onChange={(newValue)=> setFieldValue('expertise', newValue)}/>
                                        <ErrorMessage name="expertise" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>
                                    <div>
                                        <label htmlFor="comment" className='font-bold'>Why do you want to be an Instructor? :</label>
                                        <Field as={Textarea} name="comment" className="text-sm dark:bg-slate-800" id="comment" placeholder="Type here..."  />
                                        <ErrorMessage name="comment" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>

                                    <div className='flex gap-10 justify-center mt-5'>
                                        <Button variant={'outline'} className='w-full bg-white dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 text-blue-600  hover:bg-gray-100 rounded-full' type="button" onClick={() => navigate(-1)}>Cance</Button>
                                        <Button className='w-full bg-blue-600 rounded-full hover:bg-blue-700 dark:text-white dark:bg-blue-700 dark:hover:bg-blue-600' type="button" disabled={!dirty} onClick={nextStep}>Next</Button>
                                    </div>

                                    
                                </div>
                            )}

                            {step === 2 && (
                                <div className='flex flex-col gap-5 mt-5'>
                                    <h2 className='text-center font-bold mb-5' >Make sure you filled everything</h2>
                                    {/* <div className='flex flex-col gap-2'>
                                        <label htmlFor="resume">Upload your resume</label>
                                        <Input id="resume" type="file" name='resume' onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            if (e.currentTarget.files) {
                                                setFieldValue('resume', e.currentTarget.files[0]);
                                            }
                                        }} />
                                        <ErrorMessage name="resume" component="div" className="text-red-500 text-sm" />
                                    </div> */}
                                    <div className='flex flex-col gap-2'>

                                       <h2 className='text-center font-bold m-5'>Enter your password for confirmation</h2>
                                        {/* <Field as={Input} type="text" name="password" id="password" placeholder="Enter Password" />  */}
                                        <PasswordField name='password' value={values.password} error={errors.password} touched={touched.password} 
                                        placeholder='password' onchange={(newValue) => setFieldValue('password',newValue)}/>
                                        <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                                    </div>
                                    <div className='flex gap-10 justify-center mt-5'>
                                        <Button variant={'outline'} className='w-full bg-white dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 text-blue-600  hover:bg-gray-1000 rounded-full' type="button" onClick={prevStep}>Back</Button>
                                        <Button className='w-full bg-blue-600 rounded-full hover:bg-blue-700 dark:text-white dark:bg-blue-700 dark:hover:bg-blue-600' type="submit" disabled={isSubmitting} >Submit</Button>
                                    </div>
                                </div>
                            )}


                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}

export default RegisterInstructor