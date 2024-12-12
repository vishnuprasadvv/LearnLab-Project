import { Card, CardHeader } from "../../components/ui/card"


const Dashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
    <div className="grid gap-6 md:grid-cols-1">
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className='text-xl'>Instructor dashboard</div>
        </CardHeader>
        
        
      </Card>
    </div>
  </div>
  )
}

export default Dashboard