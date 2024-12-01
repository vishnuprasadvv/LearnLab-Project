import { useAppSelector } from '@/app/hooks'

function Profile() {

    const { user } = useAppSelector((state)=> state.auth)
    console.log(user)
  return (
    <>
    <div className='m-2'>
    <h1 className='text-center text-2xl font-bold pb-10'>Profile</h1>

    <div className='flex flex-col items-center gap-3'>
        <div className='flex gap-2'>
        <span>First Name : </span>
        <span>{user?.firstName}</span>
        </div>
        <div className='flex gap-2'>
        <span>Last Name : </span>
        <span>{user?.lastName}</span>
        </div>
        <div className='flex gap-2'>
        <span>Email: </span>
        <span>{user?.email}</span>
        </div>
        <div className='flex gap-2'>
        <span>Phone No. : </span>
        <span>{user?.phone}</span>
        </div>

    </div>

    </div>
    </>
  )
}

export default Profile