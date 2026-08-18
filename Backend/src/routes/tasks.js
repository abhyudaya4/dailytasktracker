import express from "express";
import Task from "../models/Task.js";
import { requireAuth } from "../middleware/auth.js";
import mongoose from "mongoose";

const router = express.Router();


router.use(requireAuth);

router.get("/", async (req, res) => {
  const tasks = await Task.find({ userId: req.userId }).sort({ date: 1, createdAt: -1 });
  res.json({ tasks });
});

router.post("/", async (req, res) => {
  const { title, description, category, priority, date, time, recurring } = req.body;

  if (!title?.trim() || !date) {
    return res.status(400).json({ message: "Task title and date are required." });
  }

  const task = await Task.create({
    userId: req.userId,
    title: title.trim(),
    description: description || "",
    category: category || "Study",
    priority: priority || "Medium",
    date,
    time: time || "-",
    recurring: Boolean(recurring),
    status: "Pending",
  });

  res.status(201).json({ task });
});

router.patch("/:id", async (req, res) => {
  const allowed = ["title", "description", "category", "priority", "date", "time", "status", "recurring"];
  const updates = {};

  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    updates,
    { new: true, runValidators: true }
  );

  if (!task) return res.status(404).json({ message: "Task not found." });

  res.json({ task });
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check whether task ID was provided
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Task ID is required."
      });
    }

    // Check whether ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID."
      });
    }

    // Delete only the task belonging to the logged-in user
    const task = await Task.findOneAndDelete({
      _id: id,
      userId: req.userId
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found."
      });
    }

    res.json({
      success: true,
      message: "Task deleted successfully.",
      task
    });

  } catch (error) {
    console.error("Delete task error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete task."
    });
  }
});

export default router;
