import Car from '../models/carModel.js';
import ErrorHandler from '../utils/errorHandler.js';
import catchAsyncError from '../middleware/catchAsyncError.js';
import ApiFeatures from '../utils/apiFeatures.js';

// create car but not approved yet

const createCar = async (req, res, next) => {
  try {
    const car = await Car.create(req.body);
    res.status(201).json({
      success: true,
      car,
      message: 'Car Sent for approval'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

export { createCar };

// Admin can approve the car submitted by a seller and are pending for approval.

const approveCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return next(new ErrorHandler('Car not found', 404));
    }
const carData = {
  verified: req.body.verified,
};

    const approvedCar = await Car.findByIdAndUpdate(req.params.id, carData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      success: true,
      approvedCar,
      message: 'Car approved successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

export { approveCar };

// Get all cars pending for approval

const getAllPendingCars = async (req, res) => {
  const resperpage = 5;
  const carCount = await Car.countDocuments({verified:false});

  try {
    const apifeatures = new ApiFeatures(Car.find({verified:false}), req.query).search().filter().pagination(resperpage);
    const cars = await apifeatures.query;
    res.status(200).json({
      success: true,
      cars,
      carCount,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

export { getAllPendingCars };



// Get all cars that are approved by admin
 
const getAllCars = async (req, res) => {

  const resperpage = 5;
  const carCount = await Car.countDocuments({verified:true});

  try {
    const apifeatures = new ApiFeatures(Car.find({verified:true}), req.query).search().filter().pagination(resperpage);
    const cars = await apifeatures.query;
    res.status(200).json({
      success: true,
      cars,
      carCount,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

export { getAllCars };

// Get all cars from a specific seller

const getAllCarsBySeller = async (req, res) => {
  const resperpage = 5;
  const carCount = await Car.countDocuments({user:req.params.userId});

  try {
    const apifeatures = new ApiFeatures(Car.find({user:req.params.userId}), req.query).search().filter().pagination(resperpage);
    const cars = await apifeatures.query;
    res.status(200).json({
      success: true,
      cars,
      carCount,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

export { getAllCarsBySeller };

//Get car details

const getCarDetails = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return next(new ErrorHandler('Car not found', 404));
    }

    res.status(200).json({
      success: true,
      car,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

export { getCarDetails };

// Update car of a seller -- Admin

const updateCar = async (req, res, next) => {

  try{
    const car = await Car.findOneAndUpdate({ _id: req.params.car_id, user: req.params.user_id }, req.body, {
    new: true,
    runValidators: true,
});
if (!car) {
    return res.status(404).json({
      success: false,
      message: 'Car not found or not owned by this seller',
      });
      }
      res.status(200).json({
      success: true,
      car: car,
      message: 'Car updated successfully',
      });}
      catch (error) {
        res.status(400).json({
          success: false,
          error: error.message,
        });
      };
    };
//   try {
//     let car = await Car.findById(req.params.car_id);
//     if (!car) {
//       return next(new ErrorHandler('Car not found', 404));
//     }
//     car = await Car.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//       useFindAndModify: false,
//     });
//     res.status(200).json({
//       success: true,
//       car,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//         error: error.message,
//     });
//   }
// };

export { updateCar };

// Delete car -- Admin

const deleteCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return next(new ErrorHandler('Car not found', 404));
    }
    await car.remove();
    res.status(200).json({
      success: true,
      message: 'Car is deleted successfully.',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

export { deleteCar };

// Create new review => /api/v1/review
export const createCarReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, carId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment
  }
  const car = await Car.findById(carId);
  const isReviewed = car.reviews.find( r => r.user.toString() === req.user._id.toString());
  if (isReviewed) {
    car.reviews.forEach(review => {
      if (review.user.toString() === req.user._id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    })
  }
  else {
    car.reviews.push(review);
    car.numOfReviews = car.reviews.length;
  }
  car.ratings = car.reviews.reduce((acc, item) => item.rating + acc, 0) / car.reviews.length;
  await car.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true
  })
});

// Get car reviews => /api/v1/reviews
export const getCarReviews = catchAsyncError(async (req, res, next) => {
  const car = await Car.findById(req.query.id);

  if(!car) {
    return next(new ErrorHandler('Car not found', 404));
  }

  res.status(200).json({
    success: true,
    reviews: car.reviews
  })
});

// Delete car review => /api/v1/reviews
export const deleteReview = catchAsyncError(async (req, res, next) => {
  const car = await Car.findById(req.query.carId);

  if(!car) {
    return next(new ErrorHandler('Car not found', 404));
  }

  const reviews = car.reviews.filter(review => review._id.toString() !== req.query.id.toString());

  const numOfReviews = reviews.length;

  const ratings = car.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

  await Car.findByIdAndUpdate(req.query.carId, {
    reviews,
    ratings,
    numOfReviews
  }, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  })

  res.status(200).json({
    success: true
  })
});