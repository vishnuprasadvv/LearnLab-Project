import { createCategory, getAllCategoriesAtOnce } from "@/api/adminApi";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Category } from "@/types/categories";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

const CreateCategory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [parentCategory, setParentCategory] = useState<string>("none");
  const [isActive, setIsActive] = useState<boolean>(true);
  const [categories, setCategories] = useState<Category[] | null>([]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await getAllCategoriesAtOnce();
        setCategories(response.categories);
      } catch (error) {
        console.error("error fetching categories", error);
      }
    };
    getCategories();
  }, [loading]);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "Name must be atleast 3 characters")
        .required("First name is required"),
      description: Yup.string()
        .min(10, "Description must be atleast 10 characters")
        .required("Last name is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      const { name, description } = values;

      try {
        const result = createCategory(
          name,
          description,
          parentCategory,
          isActive
        );
        await toast.promise(result, {
          loading: "Creating new category...",
          success: (data) => {
            return data.message || "New category created successfully";
          },
          error: (err) => {
            return err?.response?.data?.message || "User creation failed";
          },
        });
        setLoading(false);
      } catch (err: any) {
        console.error("User creation failed:", err);
      } finally {
        setLoading(false);
      }
    },
  });
  const handleCategoryStatusChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.value === "active") {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  };

  const handleBack = () => {
    navigate("/admin/categories"); // Navigate back to the previous page
  };
  return (
    <div className="md:w-2/3 items-center mx-auto border rounded-md p-6 mt-10">
      <h1 className="text-2xl font-bold text-blue-600 text-center p-4 ">
        Add new category
      </h1>
      <form onSubmit={formik.handleSubmit}>
        <div className="flex flex-col gap-3 mt-5">
          <div>
            <h4 className="pb-1 font-semibold text-gray-900">Category name:</h4>
            <Input
              type="text"
              id="name"
              name="name"
              placeholder="Category name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`${
                formik.touched.name && formik.errors.name && "border-red-500"
              } py-6 w-full`}
            />
            {formik.touched.name && formik.errors.name && (
              <span className="text-xs text-red-500">
                {formik.errors.name}{" "}
              </span>
            )}
          </div>
          <div>
            <h4 className="pb-1 font-semibold text-gray-900">Description:</h4>
            <Textarea
              rows={4}
              id="description"
              name="description"
              placeholder="Enter description..."
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`${
                formik.touched.description &&
                formik.errors.description &&
                "border-red-500"
              } w-full `}
            />
            {formik.touched.description && formik.errors.description && (
              <span className="text-xs text-red-500">
                {formik.errors.description}{" "}
              </span>
            )}
          </div>

          <span className="pt-5 font-semibold">Select parent category</span>

          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">{parentCategory}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Select parent category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={parentCategory}
                  onValueChange={setParentCategory}
                >
                  <DropdownMenuRadioItem value="none">
                    none
                  </DropdownMenuRadioItem>
                  {categories?.map((item) => (
                    <DropdownMenuRadioItem
                      key={item.name}
                      value={item._id}
                      disabled={!item.isActive}
                    >
                      {item.name}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <span className="pt-5 font-semibold">Status</span>
          <div className="pl-4">
            <label>
              <input
                type="radio"
                name="option"
                value="active"
                checked={isActive}
                onChange={handleCategoryStatusChange}
              />
              Active
            </label>
          </div>
          <div className="pl-4">
            <label htmlFor="">
              <input
                type="radio"
                name="option"
                value="inactive"
                checked={!isActive}
                onChange={handleCategoryStatusChange}
              />
              Inactive
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-5 ">
          <Button
            className="border border-slate-200 bg-white text-blue-600 rounded-full  hover:bg-slate-100"
            type="button"
            onClick={handleBack}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            className="bg-blue-600 rounded-full  hover:bg-blue-700"
            type="submit"
            disabled={loading}
          >
            Create
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateCategory;
