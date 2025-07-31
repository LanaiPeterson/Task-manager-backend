import Task from '../models/Task.js';
import Project from '../models/Project.js';

export const createTask = async (req, res) => {
  try {
    const taskData = {
      title: req.body.title,
      details: req.body.details,
      owner: req.user.id,
      completed: req.body.completed || false
    };

    // If project is specified, verify it exists and belongs to user
    if (req.body.project) {
      const project = await Project.findOne({ _id: req.body.project, owner: req.user.id });
      if (!project) return res.status(404).json({ message: 'Project not found or unauthorized' });
      taskData.project = req.body.project;
      
      // Add task to project's tasks array
      const task = await Task.create(taskData);
      project.tasks.push(task._id);
      await project.save();
      return res.status(201).json(task);
    }

    // Create task without project
    const task = await Task.create(taskData);
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
    console.log(`Attempting to delete task with ID: ${req.params.id} for user: ${req.user.id}`);
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!task) {
      console.log(`Task not found or unauthorized: ${req.params.id}`);
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    console.log(`Task deleted successfully: ${task._id}`);

    // Remove task from its project's tasks array if task had a project
    if (task.project) {
      console.log(`Removing task from project: ${task.project}`);
      await Project.updateOne({ _id: task.project }, { $pull: { tasks: task._id } });
    }

    res.status(204).end();
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(400).json({ message: error.message });
  }
};