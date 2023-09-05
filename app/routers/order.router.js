const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const authController = require("../controllers/auth.controller");

router.post(
  "/",
  authController.verifyToken,
  authController.isCustomer,
  orderController.createOneOrder
);
router.post(
  "/all",
  authController.verifyToken,
  authController.isCustomer,
  orderController.createAllOrders
);

router.put("/cancel/:id", orderController.cancelOrder);

router.get("/detail/:id", orderController.getOrderDetails);

router.get(
  "/history",
  authController.verifyToken,
  authController.isCustomer,
  orderController.getHistoryOrderList
);

router.get("/orderList", orderController.getOrderList);

router.get("/statusOrderList/:id", orderController.getStatusOrderList);

router.put("/changeStatus/:id", orderController.changeStatus);

router.get("/revenue", orderController.revenue);

router.get("/revenueOfYear", orderController.revenueOfYear);

module.exports = router;
