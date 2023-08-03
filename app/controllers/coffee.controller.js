const coffeeModel = require("../models/coffee.model");

class coffeeController {
  showAll(req, res, next) {
    const {
      search = " ",
      category = "",
      limit = 10,
      page = 1,
      DESC_Price = false,
    } = req.query;
    var filter = {
      search,
      category,
      limit,
      page,
      DESC_Price,
    };
    coffeeModel.find(filter, (data) => {
      res.json(data);
    });
  }
  showOne(req, res, next) {
    coffeeModel.find({ id: req.params.id }, (data) => {
      res.json(data);
    });
  }
  add(req, res, next) {
    const coffeePath = req.file
      ? `http://localhost:5000/${req.file.path}`
      : null;
    coffeeModel.add(req.body, coffeePath, (data) => {
      res.json(data);
    });
  }
  delete(req, res) {
    coffeeModel.delete(req.params.id, (data) => {
      res.json(data);
    });
  }
  update(req, res) {
    const coffeePath = req.file
      ? `http://localhost:5000/${req.file.path}`
      : null;
    coffeeModel.update(req.params.id, req.body, coffeePath, (data) => {
      res.json(data);
    });
  }
}

module.exports = new coffeeController();
