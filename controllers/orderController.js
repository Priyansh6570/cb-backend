import Order from "../models/orderModel.js";
import Car from "../models/carModel.js";
import User from "../models/userModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncError.js";
import sendWhatsappAlert from "../utils/sendWhatsappAlert.js";
// Create new Order
export const newOrder = catchAsyncErrors(async (req, res, next) => {
  const { userId, userOrderId, carOrderId, offer } = req.body;
  const order = await Order.create({ user: userId, userOrder: userOrderId, carOrder: carOrderId, offer });

  // Populate the userOrder, carOrder, and user fields
  await order.populate('userOrder', ['name', 'email', 'mobile', 'address']);

  await order.populate('carOrder', ['make', 'model', 'varient', 'year', 'Km_Driven', 'fuel', 'transmission', 'color', 'no_of_owners', 'RTO', 'city', 'price', '_id']);

  await order.populate('user', ['name', 'email', 'mobile', 'address', 'role']);

  const {
    mobile: userMobile,
    name: userName,
    role: userRole,
    email: userEmail,
    address: userAddress,
  } = order.user;

  const {
    make: carMake,
    model: carModel,
    varient: carVarient,
    year: carYear,
    Km_Driven: carKm_Driven,
    fuel: carFuel,
    transmission: carTransmission,
    color: carColor,
    no_of_owners: carNo_of_owners,
    RTO: carRTO,
    city: carCity,
    price: carPrice,
  } = order.carOrder;

  const {
    name : userOrderName,
    email : userOrderEmail,
    mobile : userOrderMobile,
    address : userOrderAddress
  } = order.userOrder;

  const carDetailsUrl = `https://www.carsbecho.com/car/${carOrderId}`;

  // message for seller
  const message = {
    userOrderName,
    userName,
    userOrderMobile,
    carYear: carYear.toString(),
    carMake,
    carModel,
    carPrice : carPrice.toLocaleString('en-IN'),
    carFuel,
    carTransmission,
    carDetailsUrl
  };
const userMobileWithCountryCode = `+91${userMobile}`;
await sendWhatsappAlert(userMobileWithCountryCode, message);

  res.status(201).json({
    success: true,
    order,
    message: "Request sent successfully",
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
