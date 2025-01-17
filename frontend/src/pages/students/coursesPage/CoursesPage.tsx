import { getFilteredCoursesUserApi } from "@/api/student";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Filter from "@/components/user/course/Filter";
import { ICourses } from "@/types/course";
import React, { useEffect, useState } from "react";
import SearchResults from "./SearchResults";
import { AlertCircle } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import PaginationComponent from "@/components/common/Pagination/Pagination";
import { COURSES_PER_PAGE } from "@/config/paginationConifig";
import BreadCrumb from "@/components/common/BreadCrumb/BreadCrumb";
import { Separator } from "@/components/ui/separator";

interface Filters {
  categories: string[];
  sortBy: string;
  rating: number | null;
  level: string | null;
}

const CoursesPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [courses, setCourses] = useState<ICourses[] | []>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  //search and pagination
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "");
  const [appliedSearchQuery, setAppliedSearchQuery] = useState(searchParams.get("query") || "");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCourses, setTotalCourses] = useState('')
  const itemsPerPage = COURSES_PER_PAGE;



  const [filters, setFilters] = useState<Filters>({
    categories: searchParams.get("categories")?.split(",") || [],
    sortBy: searchParams.get("sortBy") || "",
    rating: searchParams.get("rating") ? Number(searchParams.get("rating")) : null,
    level: searchParams.get("level") || null,
  });

  const handleFilterChange = (updatedFilters: {
    categories: string[];
    sortBy: string;
    rating: number | null;
    level: string | null;
  }) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...updatedFilters,
    }));
  };

  const updateQueryParams = () => {
    setSearchParams({
      query: appliedSearchQuery || "",
      page: String(currentPage),
      categories: filters.categories.join(","),
      sortBy: filters.sortBy || "",
      rating: filters.rating ? String(filters.rating) : "",
      level: filters.level || "",
    });
  };

  useEffect(() => {
    updateQueryParams(); // Update URL query params
  }, [filters, currentPage, appliedSearchQuery]);


  useEffect(() => {
    const { categories, sortBy, rating, level } = filters;
    setIsLoading(true)
    const getAllCourses = async () => {
      try {
        const response = await getFilteredCoursesUserApi({
          categories: categories.length > 0 ? categories.join(",") : undefined,
          sortBy: sortBy || undefined,
          rating: rating || undefined,
          level: level || undefined,
          page: currentPage,
          limit: itemsPerPage,
          query: appliedSearchQuery,
        });
        setCourses(response.data.courses);
        setTotalPages(response.data.totalPages)
        setTotalCourses(response.data.totalCourses)
      } catch (error) {
        console.error("error fetching courses", error);
      }finally{
        setIsLoading(false)
      }
    };
    getAllCourses();
  }, [filters, currentPage, appliedSearchQuery]);

  //handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Normalize the search query: remove extra spaces
  const normalizedSearchQuery = searchQuery.replace(/\s+/g, ' ').trim();
  
    setAppliedSearchQuery(normalizedSearchQuery);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <BreadCrumb/>
      <div className="my-6">
        <form
          onSubmit={handleSearch}
          className="flex items-center rounded-full shadow-lg overflow-hidden max-w-xl mx-auto mb-6"
        >
          <Input
            type="text"
            className="focus-visible:ring-0 bg-white dark:bg-slate-600 rounded-r-none rounded-l-full text-gray-900 dark:text-gray-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-4 rounded-r-full hover:bg-blue-700 dark:hover:bg-blue-800">
            Search
          </Button>
        </form>
        {appliedSearchQuery !== "" && (
          <p>
            Showing results for{" "}
            <span className="text-blue-600 italic">{appliedSearchQuery}</span>
          </p>
        )}
        <p>Total Courses : {totalCourses}</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-10">

        {/* Filter page  */}
        <Filter onFilterChange={handleFilterChange} />

        <Separator orientation="vertical" className="h-auto dark:bg-slate-700" />
        <div className=" flex flex-col w-full">
        
        <div className="flex-1">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <CourseSkeletonLine key={index} />
            ))
          ) : !courses.length ? (
            <CourseNotFound />
          ) : (
            courses.map((course, index) => (
              <SearchResults key={index} {...course} />
            ))
          )}
        </div>

      <div className="pt-5 mt-auto">
        <PaginationComponent
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
        
      </div>
      </div>
    </div>
  );
};

export default CoursesPage;

const CourseNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-32 p-6">
      <AlertCircle className="text-red-500 h-16 w-16 mb-4" />
      <h1 className="font-bold text-2xl md:text-4xl text-gray-800 dark:text-gray-200 mb-2">
        Course Not Found
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
        Sorry, we couldn't find the course you're looking for.
      </p>
      <Link to='/courses' className="italic">
        <Button variant="link">Browse All Courses</Button>
      </Link>
    </div>
  );
};

const CourseSkeletonLine = () => {
  return (
    <div className="flex-1 flex flex-col md:flex-row justify-between border-b border-gray-300 py-4">
      <div className="h-32 w-full md:w-64">
        <Skeleton className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-col gap-2 flex-1 px-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-1/3" />
        </div>
        <Skeleton className="h-6 w-20 mt-2" />
      </div>
      <div className="flex flex-col items-end justify-between mt-4 md:mt-0">
        <Skeleton className="h-6 w-12" />
      </div>
    </div>
  );
};
