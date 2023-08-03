const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controllers");

router.get("/", categoryController.show);
router.post("/add", categoryController.add);
router.delete("/delete", categoryController.delete);
router.put("/update", categoryController.update);

module.exports = router;
