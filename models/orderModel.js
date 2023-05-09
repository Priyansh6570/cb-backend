import mongoose from 'mongoose';
const orderSchema = new mongoose.Schema({
   contactInfo: {
     address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    pincode: {
        type: Number,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    }},
    orderCar: [
        {
            name: {
                type: String,
                required: true,
            },
            image: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            car: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            }
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('Order', orderSchema);