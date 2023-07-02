import express from 'express';
import helmet from 'helmet';
import errorMiddleware from './middleware/error.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import path from 'path';

const app = express();

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'", "*"],
    scriptSrc: ["'self'", "'nonce-123abc'", "*", "'unsafe-inline'", "'unsafe-eval'"],
    objectSrc: ["'none'"],
    imgSrc: ["'self'", "data:", "*"]
  },
  nonce: '123abc'
}));

// Enable CORS for your frontend domain
app.use(cors({
  origin: 'https://www.carsbecho.com',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  optionsSuccessStatus: 200
}));

app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '100mb'
}));
app.use(express.json({ limit: '100mb' }));
app.use(fileUpload());

// Route Imports
import car from './routes/carRoute.js';
import user from './routes/userRoute.js';
import order from './routes/orderRoute.js';
import subscription from './routes/subscriptionRoute.js';

app.use('/api/v1', car);
app.use('/api/v1', user);
app.use('/api/v1', order);
app.use('/api/v1', subscription);

// Serve static assets if in production
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'public_html')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public_html/index.html'));
});

// Error Handler (last piece of middleware)
app.use(errorMiddleware);

export default app;
