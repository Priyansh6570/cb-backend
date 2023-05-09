import catchAsyncError from "./catchAsyncError.js";
import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/errorHandler.js";
import User from "../models/userModel.js";
import Car from "../models/carModel.js";


const isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return next(new ErrorHandler('Login first to access this resource', 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    next();}
);
export default isAuthenticatedUser;

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role (${req.user.role}) is not allowed to access this resource`, 403));
        }
        next();
    }
}
export { authorizeRoles };

const checkCarOwnership = async (req, res, next) => {
    try {
      const car = await Car.findById(req.params.car_id);
      if (!car) {
        return res.status(404).json({
          success: false,
          message: 'Car not found',
        });
      }
  
      if (!req.user.isAdmin && car.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to update this car',
        });
      }
  
      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };
export { checkCarOwnership };