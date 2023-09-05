const orderModel = require("../models/order.model");

class orderController {
  createOneOrder(req, res, next) {
    orderModel.createOneOrder(
      req.user.ID,
      req.body,
      req.body.Address,
      req.body.IDPayment,
      (data) => {
        res.json(data);
      }
    );
  }
  createAllOrders(req, res, next) {
    orderModel.createAllOrders(
      req.user.ID,
      req.body.orderItems,
      req.body.Address,
      req.body.IDPayment,
      (data) => {
        res.json(data);
      }
    );
  }

  cancelOrder(req, res, next) {
    orderModel.cancelOrder(req.params.id, (data) => {
      res.json(data);
    });
  }

  getOrderDetails(req, res, next) {
    orderModel.getOrderDetails(req.params.id, (data) => {
      res.json(data);
    });
  }

  getHistoryOrderList(req, res, next) {
    orderModel.getHistoryOrderList(req.user.ID, (data) => {
      res.json(data);
    });
  }

  getOrderList(req, res, next) {
    orderModel.getOrderList((data) => {
      res.json(data);
    });
  }
  getStatusOrderList(req, res, next) {
    orderModel.getStatusOrderList(req.params.id, (data) => {
      res.json(data);
    });
  }
  changeStatus(req, res, next) {
    orderModel.changeStatus(req.params.id, (data) => {
      res.json(data);
    });
  }
  revenue(req, res, next) {
    orderModel.revenue(req.body, (data) => {
      res.json(data);
    });
  }
  revenueOfYear(req, res, next) {
    orderModel.revenueOfYear((data) => {
      res.json(data);
    });
  }
}

module.exports = new orderController();
