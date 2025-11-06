// Importações necessárias
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js'; 
import pontuacaoRoute from './routes/pontuacao.js'; 
import rankingRoutes from './routes/ranking.js';
import deleteUserRoute from './routes/deleteAuth.js';
import desempenhoRoutes from './routes/desempenho.js';

dotenv.config();

const app = express();
const port = 3000;

// Middlewares Globais
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Rotas
app.use('/auth', authRoutes);
app.use('/pontuacao', pontuacaoRoute);
app.use('/ranking', rankingRoutes);
app.use('/auth', deleteUserRoute);
app.use('/api/desempenho', desempenhoRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
