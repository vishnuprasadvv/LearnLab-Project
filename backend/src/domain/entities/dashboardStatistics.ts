export interface IDashboardStatistics{
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    usersByRole: {
        student: number;
        instructor: number;
        admin: number;
    };
    totalCourses: number;
    publishedCourses: number;
    unpublishedCourses: number;
    totalOrders: number;
    totalRevenue: number;
    revenueByMonth: { date: string; revenue: number, orderCount : number}[];
    
}