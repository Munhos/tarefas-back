import Express from 'express';
import routes from './routes/index.js';
import cors from "cors";

const app = Express();
const PORT = 3001;

app.use(Express.json());
app.use(cors());
app.use(routes);

app.listen(PORT, () => {
  console.log(`Server rodando na porta ${PORT}`);
});