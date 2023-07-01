import express from 'express';
import { getAllCars, createCar, updateCar, deleteCar, getCarDetails, approveCar, getAllPendingCars, getAllCarsBySeller} from '../controllers/carController.js';
import isAuthenticatedUser, {authorizeRoles, checkCarOwnership} from '../middleware/authentication.js';
 


const router = express.Router();

router.route('/cars').get(getAllCars);

router.route('/:userId/cars').get(getAllCarsBySeller);

router.route('/cars/pending').get(isAuthenticatedUser, authorizeRoles('admin', 'superUser'), getAllPendingCars);

router.route('/:id/car/new').post(isAuthenticatedUser, createCar);

router.route('/cars/pending/:id').put(isAuthenticatedUser, authorizeRoles('admin', 'superUser'), approveCar);

router.route('/:user_id/car/:car_id').put(isAuthenticatedUser, checkCarOwnership,  updateCar);

router.route('/car/:id').delete(isAuthenticatedUser, deleteCar);

router.route('/car/:id').get(getCarDetails);

// for later use 

// router.route('/review').put(isAuthenticatedUser, createCarReview);
// router.route('/reviews').get(getCarReviews);
// router.route('/reviews').delete(isAuthenticatedUser, deleteReview);

export default router;