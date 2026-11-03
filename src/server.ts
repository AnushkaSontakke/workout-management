import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import connectDB from './config/database';
const PORT = process.env.PORT;
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
  });
};
startServer();
