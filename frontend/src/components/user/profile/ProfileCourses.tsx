import Course from '@/components/common/Course/Course'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const ProfileCourses = () => {
  const isLoading = false
  const myCourses: any[] = []
  return (
    <div className="container mx-auto px-4 py-8">
    <div className="grid gap-6 md:grid-cols-1">
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className='text-xl'>My Learning</div>
        </CardHeader>
        <CardContent>
        <div className="">
          {
           myCourses.length === 0 ? (<h2 className='text-lg text-center text-slate-600 font-semibold'>You are not enrolled any courses</h2>) 
           : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <ProfileCoursesSkeleton key={index} />
              )) : (myCourses.map((course, index) => <Course {...course}/>))}
            </div>
              )}
           
        </div>
        </CardContent>
      </Card>
    </div>
  </div>
  )
}

export default ProfileCourses

export function ProfileCoursesSkeleton() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}