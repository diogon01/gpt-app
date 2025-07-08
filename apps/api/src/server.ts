import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import routes from './routes';


const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
