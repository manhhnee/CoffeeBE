const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth.controller");
const materialController = require("../controllers/materials.controller");

router.get(
  "/",
  AuthController.verifyToken,
  AuthController.isAdmin,
  materialController.show
);

router.post(
  "/add",
  AuthController.verifyToken,
  AuthController.isAdmin,
  materialController.add
);

router.delete(
  "/delete/:id",
  AuthController.verifyToken,
  AuthController.isAdmin,
  materialController.delete
);

module.exports = router;
