import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import issueRoutes from './routes/issues';
import packageRoutes from './routes/packages';
import paymentRoutes from './routes/payments';
import templateRoutes from './routes/templates';
import userRoutes from './routes/users';
import portfolioRoutes from './routes/portfolios';
import uploadRoutes from './routes/upload';


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/api/users', userRoutes);
app.use('/api/admin/issues', issueRoutes);
app.use('/api/admin/packages', packageRoutes);
app.use('/api/admin/payments', paymentRoutes);
app.use('/api/admin/templates', templateRoutes);
app.use('/api/portfolios', portfolioRoutes);
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use('/api/upload', uploadRoutes);

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then((conn) => {
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      console.log(`📌 Connected to Database: ${conn.connection.name}`);
  })
  .catch(err => console.log(err));


app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});