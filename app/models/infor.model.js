const db = require("../config/connect");
const util = require("util");
const bcrypt = require("bcrypt");
var salt = bcrypt.genSaltSync();
const dbQueryAsync = util.promisify(db.query).bind(db);

const inforAccount = (inforAccount) => {
  (this.ID = inforAccount.ID),
    (this.IDAccount = inforAccount.IDAccount),
    (this.Name = inforAccount.Name),
    (this.Age = inforAccount.Age),
    (this.Address = inforAccount.Address),
    (this.PhoneNumber = inforAccount.PhoneNumber),
    (this.Avatar = inforAccount.Avatar);
};

inforAccount.find = async (idAccount, results) => {
  try {
    const user = await dbQueryAsync(
      "SELECT * FROM infor_account WHERE IDAccount = ?",
      idAccount
    );
    return results(user);
  } catch (error) {
    return results({ success: false });
  }
};

//Customer

inforAccount.update = async (idAccount, avatarPath, data, results) => {
  try {
    if (!avatarPath) {
      await dbQueryAsync(
        "UPDATE infor_account SET Name = ?, Age = ?, Address = ?, PhoneNumber = ? WHERE IDAccount = ?",
        [data.Name, data.Age, data.Address, data.PhoneNumber, idAccount]
      );
      return results({
        success: true,
        message: "Cập nhật thông tin thành công !",
      });
    } else {
      await dbQueryAsync(
        "UPDATE infor_account SET Name = ?, Age = ?, Address = ?, PhoneNumber = ?, Avatar = ? WHERE IDAccount = ?",
        [
          data.Name,
          data.Age,
          data.Address,
          data.PhoneNumber,
          avatarPath,
          idAccount,
        ]
      );
      return results({
        success: true,
        message: "Cập nhật thông tin thành công !",
      });
    }
  } catch (error) {
    return results({ success: false });
  }
};

//Staff

inforAccount.getListStaff = async (results) => {
  const staffs = await dbQueryAsync(
    "SELECT a.Email, i.* FROM account a INNER JOIN infor_account i ON a.ID = i.IDAccount WHERE IDRole = 2"
  );

  return results({ success: true, listStaff: staffs });
};

inforAccount.addStaff = async (data, avatarPath, results) => {
  try {
    const users = await dbQueryAsync("SELECT * FROM account WHERE Email = ?", [
      data.Email,
    ]);
    if (users.length > 0) {
      return results({ success: false, message: "Username đã được sử dụng" });
    }
    const hash = await bcrypt.hash(data.Password, salt);

    const accountQuery = await dbQueryAsync(
      "INSERT INTO account (Email, Password, IDRole) VALUES (?, ?, ?)",
      [data.Email, hash, 2]
    );
    const userID = accountQuery.insertId;

    if (!avatarPath) {
      await dbQueryAsync(
        "INSERT INTO infor_account (IDAccount, Name, Age, Address, PhoneNumber) VALUES (?, ?, ?, ?, ?)",
        [userID, data.Name, data.Age, data.Address, data.PhoneNumber]
      );
      return results({
        success: true,
        message: "Tạo tài khoản nhân viên thành công (Không có Avatar) !",
      });
    } else {
      await dbQueryAsync(
        "INSERT INTO infor_account (IDAccount, Name, Age, Address, PhoneNumber, Avatar) VALUES (?, ?, ?, ?, ?, ?)",
        [
          userID,
          data.Name,
          data.Age,
          data.Address,
          data.PhoneNumber,
          avatarPath,
        ]
      );
      return results({
        success: true,
        message: "Tạo tài khoản nhân viên thành công !",
      });
    }
  } catch (error) {
    return results({ success: false, message: error.message });
  }
};

inforAccount.deleteStaff = async (idAccount, results) => {
  try {
    await dbQueryAsync(
      "DELETE FROM account WHERE ID = ? AND IDRole = 2",
      idAccount
    );
    return results({ success: true, message: "Xóa nhân viên thành công !" });
  } catch (error) {
    results({ success: false, message: error.message });
  }
};

module.exports = inforAccount;
