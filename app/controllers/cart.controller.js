const cartModel = require("../models/cart.model");

class cartCategory {
  showAll(req, res, next) {
    cartModel.showAll(req.user.ID, (data) => {
      res.json(data);
    });
  }
  add(req, res, next) {
    cartModel.add(req.user.ID, req.body, (data) => {
      res.json(data);
    });
  }
  delete(req, res, next) {
    cartModel.delete(req.user.ID, req.params.id, (data) => {
      res.json(data);
    });
  }
  update(req, res, next) {
    cartModel.update(req.user.ID, req.params.id, req.body.Amount, (data) => {
      res.json(data);
    });
  }
}

module.exports = new cartCategory();
