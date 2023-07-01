import mongoose from 'mongoose';
const orderSchema = new mongoose.Schema({
    userOrder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    carOrder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
        required: true
    },
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    offer : {
        type: Number,
    },
});

export default mongoose.model('Order', orderSchema);