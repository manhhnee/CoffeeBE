const express = require("express");
var router = express.Router();
var coffeeController = require("../controllers/coffee.controller");
var upload = require("../config/CoffeeImage");
const Authentication = require("../controllers/auth.controller");
router.get("/", coffeeController.showAll);
router.get("/detail/:id", coffeeController.showOne);
router.post("/add", upload.single("Image"), coffeeController.add);
router.delete("/delete/:id", coffeeController.delete);
router.put("/update/:id", coffeeController.update);

module.exports = router;
