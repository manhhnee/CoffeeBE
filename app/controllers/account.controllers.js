const accountModel = require("../models/account.models");

class accountController {
  register(req, res) {
    accountModel.register(req.body, (data) => {
      res.status(210).send(data);
    });
  }
  login(req, res) {
    accountModel.login(req.body, (data) => {
      res.json(data);
    });
  }
  changePassword(req, res) {
    accountModel.changePassword(req.params.id, req.body, (data) => {
      res.json(data);
    });
  }
}
module.exports = new accountController();
