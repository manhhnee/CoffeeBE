const jwt = require("jsonwebtoken");
require("dotenv").config();

class Authentication {
  verifyToken(req, res, next) {
    const tokenHeader = req.headers["authorization"];
    if (tokenHeader) {
      const token = tokenHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.cookie("token", token, { httpOnly: true });
        req.user = decoded;
        next();
      } catch (err) {
        return res.json({ success: false, message: "Yêu cầu đăng nhập" });
      }
    } else {
      return res.json({ success: false, message: "Yêu cầu đăng nhập" });
    }
  }
  isAdmin(req, res, next) {
    if (req.user.role === "admin") {
      next();
    } else {
      return res.status(401).json({
        success: false,
        message: "Yêu cầu đăng nhập với tư cách là Admin",
      });
    }
  }
  isStaff(req, res, next) {
    if (req.user.role === "staff") {
      next();
    } else {
      return res.status(401).json({
        success: false,
        message: "Yêu cầu đăng nhập với tư cách là Staff",
      });
    }
  }
  isCustomer(req, res, next) {
    if (req.user.role === "customer") {
      next();
    } else {
      return res.status(401).json({
        success: false,
        message: "Yêu cầu đăng nhập với tư cách là Customer",
      });
    }
  }
}

module.exports = new Authentication();
