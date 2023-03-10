import Express from 'express';
const router = Express.Router();
import {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updatePassword,
  updateProfile,
  getUserDetails,
  allUsers,
  updateUser,
  deleteUser,
  getUserCars
} from '../controllers/userController.js';
import isAuthenticatedUser, {authorizeRoles } from '../middleware/authentication.js';

router.route('/register').post(registerUser);

router.route('/login').post(loginUser);

router.route('/password/forgot').post(forgotPassword);

router.route('/password/reset/:token').put(resetPassword);

router.route('/logout').get(logout);

router.route('/me').get(isAuthenticatedUser ,getUserProfile);

router.route('/password/update').put(isAuthenticatedUser, updatePassword);

router.route('/me/update').put(isAuthenticatedUser, updateProfile);

router.route('/admin/users').get(isAuthenticatedUser, authorizeRoles('admin'), allUsers);

router.route('/user/:id/cars').get(isAuthenticatedUser, getUserCars);

router.route('/admin/user/:id').get(isAuthenticatedUser, authorizeRoles('admin'), getUserDetails).put(isAuthenticatedUser, authorizeRoles('admin'), updateUser).delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUser);

export default router;
