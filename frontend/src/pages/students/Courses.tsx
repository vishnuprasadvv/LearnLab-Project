import Course from "@/components/common/Course/Course";
import CourseSkeleton from "@/components/common/courseSkeleton/CourseSkeleton";

const Courses = () => {
  const isLoading = false;
  const courses = [1, 2, 3, 4, 5, 6, 7, 8];
  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 ">
        <h1 className="font-bold text-3xl text-center mb-10">Our Courses</h1>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <CourseSkeleton key={index} />
              ))
            : courses.map((course, index) => <Course />)}
        </div>
      </div>
    </div>
  );
};

export default Courses;
