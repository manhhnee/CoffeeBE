const db = require("../config/connect");
const util = require("util");
const dbQueryAsync = util.promisify(db.query).bind(db);

const supplier = (supplier) => {
  (this.ID = supplier.ID),
    (this.Name = supplier.Name),
    (this.Address = supplier.Address);
};

supplier.show = async (results) => {
  try {
    const suppliers = await dbQueryAsync("SELECT * FROM supplier");
    return results({ success: true, data: suppliers });
  } catch (error) {
    return results({ success: false, message: error.message });
  }
};

supplier.add = async (data, results) => {
  try {
    await dbQueryAsync("INSERT INTO supplier (Name, Address) VALUES (?, ?)", [
      data.Name,
      data.Address,
    ]);
    return results({
      success: true,
      message: "Thêm nhà cung cấp thành công !",
    });
  } catch (error) {
    return results({
      success: false,
      message: error.message,
    });
  }
};

supplier.delete = async (idSupplier, results) => {
  try {
    await dbQueryAsync("DELETE FROM supplier WHERE ID = ?", [idSupplier]);
    return results({
      success: true,
      message: "Xóa nhà cung cấp thành công !",
    });
  } catch (error) {
    return results({
      success: false,
      message: error.message,
    });
  }
};

supplier.update = async (idSupplier, data, results) => {
  try {
    await dbQueryAsync(
      "UPDATE supplier SET Name = ?, Address = ? WHERE ID = ?",
      [data.Name, data.Address, idSupplier]
    );
    return results({
      success: true,
      message: "Thay đổi thông tin nhà cung cấp thành công !",
    });
  } catch (error) {
    return results({
      success: false,
      message: error.message,
    });
  }
};

module.exports = supplier;
