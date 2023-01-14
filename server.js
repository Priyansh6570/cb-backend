import app from './app.js';
import data from './data.js';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';

//Handeling uncaught exceptions

process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  console.log('Shutting down the server due to uncaught exception');
  process.exit(1);
});


// config 

dotenv.config({ path: 'config/config.env' });

// connecting to database

connectDB();

app.use(
  cors({
    origin: '*', // allow to server to accept request from different origin
  })
);

app.get('/api/cars', (req, res) => {
  res.send(data.cars);
});

app.get('/api/cars/:id', (req, res) => {
  const car = data.cars.find((x) => x.id === Number(req.params.id));
  if (car) {
    res.send(car);
  } else {
    res.status(404).send({ message: 'Car Not Found' });
  }
});

// const port = process.env.PORT || 5000;

const server = app.listen(process.env.PORT, () => {
  console.log(`Serve at http://localhost:${process.env.PORT}`);
});

//unhandled promise rejection
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  console.log('Shutting down the server due to unhandled promise rejection');
  //close server & exit process
  server.close(() => {
    process.exit(1);
  });
});
