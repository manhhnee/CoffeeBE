const express = require("express");
const router = express.Router();
const accountController = require("../controllers/account.controllers");
const AuthController = require("../controllers/auth.controller");

router.post("/register", accountController.register);
router.post("/login", accountController.login);
router.put("/changePassword/:id", accountController.changePassword);

module.exports = router;
