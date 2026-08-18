import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, default: "" },
    category: { type: String, enum: ["Study", "Work", "Personal", "Health"], default: "Study" },
    priority: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
    date: { type: String, required: true },
    time: { type: String, default: "-" },
    status: { type: String, enum: ["Done", "Pending"], default: "Pending" },
    recurring: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
