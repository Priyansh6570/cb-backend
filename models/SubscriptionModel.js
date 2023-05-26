import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    planName: {
        type: String,
        required: true,
    },
    planPrice: {
        type: String,
        required: true,
    },
    planDuration: {
        type: Number,
        required: true,
    },
    planCredits: {
        type: Number,
        required: true,
    },
    planDescription: {
        type: String,   
        required: true,  
    },
    validateSub: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
