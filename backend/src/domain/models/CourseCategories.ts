import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
    name: string; // Category name
    description?: string; // Optional description
    isActive?: boolean; // Status to indicate if the category is active
    createdAt?: Date; // Auto-managed by Mongoose
    updatedAt?: Date; // Auto-managed by Mongoose
    parentCategoryId?: string | null;
    isDeleted?: boolean
}

// Define the Category schema
const CategorySchema: Schema = new Schema(
    {
      name: { type: String, required: true, unique: true, trim: true },
      description: { type: String, default: "" },
      parentCategoryId: {
        type: Schema.Types.ObjectId,
        ref: "CourseCategory",
        default: null, // Null for root categories
      },
      isActive: { type: Boolean, default: true },
      isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
  ); 

  const CourseCategory = mongoose.model<ICategory>("CourseCategory", CategorySchema);
export default CourseCategory;