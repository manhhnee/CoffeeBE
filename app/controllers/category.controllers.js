const categoryModel = require("../models/category.model");

class categoryController {
  show(req, res) {
    categoryModel.show((data) => {
      res.json(data);
    });
  }
  add(req, res) {
    categoryModel.add(req.body, (data) => {
      res.json(data);
    });
  }

  delete(req, res) {
    categoryModel.delete(req.params.id, (data) => {
      res.json(data);
    });
  }
  update(req, res) {
    categoryModel.update(req.params.id, req.body, (data) => {
      res.json(data);
    });
  }
}

module.exports = new categoryController();
