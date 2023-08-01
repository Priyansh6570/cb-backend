import express from "express";
import {
    newSubscription,
    getAllSubscriptions,
    deleteSubscription,
} from "../controllers/subscriptionController.js";

const router = express.Router();

import isAuthenticatedUser from '../middleware/authentication.js';

router.route("/subscription/new").post(newSubscription);

router
    .route("/subscriptions")
    .get(getAllSubscriptions);

router
    .route("/subscription/:id")
    .delete(deleteSubscription);

export default router;