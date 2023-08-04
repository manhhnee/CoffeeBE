const db = require("../config/connect");
const util = require("util");
const dbQueryAsync = util.promisify(db.query).bind(db);

const rating = (rating) => {
  (this.ID = rating.ID),
    (this.IDCoffee = rating.IDCoffee),
    (this.IDAccount = rating.IDAccount),
    (this.Star = rating.Star),
    (this.Comment = rating.Comment);
};

rating.show = async (data, results) => {
  const ratings = await dbQueryAsync(
    "SELECT * FROM rating WHERE IDCoffee = ?",
    [data.IDCoffee]
  );
  let totalStars = 0;
  for (let i = 0; i < ratings.length; i++) {
    totalStars += ratings[i].Star;
  }
  let averageStars = (totalStars / ratings.length).toFixed(1);
  if (isNaN(averageStars)) averageStars = 0;
  return results({ ratings: ratings, averageStars: averageStars });
};

rating.add = async (data, results) => {
  await dbQueryAsync(
    "INSERT INTO rating(IDCoffee, IDAccount, Star, Comment) VALUES (?, ?, ?, ?)",
    [data.IDCoffee, data.IDAccount, data.Star, data.Comment]
  );
  return results({ success: true, message: "Comment thành công !" });
};

rating.delete = async (idRating, results) => {
  await dbQueryAsync("DELETE FROM rating WHERE id = ?", [idRating]);
  return results({ success: true, message: "Xóa comment thành công !" });
};

rating.update = async (idRating, data, results) => {
  await dbQueryAsync("UPDATE rating SET Star = ?, Comment = ? WHERE ID = ?", [
    data.Star,
    data.Comment,
    idRating,
  ]);
  return results({ success: true, message: "Sửa comment thành công !" });
};

module.exports = rating;
