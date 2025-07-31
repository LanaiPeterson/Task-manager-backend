import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  description: { type: String, required: true },
  completed: { type: Boolean, default: false },
  text: { type: String, required: true }
});

const Task = mongoose.model('Task', taskSchema);

export default Task;