var db = require("../config/connect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var salt = bcrypt.genSaltSync();
const util = require("util");
require("dotenv").config();

const dbQueryAsync = util.promisify(db.query).bind(db);

const Account = (account) => {
  (this.ID = account.ID),
    (this.Email = account.Email),
    (this.Password = account.Password),
    (this.IDRole = account.IDRole);
};

Account.register = async (data, result) => {
  try {
    const users = await dbQueryAsync("SELECT * FROM account WHERE Email = ?", [
      data.Email,
    ]);
    if (users && users.length > 0) {
      return result({ success: false, message: "Email đã được sử dụng" });
    }

    const hash = await bcrypt.hash(data.Password, salt);
    const user = await dbQueryAsync(
      "INSERT INTO account (Email, Password, IDRole) VALUES (?, ?, ?)",
      [data.Email, hash, data.IDRole]
    );

    if (user && user.insertId) {
      await dbQueryAsync(
        "INSERT INTO infor_account (IDAccount, Name, Age, PhoneNumber, Address) VALUES(?, ?, ?, ?, ?)",
        [user.insertId, data.Name, data.Age, data.PhoneNumber, data.Address]
      );

      const today = new Date();
      await dbQueryAsync(
        "INSERT INTO cart (IDAccount, CreatedDate) VALUES(?, ?)",
        [user.insertId, today]
      );

      return result({ success: true, message: "Đăng ký thành công" });
    } else {
      throw new Error("Không thể tạo tài khoản");
    }
  } catch (err) {
    return result({ success: false, message: "Đã xảy ra lỗi" });
  }
};

Account.login = async (data, result) => {
  try {
    const users = await dbQueryAsync("SELECT * FROM account WHERE Email = ?", [
      data.Email,
    ]);
    if (users.length === 0) {
      return result({
        success: false,
        message: "Không có tài khoản nào được tìm thấy",
      });
    }

    const user = users[0];
    const role = await dbQueryAsync("SELECT * FROM role WHERE id = ?", [
      user.IDRole,
    ]);

    const match = await bcrypt.compare(data.Password, user.Password);
    if (!match) {
      return result({ success: false, message: "Sai mật khẩu" });
    }
    const payload = { ID: user.ID, role: role[0].RoleName };
    const key = process.env.JWT_SECRET;
    const token = jwt.sign(payload, key, { expiresIn: "1d" });

    result({ success: true, token: token, role: role[0].RoleName });
  } catch (err) {
    result({ success: false, message: err.message });
  }
};

Account.changePassword = async (idAccount, data, result) => {
  try {
    const user = await dbQueryAsync("SELECT * FROM account WHERE ID = ?", [
      idAccount,
    ]);
    const password = await bcrypt.compare(data.Password, user[0].Password);
    if (!password) {
      return result({ success: false, message: "Mật khẩu cũ không đúng" });
    } else if (data.Password === data.newPassword) {
      return result({
        success: false,
        message: "Mật khẩu mới trùng mật khẩu cũ",
      });
    } else if (data.newPassword !== data.againPassword) {
      return result({ success: false, message: "Không khớp mật khẩu mới" });
    } else {
      const hash = await bcrypt.hash(data.newPassword, salt);
      dbQueryAsync("UPDATE account SET Password = ? WHERE ID = ?", [
        hash,
        idAccount,
      ]);
      return result({ success: true, message: "Đổi mật khẩu thành công" });
    }
  } catch (err) {
    return result({ error: false, message: err.message });
  }
};

module.exports = Account;
