export interface RegisterInstructorFormValues {
    qualifications: string[];
    experience: number | '';
    expertise: string[];
    comment: string;
    password: string;
    // resume: File | null;
}

export interface IInstructorDashboardMetrics {
    totalStudents: number;
    totalCourses: number;
    totalEarnings: number;
  }