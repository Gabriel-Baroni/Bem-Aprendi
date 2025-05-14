import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js'; 

dotenv.config();

const app = express();
const port = 3000;

// Middlewares Globais
app.use(cors());
app.use(express.json());

// Rotas
app.use('/auth', authRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
