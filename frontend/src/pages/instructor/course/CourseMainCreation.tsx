
import { LayoutDashboard, Pencil } from "lucide-react";
import React from "react";
import DescriptionForm from "./components/DescriptionForm";
import TitleForm from "./components/TitleForm";
import ImageForm from "./components/ImageForm";

const CourseMainCreation = () => {
  const initialData = {
    title: "title",
  };
  const descriptionInitialData = {
    description: "description",
  };
  const imageInitialData = {
    imageUrl: "imageUrl",
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Course setup</h1>
          <span className="text-sm text-slate-700">Complete all fields</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <div className="rounded-full bg-sky-200 p-1">
              <LayoutDashboard className="text-sky-800" />
            </div>
            <h2 className="text-xl">Customise your course</h2>
          </div>
          <TitleForm initialData={initialData} courseId={"dfsd"} />
          <DescriptionForm initialData={descriptionInitialData} courseId={"dfsd"} />
          <ImageForm initialData={descriptionInitialData} courseId={"dfsd"} />
        </div>
      </div>
    </div>
  );
};

export default CourseMainCreation;
