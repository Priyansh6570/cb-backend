import express from "express";
import {
  newOrder,
  getAllOrders,
  deleteOrder,
  getOrder,
} from "../controllers/orderController.js";
const router = express.Router();

import isAuthenticatedUser from '../middleware/authentication.js';

router.route("/sellerContact/new").post(isAuthenticatedUser, newOrder);

router.route("/order/:id").get(isAuthenticatedUser, getOrder);

router
  .route("/orders/:id")
  .get(isAuthenticatedUser, getAllOrders);

router
  .route("/order/:id")
  .delete(isAuthenticatedUser, deleteOrder);

export default router;