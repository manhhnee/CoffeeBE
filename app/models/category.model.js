const db = require("../config/connect");
const util = require("util");
const dbQueryAsync = util.promisify(db.query).bind(db);

const category = (category) => {
  (this.ID = category.ID),
    (this.CategoryName = category.CategoryName),
    (this.Image = category.Image);
};

category.show = async (results) => {
  const category = await dbQueryAsync("SELECT * FROM category");
  return results({ success: true, data: category });
};

category.add = async (data, results) => {
  try {
    await dbQueryAsync(
      "INSERT INTO category (CategoryName, Image) VALUES (?, ?)",
      [data.CategoryName, data.Image]
    );
    return results({ success: true, message: "Thêm category thành công!" });
  } catch (error) {
    return results({ success: false, message: "Có lỗi ở databse" });
  }
};

category.delete = async (idCategory, results) => {
  try {
    await dbQueryAsync("DELETE FROM category WHERE ID = ?", idCategory);
    return results({ success: true, message: "Xóa thành công!" });
  } catch (error) {
    return results({ success: false, message: "Có lỗi ở databse" });
  }
};

category.update = async (idCategory, data, results) => {
  try {
    await dbQueryAsync(
      "UPDATE category SET CategoryName = ?, Image = ? WHERE ID = ?",
      [data.CategoryName, data.Image, idCategory]
    );
    return results({ success: true, message: "Sửa thành công!" });
  } catch (error) {
    return results({ success: false, message: "Có lỗi ở databse" });
  }
};

module.exports = category;
