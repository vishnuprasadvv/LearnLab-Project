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
import { editCourseApi, getCourseById } from "@/api/instructorApi";
import { useEffect, useState } from "react";
import { getAllCategoriesAtOnce } from "@/api/adminApi";
import { Category } from "@/types/categories";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ICourses } from "@/types/course";
import _ from "lodash";

const CourseMainEdit = () => {
  const [categories, setCategories] = useState<Category[] | null>([]);
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState<ICourses | null>(null);
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [initialFormData, setInitialFormData] = useState({});

  //fetch current course data
  const getCourse = async () => {
    if (!courseId) {
      throw new Error("Course id not found");
    }
    try {
      setLoading(true);
      const response = await getCourseById(courseId);
      setCourse(response.data);
      const resultdata = response.data;
      methods.setValue("title", resultdata.title);
      methods.setValue("description", resultdata.description);
      methods.setValue("category", resultdata.category?.name);
      methods.setValue("price", resultdata.price.toString());
      methods.setValue("duration", resultdata.duration.toString());
      methods.setValue("level", resultdata.level);
      methods.setValue("image", resultdata.imageUrl || null);

      setInitialFormData(methods.getValues());
    } catch (error: any) {
      toast.error(error.message || "failed to fetch course");
      navigate("/instructor/courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await getAllCategoriesAtOnce();
        setCategories(response.categories);
      } catch (error) {
        console.error("error fetching categories", error);
      }
    };
    getCourse();
    getCategories();
  }, []);

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
      .union([
        z.instanceof(File), // If a new image is uploaded
        z.string(), // If the existing image URL is used
      ])
      .refine(
        (value) => {
          if (typeof value === "string") return value !== ""; // Existing image must have a URL
          if (value instanceof File) return value.size > 0; // Uploaded image must be valid
          return false;
        },
        { message: "An image is required." }
      )
      .refine(
        (value) =>
          typeof value === "string" ||
          (value instanceof File &&
            value.size <= 5 * 1024 * 1024 &&
            ["image/jpeg", "image/png", "image/gif"].includes(value.type)),
        {
          message:
            "Image must be in JPEG, PNG, or GIF format and less than 5MB.",
        }
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
      if (!courseId) {
        console.error("course id not found");
        return;
      }
      const isUnchanged = _.isEqual(
        {
          ...data,
          duration: data.duration.toString(),
          price: data.price.toString(),
        },
        initialFormData
      );
      if (isUnchanged) {
        toast("No Changes detected", { icon: "⚠️" });
        return;
      }
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

      if (data.image instanceof File) {
        formData.append("courseImage", data.image);
      }

      const response = editCourseApi(formData, courseId);
      await toast.promise(response, {
        loading: "Course is editing, Please wait...",
        success: (data: any) => {
          setCourse(data.data);
          getCourse();
          return data.message || "Course edited successfully";
        },
        error: (err) => {
          return err.message || "Course edit failed";
        },
      });
    } catch (error: any) {
      toast.error(error.message);
      console.error("Edit course error", error);
    } finally {
      setLoading(false);
    }
  };

  // Watch image file
  const watchImage =
    watch("image") instanceof Blob && watch("image")?.type.startsWith("image/")
      ? watch("image")
      : null;
  useEffect(() => {
    if (watchImage) {
      const objectUrl = URL.createObjectURL(watchImage);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
  }, [watchImage]);

  return (
    <div className="p-6 w-full">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <div className="flex items-center gap-x-2">
            <div className="rounded-full bg-sky-200 p-1">
              <LayoutDashboard className="text-sky-800" />
            </div>
            <h2 className="text-xl font-semibold">Edit your course</h2>
          </div>
        </div>
        <div>
          <Link to={"lecture"}>
            <Button>Go to lectures</Button>
          </Link>
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
                  <FormItem className="mt-6 border bg-slate-100 dark:bg-slate-800 rounded-md p-4">
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
                    <FormMessage className="dark:text-red-600" />
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
                          options={categories.map((item) => ({
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
                        {course?.imageUrl && !watchImage && (
                          <div className="flex items-center justify-center bg-slate-200 rounded-md">
                            <img src={course?.imageUrl} alt="course_image" />
                          </div>
                        )}

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
                          />
                        </div>
                      </FormControl>

                      {watchImage && (
                        <div className="mt-2">
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
              className="border border-slate-200 bg-white text-blue-600 rounded-full  hover:bg-slate-100"
              type="button"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              disabled={loading}
              className="bg-blue-600 rounded-full  hover:bg-blue-700"
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

export default CourseMainEdit;
