import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";

interface FormControlProps {
    control: any; // You can refine this based on your form library (e.g., `useForm` from React Hook Form)
    field: {
      value: any; // Field value, e.g., the current videos array
      onChange: (value: any) => void; // Function to update the field value
      name: string; // Field name (e.g., `lectures[0].videos[1].file`)
      ref?: React.Ref<HTMLInputElement>; // Reference to the input element
    };
  }
interface VideoUploadProps {
    lectureIndex: number; // Index of the current lecture
    videoIndex: number; // Index of the current video
    control: FormControlProps["control"]; // Form control object
    field: FormControlProps["field"]; // Field object
  }

const VideoUpload:React.FC<VideoUploadProps> = ({ lectureIndex, videoIndex, control, field }) => {
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});

  const handleFileChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newPreviewUrl = URL.createObjectURL(file);

      // Update the form field value
      field.onChange([
        ...field.value.slice(0, videoIndex),
        { ...field.value[videoIndex], file },
        ...field.value.slice(videoIndex + 1),
      ]);

      // Update the preview URL state for this specific lecture and video
      setPreviewUrls((prev) => ({
        ...prev,
        [`${lectureIndex}-${videoIndex}`]: newPreviewUrl,
      }));
    }
  };

  const videoPreviewUrl = previewUrls[`${lectureIndex}-${videoIndex}`];

  return (
    <div>
      <FormField
        name={`lectures.${lectureIndex}.videos.${videoIndex}.file`}
        control={control}
        rules={{
          required: "Please upload a file",
          validate: (file) => (file ? true : "File is required"),
        }}
        render={({ field: fileField }) => (
          <FormItem>
            <FormLabel>Upload Video</FormLabel>
            <FormControl>
              <Input
                className="bg-white dark:bg-slate-700"
                type="file"
                accept="video/*"
                onChange={(e) => {
                  if (videoPreviewUrl) {
                    URL.revokeObjectURL(videoPreviewUrl); // Clean up old preview
                  }
                  handleFileChange(e); // Handle new file selection
                  fileField.onChange(e.target.files?.[0]); // Update validation state
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {videoPreviewUrl && (
        <div className="bg-gray-100 dark:bg-slate-800 p-2 rounded-md">
          <h2 className="pb-1">Newly chosen video:</h2>
          <video controls width="300" key={videoPreviewUrl}>
            <source src={videoPreviewUrl} />
          </video>
          <div>{videoPreviewUrl}</div>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;
