import { CustomError } from "../../../interfaces/middlewares/errorMiddleWare";
import { ICourseRepository } from "../../repositories/ICourseRepository";
import { IOrderRepository } from "../../repositories/IOrderRepository";

export class GetUserCoursesUseCase {
  constructor(
    private courseRepository: ICourseRepository,
    private orderRepository: IOrderRepository
  ) {}
  async execute(userId: string) {
    const userOrders = await this.orderRepository.getOrdersByUserId(userId);
    if (!userOrders) throw new CustomError("Courses not found", 400);

    const coursesIds = userOrders.flatMap((order) => {
      return order.courses
        .map((course) => course.courseId.toString())
        .filter((id): id is string => !!id);
    });

    if (!coursesIds.length) {
      console.error("Courses IDs not found")
    }

    const userCourses = await this.courseRepository.getCourseByIdsUser(coursesIds);
    if (!userCourses || userCourses.length === 0) {
      console.error("No courses found for the provided IDs");
    }

   return userOrders;
  }
}
