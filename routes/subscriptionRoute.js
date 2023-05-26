import express from "express";
import {
    newSubscription,
    getAllSubscriptions,
    deleteSubscription,
} from "../controllers/subscriptionController.js";

const router = express.Router();

import isAuthenticatedUser from '../middleware/authentication.js';

router.route("/subscription/new").post(isAuthenticatedUser, newSubscription);

router
    .route("/subscriptions")
    .get(isAuthenticatedUser, getAllSubscriptions);

router
    .route("/subscription/:id")
    .delete(isAuthenticatedUser, deleteSubscription);

export default router;