import { CourseRepositoryClass } from "../../../../infrastructure/repositories/courseRepository";
import { OrderRepository } from "../../../../infrastructure/repositories/orderRepository";

export class GetPurchasesInstructorUseCase{
    constructor(
        private orderRespository : OrderRepository,
        private courseRepository : CourseRepositoryClass
    ){}

    async execute(instructorId: string) {
        const allOrders = await this.orderRespository.getAllOrders();
        if(!allOrders) {
            console.error('all course fetching error')
        }
        
        const instructorCourses = await this.courseRepository.getAllCourses(instructorId)
        if(!instructorCourses || instructorCourses.length === 0) {
            console.error('no courses found for the instructor')
            return null;
        }
        const instructorCourseIds = instructorCourses.map((course) => course._id.toString())

        const filteredOrders = allOrders?.filter((order) => 
        order.courses.some((course) => instructorCourseIds.includes(course.courseId.toString())))
        
        return filteredOrders;
    }
}