import Car from "../models/carModel.js";
import User from "../models/userModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncError.js";
import Subscription from "../models/SubscriptionModel.js";

// Create new Subscription
export const newSubscription = catchAsyncErrors(async (req, res, next) => {
    const { userId, planName, planPrice, planDuration, planCredits, planDescription, planType, city, address, dealershipName, tagline, role } = req.body;
    await User.findByIdAndUpdate(userId, { city, address, dealershipName, tagline, role, planType });
    const subscription = await Subscription.create({ userId, planName, planPrice, planDuration, planCredits, planDescription });

    res.status(201).json({
        success: true,
        subscription,
        message: "Request Sent successfully",
    });
});

// Get All Subscriptions
export const getAllSubscriptions = catchAsyncErrors(async (req, res, next) => {
    const subscriptions = await Subscription.find({validateSub : false}).populate('userId', ['name' ,'dealershipName', 'credit', 'expireLimit', 'role', 'mobile', 'address', 'city', 'tagLine']).sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        subscriptions,
    });
}
);

// Delete Subscription
export const deleteSubscription = catchAsyncErrors(async (req, res, next) => {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
        return next(new ErrorHandler("Subscription not found", 404));
    }

    await subscription.remove();

    res.status(200).json({
        success: true,
        message: "Subscription Deleted Successfully",
    });
}
);