import express from 'express';
import helmet from 'helmet';
import errorMiddleware from './middleware/error.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';

const app = express();
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'nonce-123abc'", "firebase.google.com"],
    objectSrc: ["'none'"]
  },
  nonce: '123abc'
}));

app.use(cors({
    origin: 'https://piyansh-cb-demo.onrender.com', // replace with your frontend URL
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'], // add headers that you want to allow
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // add HTTP methods that you want to allow
    optionsSuccessStatus: 200 // return 200 status code for preflight requests
  }));

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// Route Imports 
import car from './routes/carRoute.js';
import user from './routes/userRoute.js';
import order from './routes/orderRoute.js';

app.use('/api/v1', car);
app.use('/api/v1', user);
app.use('/api/v1', order);

// Error Handler (last piece of middleware)
app.use(errorMiddleware);

export default app;