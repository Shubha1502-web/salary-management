import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import employeeRoutes from './routes/employeeRoutes';
import insightRoutes from './routes/insightRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/employees', employeeRoutes);
app.use('/api/insights', insightRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;