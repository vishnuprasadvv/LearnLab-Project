import { getAllCategoriesApi } from "@/api/student";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/types/categories";
import React, { useEffect, useState } from "react";

interface FilterProps {
  onFilterChange: (filter: {
    categories: string[];
    sortBy: string;
    rating: number | null;
    level: string | null;
  }) => void;
}

const CourseFilter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [categories, setCategories] = useState<Category[] | []>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>(""); // Sorting state
  const [rating, setRating] = useState<number | null>(null);
  const [level, setLevel] = useState<string | null>(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      try {
        const response = await getAllCategoriesApi();
        setCategories(response.data);
      } catch (error) {
        console.error("error fetching categories", error);
      } finally {
        setLoading(false);
      }
    };
    getCategories();
  }, []);

  const handleCategoryChange = (id: string, isChecked: string | boolean) => {
    setSelectedCategories((prev: any) =>
      isChecked
        ? [...prev, id]
        : prev.filter((categoryId: string) => categoryId !== id)
    );
  };

  const handleSortChange = (sortOption: string) => {
    setSortBy(sortOption === "none" ? "" : sortOption);
  };

  const handleRatingChange = (ratingValue: number) => {
    setRating(ratingValue === 0 ? null : ratingValue);
  };

  const handleLevelChange = (levelValue: string) => {
    setLevel(levelValue === "none" ? "" : levelValue);
  };

  useEffect(() => {
    onFilterChange({ categories: selectedCategories, sortBy, rating, level });
  }, [selectedCategories, sortBy, rating, level]);

  return (
    <div className="w-full flex gap-2 justify-center sm:justify-end ">
        <div>
        <Button variant='outline'
          onClick={toggleDropdown}
          className=" dark:bg-gray-800 flex items-center justify-between w-full"
        >
          <span className="font-normal">Categories</span>
          <svg
            className={`h-5 w-5 transition-transform ${
              isDropdownOpen ? "rotate-180" : "rotate-0"
            }`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </Button>
        {isDropdownOpen && (
          <div className="absolute bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg mt-2 z-10 w-max p-4 max-h-64 overflow-y-auto">
            <h1 className="font-semibold mb-2">Categories</h1>
            {loading ? (
              <FilterSkeleton />
            ) : (
              categories.map((category) => (
                <div
                  className="flex items-center space-x-2 my-2"
                  key={category._id}
                >
                  <Checkbox
                    id={category._id}
                    onCheckedChange={(isChecked) =>
                      handleCategoryChange(category._id, isChecked)
                    }
                    checked={selectedCategories.includes(category._id)}
                  ></Checkbox>
                  <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {category.name}
                  </Label>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <div className="items-center justify-between">
        <Select onValueChange={handleSortChange}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {/* Default "None" Option */}
              <SelectItem value="none">None</SelectItem>
              <SelectLabel>Sort by title</SelectLabel>
              <SelectItem value="a-z">A-Z</SelectItem>
              <SelectItem value="z-a">Z-A</SelectItem>
              <SelectLabel>Sort by price</SelectLabel>
              <SelectItem value="priceLowToHigh">Low to high</SelectItem>
              <SelectItem value="priceHighToLow">High to low</SelectItem>
              <SelectLabel>Sort by rating</SelectLabel>
              <SelectItem value="ratingLowToHigh">Low to high</SelectItem>
              <SelectItem value="ratingHighToLow">High to low</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      <div className="truncate text-ellipsis">
        <Select onValueChange={handleLevelChange}>
          <SelectTrigger>
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="truncate">
        <Select onValueChange={(value) => handleRatingChange(Number(value))}>
          <SelectTrigger>
            <SelectValue placeholder="Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="0">None</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars & Up</SelectItem>
              <SelectItem value="3">3 Stars & Up</SelectItem>
              <SelectItem value="2">2 Stars & Up</SelectItem>
              <SelectItem value="1">1 Star & Up</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CourseFilter;

const FilterSkeleton = () => {
  return <div>Loading....</div>;
};
