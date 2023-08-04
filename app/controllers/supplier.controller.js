const supplierModel = require("../models/supplier.model");

class supplierController {
  show(req, res, next) {
    supplierModel.show((data) => {
      res.json(data);
    });
  }
  add(req, res, next) {
    supplierModel.add(req.body, (data) => {
      res.json(data);
    });
  }
  delete(req, res, next) {
    supplierModel.delete(req.params.id, (data) => {
      res.json(data);
    });
  }
  update(req, res, next) {
    supplierModel.update(req.params.id, req.body, (data) => {
      res.json(data);
    });
  }
}

module.exports = new supplierController();
