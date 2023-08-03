const express = require("express");
const inforController = require("../controllers/infor.controllers");
const AuthController = require("../controllers/auth.controller");
const upload = require("../config/Avatar");
const router = express.Router();

router.get(
  "/customer",
  AuthController.verifyToken,
  AuthController.isCustomer,
  inforController.getInforAccount
);

router.get(
  "/admin",
  AuthController.verifyToken,
  AuthController.isAdmin,
  inforController.getInforAccount
);

router.get(
  "/staff",
  AuthController.verifyToken,
  AuthController.isStaff,
  inforController.getInforAccount
);

router.put(
  "/update/:id",
  AuthController.verifyToken,
  AuthController.isCustomer,
  upload.single("Avatar"),
  inforController.update
);

router.get(
  "/listStaff",
  AuthController.verifyToken,
  AuthController.isAdmin,
  inforController.getListStaff
);

router.post(
  "/listStaff/add",
  AuthController.verifyToken,
  AuthController.isAdmin,
  upload.single("Avatar"),
  inforController.addStaff
);

router.delete(
  "/listStaff/delete/:id",
  AuthController.verifyToken,
  AuthController.isAdmin,
  inforController.deleteStaff
);

router.put(
  "/listStaff/update/:id",
  AuthController.verifyToken,
  AuthController.isAdmin,
  inforController.updateStaff
);

module.exports = router;
