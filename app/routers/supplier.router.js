const express = require("express");
const router = express.Router();
const supplierController = require("../controllers/supplier.controller");
const AuthController = require("../controllers/auth.controller");

router.get(
  "/",
  AuthController.verifyToken,
  AuthController.isAdmin,
  supplierController.show
);

router.post(
  "/add",
  AuthController.verifyToken,
  AuthController.isAdmin,
  supplierController.add
);

router.delete(
  "/delete",
  AuthController.verifyToken,
  AuthController.isAdmin,
  supplierController.delete
);

router.put(
  "/update",
  AuthController.verifyToken,
  AuthController.isAdmin,
  supplierController.update
);

module.exports = router;
