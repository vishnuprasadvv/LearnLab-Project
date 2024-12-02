import { Card, CardHeader } from "../ui/card"


const InstructorCourses = () => {
  return (
    <div className="container mx-auto px-4 py-8">
    <div className="grid gap-6 md:grid-cols-1">
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className='text-xl'>Courses</div>
        </CardHeader>
        
        
      </Card>
    </div>
  </div>
  )
}

export default InstructorCourses