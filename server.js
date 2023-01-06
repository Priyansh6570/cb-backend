import express from 'express';
const app = express();
import data from './data.js';
import cors from 'cors'; 

app.use(cors({
    origin:'*', // allow to server to accept request from different origin
}));


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

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Serve at http://localhost:${port}`);
});