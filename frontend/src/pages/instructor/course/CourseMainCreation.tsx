import { LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Combobox } from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { FormControl } from "@mui/material";
import toast from "react-hot-toast";
import { createCourseApi } from "@/api/instructorApi";
import { useEffect, useState } from "react";
import { getAllCategoriesAtOnce } from "@/api/adminApi";
import { Category } from "@/types/categories";
import {  useNavigate } from "react-router-dom";

const CourseMainCreation = () => {
  const [categories, setCategories] = useState<Category[] | null>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const formSchema = z.object({
    title: z.string().min(3, "Title must be atleast 3 characters"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    category: z.string().min(1, "Category is required"),
    price: z
      .string()
      .transform((value) => (value === "" ? NaN : parseFloat(value)))
      .refine((value) => !isNaN(value), { message: "Price must be a number" })
      .refine((value) => value > 0, {
        message: "Price must be a positive value",
      })
      .refine((value) => !value.toString().startsWith("0"), {
        message: "Price cannot start with zero",
      }),

    duration: z
      .string()
      .transform((value) => (value === "" ? NaN : parseFloat(value)))
      .refine((value) => !isNaN(value), {
        message: "Duration must be a number.",
      })
      .refine((value) => value > 0, {
        message: "Duration must be greater than 0.",
      }),
    level: z.enum(["beginner", "intermediate", "advanced"], {
      required_error: "Level is required",
    }),
    image: z
      .instanceof(File, { message: "Image must be a file." }) // Check that it's a File object
      .refine((file) => file?.size > 0, { message: "Image is required." }) // Check that a file is uploaded
      .refine((file) => file.size <= 5 * 1024 * 1024, {
        message: "Image size must be less than 5MB.",
      }) // File size validation
      .refine(
        (file) => ["image/jpeg", "image/png", "image/gif"].includes(file.type),
        { message: "Image must be in JPEG, PNG, or GIF format." }
      ),
  });

  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      price: "",
      duration: "",
      level: "beginner",
      image: null as File | null,
    },
    mode: "onChange", // Enables real-time validation
    shouldUseNativeValidation: false,
  });

  const { control, handleSubmit, watch, setValue } = methods;

  const onSubmit = async (data: any) => {
    setLoading(true);

    try {
      const selectedCategoryData = categories?.find(
        (item) => item.name === data.category
      );
      if (!selectedCategoryData) {
        throw new Error("Selected category not found");
      }
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("category", selectedCategoryData._id);
      formData.append("price", data.price.toString());
      formData.append("duration", data.duration.toString());
      formData.append("level", data.level);

      if (data.image) {
        formData.append("courseImage", data.image);
      }

      const response = createCourseApi(formData);
      await toast.promise(response, {
        loading: "Course is creating, Please wait...",
        success: (data: any) => {
          navigate(`/instructor/courses/create/${data.data._id}/lecture`);
          sessionStorage.setItem("courseTitle", data.data.title);
          return data.message || "Course created successfully";
        },
        error: (err) => {
          return err.message || "Course creation failed";
        },
      });
    } catch (error: any) {
      toast.error(error.message);
      console.error("create course error", error);
    } finally {
      setLoading(false);
    }
  };

  // Watch image file
  const watchImage = watch("image");

  return (
    <div className="p-6 w-full">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <div className="flex items-center gap-x-2">
            <div className="rounded-full bg-sky-200 p-1">
              <LayoutDashboard className="text-sky-800" />
            </div>
            <h2 className="text-xl font-semibold">Create your course</h2>
          </div>
        </div>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
            <div>
              <FormField
                name="title"
                control={control}
                render={({ field }) => (
                  <FormItem className="mt-6 border bg-slate-100 dark:bg-slate-800  rounded-md p-4">
                    <div className="font-medium flex items-center justify-between">
                      Course title
                    </div>
                    <FormControl className="w-full">
                      <Input
                        {...field}
                        className="bg-white dark:bg-slate-700"
                        placeholder="e.g. 'Advanced web development'"
                      />
                    </FormControl>
                    <FormMessage className="dark:text-red-600"/>
                  </FormItem>
                )}
              />

              <FormField
                name="description"
                control={control}
                render={({ field }) => (
                  <FormItem className="mt-6 border bg-slate-100 dark:bg-slate-800 rounded-md p-4">
                    <div className="font-medium flex items-center justify-between">
                      Course description
                    </div>
                    <FormControl className="w-full">
                      <Textarea
                        rows={4}
                        {...field}
                        className="bg-white dark:bg-slate-700"
                        placeholder="e.g. 'This course is about...'"
                      />
                    </FormControl>
                    <FormMessage className="dark:text-red-600" />
                  </FormItem>
                )}
              />

              <FormField
                name="category"
                control={control}
                render={({ field }) => (
                  <FormItem className="mt-6 border bg-slate-100 dark:bg-slate-800 rounded-md p-4">
                    <div className="font-medium flex items-center justify-between">
                      Course category
                    </div>
                    <FormControl className="w-full">
                      {categories && (
                        <Combobox
                          options={categories?.map((item) => ({
                            label: item.name,
                            value: item.name,
                          }))}
                          {...field}
                        />
                      )}
                    </FormControl>
                    <FormMessage className="dark:text-red-600" />
                  </FormItem>
                )}
              />

              <FormField
                name="price"
                control={control}
                render={({ field }) => (
                  <FormItem className="mt-6 border bg-slate-100 dark:bg-slate-800 rounded-md p-4">
                    <div className="font-medium flex items-center justify-between">
                      Course price
                    </div>
                    <FormControl className="w-full">
                      <Input
                        {...field}
                        type="number"
                        step="0.01"
                        className="bg-white dark:bg-slate-700"
                        placeholder="Set a price for your course"
                      />
                    </FormControl>
                    <FormMessage className="dark:text-red-600" />
                  </FormItem>
                )}
              />
              <div>
                <h3 className="text-red-500 font-semibold">
                  10% fee will be charged.
                </h3>
              </div>
            </div>

            <div className="space-y-6 ">
              <div className="">
                <FormField
                  name="image"
                  control={control}
                  render={() => (
                    <FormItem className="mt-6 border bg-slate-100 dark:bg-slate-800 rounded-md p-4">
                      <div className="font-medium flex items-center justify-between">
                        Course image
                      </div>
                      <FormControl className="w-full">
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                          <Label htmlFor="image">Image</Label>
                          <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const files = e.target.files;
                              setValue("image", files?.[0] || null, {
                                shouldValidate: true,
                              });
                            }}
                            className="dark:bg-slate-700"
                          />
                        </div>
                      </FormControl>

                      {watchImage && (
                        <div className="mt-2 place-items-center sm:place-items-start">
                          <img
                            src={URL.createObjectURL(watchImage)}
                            alt="Course Preview"
                            className="w-58 h-32 object-cover rounded-md"
                          />
                        </div>
                      )}
                      <FormMessage className="dark:text-red-600" />
                    </FormItem>
                  )}
                />

                <FormField
                  name="duration"
                  control={control}
                  render={({ field }) => (
                    <FormItem className="mt-6 border bg-slate-100 dark:bg-slate-800 rounded-md p-4">
                      <div className="font-medium flex items-center justify-between">
                        Course duration
                      </div>
                      <FormControl className="w-full">
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          className="bg-white dark:bg-slate-700"
                          placeholder="e.g. '20 hours'"
                        />
                      </FormControl>
                      <FormMessage className="dark:text-red-600" />
                    </FormItem>
                  )}
                />

                <FormField
                  name="level"
                  control={control}
                  render={({ field }) => (
                    <FormItem className="mt-6 border bg-slate-100 dark:bg-slate-800 rounded-md p-4">
                      <div className="font-medium flex items-center justify-between">
                        Course level
                      </div>
                      <FormControl className="w-full">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                              {field.value || "Select Level"}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>
                              Select course level
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup
                              value={field.value}
                              onValueChange={(value) => field.onChange(value)}
                            >
                              <DropdownMenuRadioItem value="beginner">
                                Beginner
                              </DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="intermediate">
                                Intermediate
                              </DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="advanced">
                                Advanced
                              </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </FormControl>
                      <FormMessage className="dark:text-red-600" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-5 ">
            <Button
              disabled={loading}
              className="border border-slate-200 bg-white dark:bg-slate-950 dark:border-slate-800 dark:hover:bg-slate-700 text-blue-600 rounded-full  hover:bg-slate-100"
              type="button"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              disabled={loading}
              className="bg-blue-600 rounded-full dark:text-white  hover:bg-blue-700"
              type="submit"
            >
              Save
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default CourseMainCreation;
