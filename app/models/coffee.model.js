const db = require("../config/connect");
const util = require("util");
const dbQueryAsync = util.promisify(db.query).bind(db);

const coffee = (coffee) => {
  (this.ID = coffee.ID),
    (this.IDCategory = coffee.IDCategory),
    (this.IDSize = coffee.IDSize),
    (this.Name = coffee.Name),
    (this.Description = coffee.Description),
    (this.Image = coffee.Image),
    (this.Price = coffee.Price);
};

coffee.find = async (data, results) => {
  if (!data.id) {
    try {
      let query = `SELECT c.id, c.IDCategory, c.IDSize, c.Name, c.Description, c.Image, c.Price, i.CategoryName 
      FROM coffee c
      LEFT JOIN (SELECT ID, CategoryName FROM Category) i ON c.IDCategory = i.ID
      WHERE c.Name LIKE '%${data.search}%'`;
      if (data.category) {
        query += ` AND c.IDCategory = ${data.category}`;
      }
      const offset = (data.page - 1) * data.limit;
      if (data.DESC_Price == 1)
        query += ` ORDER BY c.Price DESC LIMIT ${data.limit} OFFSET ${offset}`;
      else if (data.DESC_Price == 2)
        query += ` ORDER BY c.Price ASC LIMIT ${data.limit} OFFSET ${offset}`;
      else query += ` ORDER BY c.id DESC LIMIT ${data.limit} OFFSET ${offset}`;

      const listCoffee = await dbQueryAsync(query);
      var totalPage = parseInt(listCoffee.length / data.limit) + 1;

      results({ listCoffee: listCoffee, totalPage: totalPage });
    } catch (error) {
      results({ success: false, error: error.message });
    }
  } else {
    try {
      const queryCoffee = `SELECT c.*, s.SizeName, cat.CategoryName, cat.Image AS CategoryImage
        FROM coffee c
        LEFT JOIN Size s ON c.IDSize = s.ID
        LEFT JOIN Category cat ON c.IDCategory = cat.ID
        WHERE c.id = ?`;

      const coffee = await dbQueryAsync(queryCoffee, data.id);
      const ratings = await dbQueryAsync(
        `SELECT rating.ID, rating.IDAccount, rating.Comment, rating.Star, infor_account.Name, infor_account.Avatar 
        FROM rating 
        INNER JOIN infor_account ON rating.IDAccount = infor_account.IDAccount 
        WHERE rating.IDCoffee = ?`,
        coffee[0].ID
      );
      let stars = 0;
      for (let i = 0; i < ratings.length; i++) {
        stars += ratings[i].Star;
      }
      stars = (stars / ratings.length).toFixed(2);
      if (isNaN(stars)) stars = 0;
      results({ coffee: coffee[0], ratings: ratings, stars: stars });
    } catch (error) {
      results({ success: false, error: "Không tồn tại món này !" });
    }
  }
};

coffee.add = async (data, coffeePath, results) => {
  try {
    const insertSql =
      "INSERT INTO coffee (IDCategory, IDSize, Name, Price, Description, Image) VALUES (?, ?, ?, ?, ?, ?)";

    if (coffeePath === null) {
      await dbQueryAsync(
        "INSERT INTO coffee (IDCategory, IDSize, Name, Price, Description) VALUES (?, ?, ?, ?, ?)",
        [data.IDCategory, data.IDSize, data.Name, data.Price, data.Description]
      );

      return results({
        success: true,
        message: "Thêm thành công (Không có ảnh)",
      });
    } else {
      await dbQueryAsync(insertSql, [
        data.IDCategory,
        data.IDSize,
        data.Name,
        data.Price,
        data.Description,
        coffeePath,
      ]);

      return results({
        success: true,
        message: "Thêm thành công!",
      });
    }
  } catch (error) {
    return results({
      success: false,
      message: error.message,
    });
  }
};

coffee.delete = async (idCoffee, results) => {
  await dbQueryAsync("DELETE FROM coffee WHERE id = ?", idCoffee)
    .then(() => {
      return results({ success: true, message: "Xóa thành công" });
    })
    .catch((err) => {
      return results({ success: false, message: "Xóa thất bại" });
    });
};

coffee.update = async (idCoffee, data, coffeePath, results) => {
  if (!coffeePath) {
    await dbQueryAsync(
      "UPDATE coffee SET IDCategory = ?, IDSize = ?, Name = ?, Description = ?, Price = ? WHERE ID = ?",
      [
        data.IDCategory,
        data.IDSize,
        data.Name,
        data.Description,
        data.Price,
        idCoffee,
      ]
    );
    return results({ success: true, message: "Sửa thành công (Không có ảnh)" });
  } else {
    await dbQueryAsync(
      "UPDATE coffee SET IDCategory = ?, IDSize = ?, Name = ?, Description = ?, Image = ?, Price = ? WHERE ID = ?",
      [
        data.IDCategory,
        data.IDSize,
        data.Name,
        data.Description,
        coffeePath,
        data.Price,
        idCoffee,
      ]
    );
    return results({ success: true, message: "Sửa thành công" });
  }
};
module.exports = coffee;
