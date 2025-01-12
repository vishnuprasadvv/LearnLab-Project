import { getAllCategoriesApi } from "@/api/student";
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
import { Separator } from "@/components/ui/separator";
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

const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [categories, setCategories] = useState<Category[] | []>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>(""); // Sorting state
  const [rating, setRating] = useState<number | null>(null);
  const [level, setLevel] = useState<string | null>(null);

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
    setSortBy(sortOption === 'none' ? '' : sortOption);
  };

  const handleRatingChange = (ratingValue: number) => {
    setRating(ratingValue === 0 ? null : ratingValue);
  };

  const handleLevelChange = (levelValue: string) => {
    setLevel(levelValue === 'none' ? '' : levelValue);
  };

  useEffect(() => {
    onFilterChange({ categories: selectedCategories, sortBy, rating, level });
  }, [selectedCategories, sortBy, rating, level]);

  return (
    <div className="w-full sm:w-[20%]">
      <div className="flex flex-col items-center justify-between">
        <h1 className="font-semibold text-lg md:text-xl mb-2">Filter Options</h1>

        <Select onValueChange={handleSortChange}>
          <SelectTrigger className="dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 hover:bg-gray-50">
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
      <Separator className="my-4 dark:bg-slate-700" />
      <div>
        <h1 className="font-semibold mb-2">Category</h1>
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
      <Separator className="my-4 dark:bg-slate-700" />
      <div>
        <h1 className="font-semibold mb-2">Difficulty</h1>
        <Select onValueChange={handleLevelChange}>
          <SelectTrigger className="dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 hover:bg-gray-50">
            <SelectValue placeholder="Select Level" /> 
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
      <Separator className="my-4 dark:bg-slate-700" />
      <div>
        <h1 className="font-semibold mb-2">Rating</h1>
        <Select onValueChange={(value) => handleRatingChange(Number(value))}>
          <SelectTrigger className="dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 hover:bg-gray-50">
            <SelectValue placeholder="Select Rating" />
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

export default Filter;

const FilterSkeleton = () => {
  return <div>Loading....</div>;
};
