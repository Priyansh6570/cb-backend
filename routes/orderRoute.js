import express from "express";
import {
  newOrder,
  getAllOrders,
  deleteOrder,
  getOrder,
} from "../controllers/orderController.js";
const router = express.Router();

import isAuthenticatedUser from '../middleware/authentication.js';

router.route("/sellerContact/new").post(newOrder);

router.route("/order/:id").get(getOrder);

router
  .route("/orders/:id")
  .get( getAllOrders);

router
  .route("/order/:id")
  .delete(deleteOrder);

export default router;