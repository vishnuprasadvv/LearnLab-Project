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
    adminRevenue: number;
    dailyRevenue: { date: string; revenue: number, orderCount : number}[];
    
}