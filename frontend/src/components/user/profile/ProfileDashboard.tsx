import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserDataThunk } from "@/features/authSlice"
import { User } from "@/types/userTypes"
import { CalendarDays, Mail,Phone } from 'lucide-react'
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function UserProfile() {
    const {user} = useAppSelector((state) => state.auth)
    
  const [profileData, setProfileData] = useState<User | null>(null);

    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    if(!user){
        navigate('/login')
        return(
            <>User not found</>
        )
    }

    useEffect(() => {
      const fetchProfile = async () => {
        try {
          const response = await dispatch(getUserDataThunk(user._id)).unwrap();
          setProfileData(response.user);
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        }
      };
  
      fetchProfile();
    }, [user]);
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6 md:grid-cols-1">
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className=" mx-auto h-40 w-40 overflow-hidden rounded-full">
              <img
                alt="User profile picture"
                className="object-cover"
                height="160"
                src={profileData?.profileImageUrl || "https://avatar.iran.liara.run/public/36"}
                style={{
                  aspectRatio: "150/150",
                  objectFit: "cover",
                }}
                width="160"
              />
            </div>
            <CardTitle className="mt-4 text-lg">{`${user?.firstName} ${user?.lastName}`}</CardTitle>
            <CardDescription>{user?.role}</CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col  gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 opacity-70" />
              <span>{user?.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 opacity-70" />
              <span>{user?.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 opacity-70" />
              <span>{new Date(user.createdAt!).toDateString() || 'NA'}</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

