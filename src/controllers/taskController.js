import Task from '../models/Task.js';
import Project from '../models/Project.js';

export const createTask = async (req, res) => {
  try {
    // Ensure project exists and belongs to user
   
    const project = await Project.findOne({ _id: req.body.project, owner: req.user.id });
    if (!project) return res.status(404).json({ message: 'Project not found or unauthorized' });

    const task = await Task.create({
      title: req.body.title,
      details: req.body.details,
      project: req.body.project,
      owner: String(req.user.id)
    });

    // Add task to project's tasks array
    project.tasks.push(task._id);
    await project.save();

    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user.id }).populate('project');
    res.json(tasks);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user.id }).populate('project');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found or unauthorized' });
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found or unauthorized' });

    // Remove task from its project's tasks array
    await Project.updateOne({ _id: task.project }, { $pull: { tasks: task._id } });

    res.status(204).end();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};