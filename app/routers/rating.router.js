const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/rating.controllers");
const AuthController = require("../controllers/auth.controller");

router.get("/:IDCoffee", ratingController.show);
router.post(
  "/add",
  AuthController.verifyToken,
  AuthController.isCustomer,
  ratingController.add
);
router.delete(
  "/delete/:id",
  AuthController.verifyToken,
  AuthController.isCustomer,
  ratingController.delete
);
router.put(
  "/update/:id",
  AuthController.verifyToken,
  AuthController.isCustomer,
  ratingController.update
);

module.exports = router;
