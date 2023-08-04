const materialsModel = require("../models/materials.model");

class materialsController {
  show(req, res, next) {
    materialsModel.show((data) => {
      res.json(data);
    });
  }
}

module.exports = new materialsController();
