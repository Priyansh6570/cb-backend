import express from 'express';
import errorMiddleware from './middleware/error.js';
const app = express();
import cookieParser from 'cookie-parser';

app.use(express.json());
app.use(cookieParser())

// Route Imports 
import car from './routes/carRoute.js';
import user from './routes/userRoute.js';

app.use('/api/v1', car);
app.use('/api/v1', user)

// Error Handler (Should be last piece of middleware)
app.use(errorMiddleware);

export default app;
