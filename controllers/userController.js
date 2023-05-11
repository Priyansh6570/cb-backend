import ErrorHandler from '../utils/errorHandler.js';
import catchAsyncError from '../middleware/catchAsyncError.js';
import Car from '../models/carModel.js';
import User from '../models/userModel.js';
import sendToken from '../utils/jwtToken.js';
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto';
import cloudinary from 'cloudinary';

// Register a user => /api/v1/register
export const registerUser = catchAsyncError(async (req, res, next) => {
  
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });
    
    const { name, email, password, mobile } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    mobile,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });

  sendToken(user, 201, res);
});

// Login user => /api/v1/login
export const loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  // Checks if email and password is entered by user
  if (!email || !password) {
    return next(new ErrorHandler('Please enter email & password', 400));
  }

  // Finding user in database
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorHandler('Invalid Email or Password', 401));
  }

  // Checks if password is correct or not
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler('Invalid Email or Password', 401));
  }

  sendToken(user, 200, res);
});

// Logout user => /api/v1/logout
export const logout = catchAsyncError(async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'Logged out',
  });
});

// Forgot password => /api/v1/password/forgot
export const forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler('User not found with this email', 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get('host')}/password/reset/${resetToken}`;

  const message = `Your password reset token is as follow:\n\n${resetPasswordUrl}\n\nIf you have not requested this email, then ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'CarsBecho Password Recovery',
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to: ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset password => /api/v1/password/reset/:token
export const resetPassword = catchAsyncError(async (req, res, next) => {
  // Hash URL token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        'Password reset token is invalid or has been expired',
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler('Password does not match', 400));
  }

  // Setup new password
  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// Get currently logged in user details => /api/v1/me
export const getUserProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    token: req.cookies.token,
    user,
  });
});

// wish list of a user

const addToWishList = async (req, res, next) => {
  const { carId } = req.body;
  const { _id } = req.user;
  try {
    const user = await User.findById(_id);
    const alreadyInWishList = user.wishList.find((r) => r.toString() === carId.toString());
    let userUpdate;

    if (alreadyInWishList) {
      // Remove the car from wishlist
      userUpdate = await User.findByIdAndUpdate(_id, { $pull: { wishList: carId } }, { new: true });
      res.status(200).json({
        success: true,
        message: 'Car removed from wish list',
      });
    } else {
      // Add the car to wishlist
      userUpdate = await User.findByIdAndUpdate(_id, { $push: { wishList: carId } }, { new: true });

      res.status(200).json({
        success: true,
        message: 'Car added to wish list',
      });
    }

    // Optional: You can send the updated wishlist back in the response if needed
    const updatedWishlist = userUpdate.wishList;
    // ...
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};


export { addToWishList };

// Get WISHLIST of currently logged in user => /api/v1/wishlist
export const getWishList = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate('wishList');
  res.status(200).json({
    success: true,
    wishList: user.wishList,
  });
});

// Save User Address => /api/v1/me/save-address
export const saveAddress = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  user.address = req.body.address;
  await user.save();

  res.status(200).json({
    success: true,
  });
});


// Update / Change password => /api/v1/password/update
export const updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // Check previous user password
  const isMatched = await user.comparePassword(req.body.oldPassword);
  if (!isMatched) {
    return next(new ErrorHandler('Old password is incorrect', 400));
  }

  if(req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler('Password does not match', 400));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendToken(user, 200, res);
});

// Update user profile => /api/v1/me/update
export const updateProfile = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id);

    const imageId = user.avatar[0].public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, { 
      folder: "avatars",
      width: 150,
      crop: "scale",
      quality: 100,
    });

    newUserData.avatar = [{
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    }];
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});


// Get all users => /api/v1/admin/users
export const allUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// Get user details => /api/v1/admin/user/:id
export const getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler(`User does not found with id: ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Get all cars created by user => /api/v1/user/:id/cars
export const getUserCars = catchAsyncError(async (req, res, next) => {
  const cars = await Car.find({ user: req.params.id });

  res.status(200).json({
    success: true,
    cars,
  });
});

// Update user profile Admin => /api/v1/admin/user/:id
export const updateUser = catchAsyncError(async (req, res, next) => {

  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false
    })

  res.status(200).json({
    success: true,
    message: 'User updated successfully'
  });
});

// Delete user Admin => /api/v1/admin/user/:id
export const deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler(`User does not found with id: ${req.params.id}`, 404));
  }

  // Remove avatar from cloudinary: TODO

  await user.remove();

  res.status(200).json({
    success: true,
    message: 'User deleted successfully'
  });
});
