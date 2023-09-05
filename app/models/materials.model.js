const db = require("../config/connect");
const util = require("util");
const materialsController = require("../controllers/materials.controller");
const dbQueryAsync = util.promisify(db.query).bind(db);

const materials = (materials) => {
  (this.ID = materials.ID),
    (this.Name = materials.Name),
    (this.IDSupplier = materials.IDSupplier),
    (this.PublicationDate = materials.PublicationDate),
    (this.ImportPrice = materials.ImportPrice),
    (this.Amount = materials.Amount),
    (this.Image = materials.Image);
};

materials.show = async (results) => {
  try {
    const material = await dbQueryAsync(
      "SELECT m.Name, m.Image, m.PublicationDate, m.ImportPrice, m.Amount, s.Name, s.Address FROM materials m LEFT JOIN supplier s ON m.IDSupplier = s.ID GROUP BY m.PublicationDate"
    );
    return results({ data: material });
  } catch (error) {
    return results({ success: false, message: error.message });
  }
};

materials.add = async (data, results) => {
  try {
    const date = new Date();
    await dbQueryAsync(
      `INSERT INTO materials (Name, IDSupplier, Image, PublicationDate, ImportPrice, Amount) VALUES(?, ?, ?, ?, ?, ?)`,
      [
        data.Name,
        data.IDSupplier,
        data.Image,
        date,
        data.ImportPrice,
        data.Amount,
      ]
    );
    return results({ success: true, message: "Thêm nguyên liệu thành công !" });
  } catch (error) {
    return results({ success: false, message: error.message });
  }
};

materials.delete = async (IDMaterials, results) => {
  console.log(IDMaterials);
  try {
    await dbQueryAsync("DELETE FROM materials WHERE ID = ?", [IDMaterials]);
    return results({ success: false, message: "Xóa nguyên liệu thành công !" });
  } catch (error) {
    return results({ success: false, message: error.message });
  }
};

module.exports = materials;
