import Express from 'express';
const router = Express.Router();
import {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserProfile,
  getWishList,
  addToWishList,
  updatePassword,
  updateProfile,
  getUserDetails,
  saveAddress,
  allUsers,
  updateUser,
  updateCreditAndExpireLimit,
  deleteUser,
} from '../controllers/userController.js';
import isAuthenticatedUser, {authorizeRoles } from '../middleware/authentication.js';

router.route('/register').post(registerUser);

router.route('/login').post(loginUser);

router.route('/me').get(isAuthenticatedUser ,getUserProfile);

router.route('/password/forgot').post(forgotPassword);

router.route('/password/reset/:token').put(resetPassword);

router.route('/wishlist/add').put(addToWishList);

router.route('/wishlist/me').get(getWishList);

router.route('/me/save-address').put(isAuthenticatedUser, saveAddress);

router.route('/logout').get(logout);

router.route('/password/update').put(isAuthenticatedUser, updatePassword);

router.route('/me/update').put(updateProfile); 

router.route('/updateCreditAndExpireLimit').put(isAuthenticatedUser, authorizeRoles('admin', 'superUser', 'drm'), updateCreditAndExpireLimit);

router.route('/admin/users').get(authorizeRoles('admin', 'superUser', 'drm'), allUsers); 

router.route('/admin/user/:id').get(getUserDetails).put(isAuthenticatedUser, authorizeRoles('admin', 'superUser'), updateUser).delete(isAuthenticatedUser, authorizeRoles('admin', 'superUser'), deleteUser);

export default router;
