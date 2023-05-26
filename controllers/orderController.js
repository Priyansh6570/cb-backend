import Order from "../models/orderModel.js";
import Car from "../models/carModel.js";
import User from "../models/userModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncError.js";
// Create new Order
export const newOrder = catchAsyncErrors(async (req, res, next) => {
  const { userId, userOrderId, carOrderId } = req.body;

  const order = await Order.create({ user:userId, userOrder: userOrderId, carOrder: carOrderId });

  res.status(201).json({
    success: true,
    order,
    message: "Request Sent successfully",
  });
});

// Get Single Order
export const getOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
  .populate('userOrder', ['name', 'email', 'avatar', 'mobile', 'address'])
  .populate('carOrder', ['make', 'model', 'varient', 'year', 'Km_Driven', 'fuel', 'transmission', 'color', 'no_of_owners', 'RTO', 'city', 'price', 'image'])

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// Get all Orders
export const getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id })
    .populate('userOrder', ['name', 'email', 'avatar', 'mobile', 'address'])
    .populate('carOrder', ['make', 'model', 'varient', 'year', 'Km_Driven', 'fuel', 'transmission', 'color', 'no_of_owners', 'RTO', 'city', 'price', 'image']).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    orders,
  });
});


// Delete Order
export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
    message: "Order deleted successfully",
  });
});
