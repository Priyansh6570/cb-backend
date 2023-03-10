import express from 'express';
import { getAllCars, createCar, updateCar, deleteCar, getCarDetails, approveCar, getAllPendingCars, getAllCarsBySeller, createCarReview, getCarReviews, deleteReview } from '../controllers/carController.js';
import isAuthenticatedUser, {authorizeRoles} from '../middleware/authentication.js';
 


const router = express.Router();

router.route('/cars').get(getAllCars);

router.route('/:userId/cars').get(isAuthenticatedUser, getAllCarsBySeller);

router.route('/cars/pending').get(isAuthenticatedUser, authorizeRoles('admin'), getAllPendingCars);

router.route('/:id/car/new').post(isAuthenticatedUser, createCar);

router.route('/cars/pending/:id').put(isAuthenticatedUser, authorizeRoles('admin'), approveCar);

router.route('/:user_id/car/:car_id').put(isAuthenticatedUser, updateCar);

router.route('/car/:id').delete(isAuthenticatedUser, deleteCar);

router.route('/car/:id').get(getCarDetails);

router.route('/review').put(isAuthenticatedUser, createCarReview);

router.route('/reviews').get(getCarReviews);

router.route('/reviews').delete(isAuthenticatedUser, deleteReview);

export default router;