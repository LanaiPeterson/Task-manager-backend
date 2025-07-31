import Project from "../models/Project.js";
import Task from "../models/Task.js";

export const createProject = async (req, res) => {
  try {
    console.log("req.user:", req.user);
    const project = await Project.create({ ...req.body, owner: req.user.id });
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user.id }).populate("tasks");
    res.json(projects);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner: req.user.id }).populate("tasks");
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      req.body,
      { new: true }
    );
    if (!project) {
      return res.status(404).json({ message: "Project not found or unauthorized" });
    }
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    console.log(`Attempting to delete project with ID: ${req.params.id} for user: ${req.user.id}`);
    const project = await Project.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!project) {
      console.log(`Project not found or unauthorized: ${req.params.id}`);
      return res.status(404).json({ message: "Project not found or unauthorized" });
    }

    console.log(`Project deleted successfully: ${project._id}`);

    // Remove project reference from all tasks that belong to this project
    console.log(`Removing project reference from tasks associated with project: ${req.params.id}`);
    const updateResult = await Task.updateMany(
      { project: req.params.id, owner: req.user.id },
      { $unset: { project: 1 } }
    );
    console.log(`Updated ${updateResult.modifiedCount} tasks to remove project reference`);

    res.status(204).end();
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(400).json({ message: error.message });
  }
};