const inforModel = require("../models/infor.model");

class inforController {
  getInforAccount(req, res, next) {
    inforModel.find(req.user.ID, (data) => {
      res.json({ user: data, role: req.user.role });
    });
  }

  //customer
  update(req, res, next) {
    const avatarPath = req.file
      ? `http://localhost:5000/${req.file.path}`
      : null;
    inforModel.update(req.user.ID, avatarPath, req.body, (data) => {
      res.json(data);
    });
  }

  //staff
  getListStaff(req, res, next) {
    inforModel.getListStaff((data) => {
      res.json(data);
    });
  }

  addStaff(req, res, next) {
    const avatarPath = req.file
      ? `http://localhost:5000/${req.file.path}`
      : null;

    inforModel.addStaff(req.body, avatarPath, (data) => {
      res.json(data);
    });
  }

  deleteStaff(req, res, next) {
    inforModel.deleteStaff(req.params.id, (data) => {
      res.json(data);
    });
  }

  updateStaff(req, res, next) {
    const avatarPath = req.file
      ? `http://localhost:5000/${req.file.path}`
      : null;
    inforModel.update(req.params.ID, avatarPath, req.body, (data) => {
      res.json(data);
    });
  }
}

module.exports = new inforController();
