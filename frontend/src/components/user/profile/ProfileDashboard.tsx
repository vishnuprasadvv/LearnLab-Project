import { useAppSelector } from "@/app/hooks"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, Mail,Phone, Share2, Twitter } from 'lucide-react'
import { useNavigate } from "react-router-dom"

export default function UserProfile() {
    const {user} = useAppSelector((state) => state.auth)
    const navigate = useNavigate()
    if(!user){
        navigate('/login')
        return(
            <>User not found</>
        )
    }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6 md:grid-cols-1">
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-full">
              <img
                alt="User profile picture"
                className="object-cover"
                height="160"
                src="/placeholder.svg?height=160&width=160"
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
          <CardContent className="text-center">
            <Button className="mt-2" variant="outline">
              <Share2 className="mr-2 h-4 w-4" />
              Edit image
            </Button>
          </CardContent>
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
              <span>{new Date(user?.createdAt).toDateString()}</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

