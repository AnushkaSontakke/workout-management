import express from 'express';
import userRoutes from './routes/userRoutes';
const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'workout management api is running',
  });
});
export default app;
