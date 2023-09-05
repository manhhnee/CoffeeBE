const db = require("../config/connect");
const util = require("util");

const dbQueryAsync = util.promisify(db.query).bind(db);

const cart = (cart) => {
  (this.ID = cart.ID),
    (this.IDAccount = cart.IDAccount),
    (this.CreatedDate = cart.CreatedDate);
};

cart.showAll = async (IDAccount, results) => {
  try {
    const cart = await dbQueryAsync(
      "SELECT * FROM cart WHERE IDAccount = ?",
      IDAccount
    );
    var cartID = cart[0].ID;
    const query = `SELECT ci.ID, ci.IDCart, ci.IDCoffee, ci.Amount, co.Name, co.Price, c.CategoryName as Category FROM cart_item ci INNER JOIN coffee co ON ci.IDCoffee = co.ID INNER JOIN category c ON c.ID = co.IDCategory WHERE ci.IDCart = ?`;
    const cartItem = await dbQueryAsync(query, cartID);
    return results({ cartItem });
  } catch (error) {
    return results({ success: false, message: error.message });
  }
};

cart.add = async (IDAccount, data, results) => {
  try {
    const cart = await dbQueryAsync(
      "SELECT * FROM cart WHERE IDAccount = ?",
      IDAccount
    );
    const cartItems = await dbQueryAsync(
      "SELECT * FROM cart_item WHERE IDCoffee = ? AND IDCart = ?",
      [data.IDCoffee, cart[0].ID]
    );
    if (cartItems.length > 0) {
      await dbQueryAsync("UPDATE cart_item SET Amount = ? WHERE ID = ?", [
        parseInt(cartItems[0].Amount) + parseInt(data.Amount),
        cartItems[0].ID,
      ]);
      return results({
        success: true,
        message: "Update số lượng sản phẩm vào giỏ hàng thành công",
      });
    } else {
      await dbQueryAsync(
        "INSERT cart_item (IDCoffee, IDCart, Amount) VALUES (?, ?, ?)",
        [data.IDCoffee, cart[0].ID, data.Amount]
      );
      return results({
        success: true,
        message: "Thêm vào giỏ hàng thành công",
      });
    }
  } catch (error) {
    return results({ success: false, message: error.message });
  }
};

cart.delete = async (IDAccount, IDCartItem, results) => {
  try {
    await dbQueryAsync("DELETE FROM cart_item WHERE ID = ?", IDCartItem);
    return results({
      success: true,
      message: "Xóa sản phẩm khỏi giỏ hàng thành công !",
    });
  } catch (error) {
    return results({ success: false, message: error.message });
  }
};

cart.update = async (IDAccount, IDCartItem, Amount, results) => {
  try {
    if (Amount <= 0) {
      await dbQueryAsync("DELETE FROM cart_item WHERE ID = ?", IDCartItem);
      return results({
        success: true,
        message: "Đã xóa sản phẩm khỏi giỏ hàng",
      });
    } else {
      await dbQueryAsync("UPDATE cart_item SET Amount = ? WHERE ID = ?", [
        Amount,
        IDCartItem,
      ]);
      return results({
        success: true,
        message: "Update số lượng sản phẩm thành công",
      });
    }
  } catch (error) {
    return results({ success: false, message: error.message });
  }
};

module.exports = cart;
