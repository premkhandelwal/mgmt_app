// src/app.ts
import express, { Application } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import routes from './routes';

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URL || '', {  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Mongo connection error:', err));

app.use('/api', routes);

export default app;
