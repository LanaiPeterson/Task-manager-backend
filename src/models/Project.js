import mongoose from 'mongoose';

const projectSchema= new mongoose.Schema({
 name: { type: String, required: true },
 description:{type: String, required: true },
 owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Project', projectSchema);