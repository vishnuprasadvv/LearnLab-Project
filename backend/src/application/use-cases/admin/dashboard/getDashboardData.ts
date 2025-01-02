import { IDashboardStatistics } from "../../../../domain/entities/dashboardStatistics";
import { ICourseRepository } from "../../../repositories/ICourseRepository";
import { IOrderRepository } from "../../../repositories/IOrderRepository";
import { IUserRepository } from "../../../repositories/IUserRepository";

export class GetDashboardDataUseCase {
    constructor(
        private userRepository: IUserRepository,
        private courseRepository: ICourseRepository,
        private orderRepository:IOrderRepository
    ){}

    async execute() : Promise<IDashboardStatistics> {
        
        //Fetch users data 
        const totalUsers = await this.userRepository.countAll();
        const activeUsers = await this.userRepository.countByStatus('active')
        const inactiveUsers = totalUsers - activeUsers;
        const usersByRole = await this.userRepository.countByRole()

        //fetch course data 
        const totalCourses = await this.courseRepository.countAll();
        const publishedCourses = await this.courseRepository.countPublished();
        const unpublishedCourses = totalCourses - publishedCourses;

        //fetch orders data 
        const totalOrders = await this.orderRepository.countAll();
        const totalRevenue = await this.orderRepository.calculateTotalRevenue();
        const revenueByMonth = await this.orderRepository.getRevenueByMonth();

        //fetch user registration over time 
        const userRegistrations = await this.userRepository.getRegistrationsOverTime();

        return {
            totalUsers,
            activeUsers,
            inactiveUsers,
            usersByRole,
            totalCourses,
            publishedCourses,
            unpublishedCourses,
            totalOrders,
            totalRevenue,
            revenueByMonth,
            userRegistrations
        }
    }
}