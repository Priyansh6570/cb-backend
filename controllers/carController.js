import Car from '../models/carModel.js';
import User from '../models/userModel.js';
import ErrorHandler from '../utils/errorHandler.js';
// import catchAsyncError from '../middleware/catchAsyncError.js';
import ApiFeatures from '../utils/apiFeatures.js';
import cloudinary from 'cloudinary';

// create car but not approved yet
const createCar = async (req, res, next) => {
  try {
    let images = [];

    // Check if the image field is a string
    if (typeof req.body.image === 'string') {
      images.push(req.body.image);
    } else {
      // If it's an array of objects, assume it contains multiple images
      images = req.body.image.map((imageObj) => imageObj.url);
    }

    const imagesLinks = [];

    // for (let i = 0; i < images.length; i++) {
    //   const result = await cloudinary.v2.uploader.upload(images[i], {
    //     folder: 'cars',
    //     width: 1920,
    //     crop: 'scale',
    //   });

    for (let i = 0; i < images.length; i++) {
  const result = await cloudinary.v2.uploader.upload(images[i], {
    folder: 'cars',
    width: 1000, // Adjust the width to fit your website's design
    crop: 'scale',
    quality: 'auto:good', // Use an appropriate quality setting for JPEG images
    fetch_format: 'auto', // Automatically select the best format (JPEG, PNG, WebP)
    flags: 'progressive', // Enable progressive rendering for JPEG images
    lazy: true, // Enable lazy loading
  });

      const imageLink = {
        public_id: result.public_id,
        url: result.secure_url,
      };

      imagesLinks.push(imageLink);
    }

    // Modify the carData object to store the Cloudinary URL in the image field
    req.body.image = imagesLinks;

    const carData = { ...req.body, user: req.params.id };

    const car = await Car.create(carData);

    // Decrease user's credit by 1
    // find user by id

    const user = await User.findById(req.params.id);

    user.credit -= 1;

    await user.save();

    res.status(201).json({
      success: true,
      car,
      message: 'Car Sent for approval',
      user: req.user,
    });
  } catch (error) {
    console.log(error);
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

    car.verified = req.body.verified; 

    const approvedCar = await car.save(); 

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
  const carCount = await Car.countDocuments({verified:false});

  try {
    const apifeatures = new ApiFeatures(Car.find({verified:false}), req.query);
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

// Get all cars
const getAllCars = async (req, res) => {
  const resPerPage = 9;
  const currentPage = req.query.page || 1;

  try {
    const carCount = await Car.countDocuments({ verified: true });
    const notVerified = await Car.countDocuments({ verified: false });

    const keyword = req.query.keyword || [];

    const skip = (currentPage - 1) * resPerPage;

    const apifeatures = new ApiFeatures(
      Car.find({
        verified: true,
      }).populate('user', ['name', 'expireLimit', 'credit', 'role']).lean().sort({ createdAt: -1 }).allowDiskUse(true).skip(skip).limit(resPerPage),
      req.query
    )
      .search()
      .filter();

    const cars = await apifeatures.query;

    const totalPages = Math.ceil(carCount / resPerPage);

    res.status(200).json({
      success: true,
      cars,
      currentPage,
      totalPages,
      notVerified,
      carCount,
      resPerPage,
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
  const resPerPage = 9;
  const carCount = await Car.countDocuments({ user: req.params.userId });

  try {
    const apifeatures = new ApiFeatures(
      Car.find({ user: req.params.userId }).sort({ createdAt: -1 }),
      req.query
    );
    const cars = await apifeatures.query;
    res.status(200).json({
      success: true,
      cars,
      carCount,
      resPerPage,
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
    const car = await Car.findById(req.params.id).populate('user', ['name', 'avatar', 'mobile', 'role', 'city', 'address', 'dealershipName', 'tagline']).lean();
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


const updateCar = async (req, res, next) => {
  try {
    // Images Start Here
    let images = [];

    if (typeof req.body.images === 'string') {
      images.push(req.body.images);
    } else if (Array.isArray(req.body.images)) { // Validate if it's an array
      images = req.body.images;
    }

    if (Array.isArray(images)) { 
      // Deleting Images From Cloudinary
      for (let i = 0; i < Math.min(images.length, car.images.length); i++) {
        await cloudinary.v2.uploader.destroy(car.images[i]?.public_id);
      }

      const imagesLinks = [];

      for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
          folder: 'cars',
        });

        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }

      req.body.images = imagesLinks;
    }

    const car = await Car.findByIdAndUpdate(
      req.params.car_id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!car || car.user.toString() !== req.params.user_id) {
      return res.status(404).json({
        success: false,
        message: 'Car not found or not owned by this seller',
      });
    }

    res.status(200).json({
      success: true,
      car: car,
      message: 'Car updated successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

export { updateCar };

// Delete car -- Admin

const deleteCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return next(new ErrorHandler('Car not found', 404));
    }

    // Delete car photos from Cloudinary
    if (car.image && car.image.length > 0) {
      for (const imageLink of car.image) {
        // Extract the public_id from the image URL
        const public_id = imageLink.public_id;

        // Delete the image from Cloudinary
        await cloudinary.v2.uploader.destroy(public_id);
      }
    }

    req.user.credit += 1;
    await req.user.save();

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
// export const createCarReview = catchAsyncError(async (req, res, next) => {
//   const { rating, comment, carId } = req.body;
//   const review = {
//     user: req.user._id,
//     name: req.user.name,
//     rating: Number(rating),
//     comment
//   }
//   const car = await Car.findById(carId);
//   const isReviewed = car.reviews.find( r => r.user.toString() === req.user._id.toString());
//   if (isReviewed) {
//     car.reviews.forEach(review => {
//       if (review.user.toString() === req.user._id.toString()) {
//         review.comment = comment;
//         review.rating = rating;
//       }
//     })
//   }
//   else {
//     car.reviews.push(review);
//     car.numOfReviews = car.reviews.length;
//   }
//   car.ratings = car.reviews.reduce((acc, item) => item.rating + acc, 0) / car.reviews.length;
//   await car.save({ validateBeforeSave: false });
//   res.status(200).json({
//     success: true
//   })
// });

// // Get car reviews => /api/v1/reviews
// export const getCarReviews = catchAsyncError(async (req, res, next) => {
//   const car = await Car.findById(req.query.id);

//   if(!car) {
//     return next(new ErrorHandler('Car not found', 404));
//   }

//   res.status(200).json({
//     success: true,
//     reviews: car.reviews
//   })
// });

// // Delete car review => /api/v1/reviews
// export const deleteReview = catchAsyncError(async (req, res, next) => {
//   const car = await Car.findById(req.query.carId);

//   if(!car) {
//     return next(new ErrorHandler('Car not found', 404));
//   }

//   const reviews = car.reviews.filter(review => review._id.toString() !== req.query.id.toString());

//   const numOfReviews = reviews.length;

//   const ratings = car.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

//   await Car.findByIdAndUpdate(req.query.carId, {
//     reviews,
//     ratings,
//     numOfReviews
//   }, {
//     new: true,
//     runValidators: true,
//     useFindAndModify: false
//   })

//   res.status(200).json({
//     success: true
//   })
// });