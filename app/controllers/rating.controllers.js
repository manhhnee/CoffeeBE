const ratingModel = require("../models/rating.model");

class ratingController {
  show(req, res, next) {
    ratingModel.show({ IDCoffee: req.params.IDCoffee }, (data) => {
      res.json(data);
    });
  }
  add(req, res, next) {
    ratingModel.add(req.body, (data) => {
      res.json(data);
    });
  }
  delete(req, res, next) {
    ratingModel.delete(req.params.id, (data) => {
      res.json(data);
    });
  }
  update(req, res, next) {
    ratingModel.update(req.params.id, req.body, (data) => {
      res.json(data);
    });
  }
}

module.exports = new ratingController();
