const materialsModel = require("../models/materials.model");

class materialsController {
  show(req, res, next) {
    materialsModel.show((data) => {
      res.json(data);
    });
  }
  add(req, res, next) {
    materialsModel.add(req.body, (data) => {
      res.json(data);
    });
  }
  delete(req, res, next) {
    materialsModel.delete(req.params.id, (data) => {
      res.json(data);
    });
  }
}

module.exports = new materialsController();
