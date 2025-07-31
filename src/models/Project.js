import mongoose from 'mongoose';

const projectSchema= new mongoose.Schema({
 name: { type: String, required: true },
 description:{type: String, required: true },
 owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
 tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Project', projectSchema);