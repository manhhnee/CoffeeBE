const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const AuthController = require("../controllers/auth.controller");

router.get(
  "/",
  AuthController.verifyToken,
  AuthController.isCustomer,
  cartController.showAll
);

router.post(
  "/add",
  AuthController.verifyToken,
  AuthController.isCustomer,
  cartController.add
);

router.put(
  "/update",
  AuthController.verifyToken,
  AuthController.isCustomer,
  cartController.update
);

router.delete(
  "/delete/:id",
  AuthController.verifyToken,
  AuthController.isCustomer,
  cartController.delete
);

module.exports = router;
