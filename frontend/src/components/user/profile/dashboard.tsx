import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, Mail, MapPin, Phone, Share2, Twitter } from 'lucide-react'

export default function UserProfile() {
  return (
    <div className="container mx-auto px-4 py-8 w-1/2 bg-slate-300">
      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <Card>
          <CardHeader className="text-center">
            <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-full">
              <img
                alt="User profile picture"
                className="object-cover"
                height="160"
                src="/placeholder.svg?height=160&width=160"
                style={{
                  aspectRatio: "160/160",
                  objectFit: "cover",
                }}
                width="160"
              />
            </div>
            <CardTitle className="mt-4">Sarah Johnson</CardTitle>
            <CardDescription>Senior Software Engineer</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button className="mt-2" variant="outline">
              <Share2 className="mr-2 h-4 w-4" />
              Share Profile
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 opacity-70" />
              <span>sarah.johnson@example.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 opacity-70" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 opacity-70" />
              <span>San Francisco, CA</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 opacity-70" />
              <span>Joined March 2018</span>
            </div>
            <div className="flex items-center gap-2">
              <Twitter className="h-4 w-4 opacity-70" />
              <span>@sarahjcodes</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

