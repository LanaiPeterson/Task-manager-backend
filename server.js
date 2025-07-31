import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './src/routes/authRouter.js';
import tasks from './src/routes/Tasks.js';
import projects from './src/routes/projects.js';

dotenv.config();

const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/tasks', tasks);
app.use('/api/projects', projects);

const PORT = process.env.PORT || 3000;
app.get ('/', (req, res) => {
  res.send('Welcome to the Task Manager API');
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Backend started on port", PORT);
    });
  })
  .catch(err => console.error(err));


