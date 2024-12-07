import { Skeleton } from "@/components/ui/skeleton";

const CourseSkeleton = () => {
  return (
    <div className="shadow-md bg-white hover:shadow-lg transition-shadow overflow-hidden rounded-lg">
      <Skeleton className="w-full h-36" />
      <div className="px-5 py-4 space-y-3">
        <Skeleton className="h-4" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-2/3" />
        </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
};

export default CourseSkeleton;
