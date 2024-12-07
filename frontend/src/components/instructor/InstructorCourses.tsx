import { Link } from "react-router-dom"
import { Card, CardHeader } from "../ui/card"
import { Button } from "../ui/button"


const InstructorCourses = () => {
  return (
    <div className="container mx-auto px-4 py-8 w-full">
    <div className="text-center text-xl font-semibold">
      <h1>Courses</h1>
    </div>
    <div>
      <Link to={'/instructor/courses/create'} >
      <Button>New course</Button></Link>
    </div>
  </div>
  )
}

export default InstructorCourses