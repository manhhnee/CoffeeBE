const db = require("../config/connect");
const util = require("util");
const dbQueryAsync = util.promisify(db.query).bind(db);

const order = (order) => {
  (this.ID = order.ID),
    (this.IDStatus = order.IDStatus),
    (this.IDAccount = order.IDAccount),
    (this.IDPayment = order.IDPayment),
    (this.OrderDate = order.OrderDate),
    (this.OrderAddress = order.OrderAddress),
    (this.totalPrice = order.totalPrice);
};

order.createOneOrder = async (
  IDAccount,
  orderItem,
  address,
  IDPayment,
  results
) => {
  try {
    var today = new Date();
    if (parseInt(orderItem.Quantity) > parseInt(orderItem.Amount)) {
      return results({
        success: false,
        message: "Số lượng đặt vượt quá sản phẩm trong kho",
      });
    } else {
      let order = await dbQueryAsync(
        "INSERT INTO orders (IDStatus, IDAccount, IDPayment, OrderDate, OrderAddress) VALUES (?, ?, ?, ?, ?)",
        [1, IDAccount, IDPayment, today, address]
      );
      const orderID = order.insertId;
      var totalPrice = 0;
      totalPrice += parseInt(orderItem.Price * orderItem.Quantity);
      await dbQueryAsync(
        "INSERT INTO order_item (IDOrder, IDCoffee, Quantity, FixPrice) VALUES (?, ?, ?, ?)",
        [
          orderID,
          orderItem.IDCoffee,
          orderItem.Quantity,
          parseInt(orderItem.Price * orderItem.Quantity),
        ]
      );
      let coffee = await dbQueryAsync("SELECT * FROM coffee WHERE ID = ?", [
        orderItem.IDCoffee,
      ]);
      await dbQueryAsync("UPDATE coffee SET Amount = ? WHERE ID = ?", [
        parseInt(coffee[0].Amount - orderItem.Quantity),
        coffee[0].ID,
      ]);
      await dbQueryAsync("UPDATE orders SET totalPrice = ? WHERE ID = ?", [
        totalPrice,
        orderID,
      ]);
      return results({
        success: true,
        message: "Mua sản phẩm thành công",
      });
    }
  } catch (error) {
    return results({ success: false, message: error.message });
  }
};

order.createAllOrders = async (
  IDAccount,
  orderItems,
  Address,
  IDPayment,
  results
) => {
  try {
    var today = new Date();
    for (var i = 0; i < orderItems.length; i++) {
      if (orderItems[i].Quantity > orderItems[i].Amount) {
        return results({
          success: false,
          message: "Số lượng đặt vượt quá sản phẩm trong kho",
        });
      }
    }
    let order = await dbQueryAsync(
      "INSERT INTO orders (IDStatus, IDAccount, IDPayment, OrderDate, OrderAddress) VALUES (?, ?, ?, ?, ?)",
      [1, IDAccount, IDPayment, today, Address]
    );
    const orderID = order.insertId;
    var totalPrice = 0;
    orderItems.forEach(async (orderItem) => {
      totalPrice += parseInt(orderItem.Price * orderItem.Quantity);
      await dbQueryAsync(
        "INSERT INTO order_item (IDOrder, IDCoffee, Quantity, FixPrice) VALUES (?, ?, ?, ?)",
        [
          orderID,
          orderItem.IDCoffee,
          orderItem.Quantity,
          parseInt(orderItem.Price * orderItem.Quantity),
        ]
      );
      const coffee = await dbQueryAsync("SELECT * FROM coffee WHERE ID = ?", [
        orderItem.IDCoffee,
      ]);
      await dbQueryAsync("UPDATE coffee SET Amount = ? WHERE ID = ?", [
        parseInt(coffee[0].Amount) - parseInt(orderItem.Quantity),
        coffee[0].ID,
      ]);

      await dbQueryAsync("DELETE FROM cart_item WHERE ID = ?", [
        orderItem.IDCart,
      ]);
    });
    await dbQueryAsync("UPDATE orders SET totalPrice = ? WHERE ID = ?", [
      totalPrice,
      orderID,
    ]);
    return results({
      success: true,
      message: "Mua đơn hàng thành công",
    });
  } catch (error) {
    return results({ success: false, message: error.message });
  }
};

order.cancelOrder = async (IDOrder, results) => {
  const orders = await dbQueryAsync(
    "SELECT * FROM orders WHERE ID = ?",
    IDOrder
  );
  if (orders[0].IDStatus >= 2) {
    return results({
      success: false,
      message: "Đơn hàng đang trên đường tới, không thể hủy !",
    });
  } else {
    await dbQueryAsync("UPDATE orders SET IDStatus = 4 WHERE ID = ?", [
      IDOrder,
    ]);
    const orderItems = await dbQueryAsync(
      "SELECT * FROM order_item WHERE IDOrder = ?",
      [IDOrder]
    );
    orderItems.forEach(async (orderItem) => {
      const coffee = await dbQueryAsync("SELECT * FROM coffee WHERE ID = ?", [
        orderItem.IDCoffee,
      ]);
      await dbQueryAsync("UPDATE coffee SET Amount = ? WHERE ID = ?", [
        parseInt(orderItem.Quantity) + parseInt(coffee[0].Amount),
        orderItem.IDCoffee,
      ]);
    });
    results({
      success: true,
      message: "Hủy đơn hàng thành công",
    });
  }
};

order.getOrderDetails = async (IDOrder, results) => {
  try {
    const orderInfor = await dbQueryAsync(
      "SELECT o.*, s.StatusName, p.PaymentMethod FROM orders o INNER JOIN status s ON o.IDStatus = s.ID INNER JOIN payment p ON o.IDPayment = p.ID WHERE o.ID = ?",
      [IDOrder]
    );
    const orderDetails = await dbQueryAsync(
      "SELECT oi.*, c.ID, c.IDCategory, c.IDSize, c.Name, c.Image FROM order_item oi INNER JOIN coffee c ON oi.IDCoffee = c.ID WHERE oi.IDOrder = ?",
      [IDOrder]
    );
    return results({ orderInfor: orderInfor[0], orderDetails: orderDetails });
  } catch (error) {
    return results({ success: false, message: error.message });
  }
};

order.getHistoryOrderList = async (IDAccount, results) => {
  try {
    const orderList = await dbQueryAsync(
      "SELECT o.*, s.StatusName, p.PaymentMethod FROM orders o INNER JOIN status s ON o.IDStatus = s.ID INNER JOIN payment p ON o.IDPayment = p.ID WHERE o.IDAccount = ?",
      [IDAccount]
    );
    return results({ orderList });
  } catch (error) {
    return results({ success: false, message: error.message });
  }
};

order.getOrderList = async (results) => {
  try {
    const orderList = await dbQueryAsync(
      "SELECT o.*, i.* FROM orders o INNER JOIN infor_account i ON o.IDAccount = i.ID GROUP BY o.ID DESC"
    );
    return results({ orderList });
  } catch (error) {
    return results({ success: false, message: error.message });
  }
};

order.getStatusOrderList = async (IDStatus, results) => {
  try {
    const orderList = await dbQueryAsync(
      "SELECT o.*, i.* FROM orders o INNER JOIN infor_account i ON o.IDAccount = i.ID WHERE o.IDStatus = ? GROUP BY o.ID DESC",
      [IDStatus]
    );
    return results({ orderList });
  } catch (error) {
    return results({ success: false, message: error.message });
  }
};

order.changeStatus = async (IDOrder, results) => {
  const orders = await dbQueryAsync("SELECT * FROM orders WHERE ID = ?", [
    IDOrder,
  ]);
  if (orders[0].IDStatus === 3 || orders[0].IDStatus === 4) {
    return results({
      message: "Không thể thay đổi trạng thái đơn hàng nữa",
    });
  } else {
    await dbQueryAsync("UPDATE orders SET IDStatus = ? WHERE ID = ?", [
      orders[0].IDStatus + 1,
      IDOrder,
    ]);
    results({
      success: true,
      message: "Duyệt đơn hàng thành công",
    });
  }
};

order.revenue = async (data, results) => {
  let today = new Date();
  let query =
    "SELECT o.*, i.* FROM orders o INNER JOIN infor_account i ON o.IDAccount = i.ID WHERE o.IDStatus = 3";

  if (data.dateFrom && data.dateTo) {
    query += ` AND DATE(o.OrderDate) >= '${data.dateFrom}' AND DATE(o.OrderDate) <= '${data.dateTo}'`;
  } else {
    query += ` AND DATE(o.OrderDate) >= '${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}' AND DATE(o.OrderDate) <= '${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}'`;
  }
  const successOrder = await dbQueryAsync(query);
  let totalPrice = 0;
  for (var i = 0; i < successOrder.length; i++) {
    totalPrice += successOrder[i].totalPrice;
  }
  return results({
    order: successOrder,
    totalPrice: totalPrice,
  });
};

order.revenueOfYear = async (results) => {
  // Tong san pham ban duoc trong 1 nam
  const totalNumberProductSold = await dbQueryAsync(
    "SELECT SUM(oi.Quantity) AS total_books_sold FROM order_item oi INNER JOIN orders o ON oi.IDOrder = o.ID WHERE o.IDStatus = 3 AND YEAR(OrderDate) = YEAR(CURRENT_DATE);"
  );
  // Tong doanh thu trong 1 nam
  const revenueOfYear = await dbQueryAsync(
    "SELECT SUM(totalPrice) AS total_revenue FROM orders WHERE IDStatus = 3 AND YEAR(OrderDate) = YEAR(CURRENT_DATE);"
  );
  // Khach hang tiem nang
  const potentialCustomer = await dbQueryAsync(
    "SELECT i.Name, i.PhoneNumber, i.Address, SUM(oi.Quantity) AS total_purchases FROM order_item oi INNER JOIN orders o ON oi.IDOrder = o.ID INNER JOIN infor_account i ON i.IDAccount = o.IDAccount WHERE o.IDStatus = 3 AND YEAR(o.OrderDate) = YEAR(CURRENT_DATE) GROUP BY i.Name ORDER BY total_purchases DESC LIMIT 1"
  );
  // Top 10 san pham ban chay
  const topProduct = await dbQueryAsync(
    "SELECT c.Name, SUM(oi.Quantity) AS total_sold FROM order_item oi INNER JOIN orders o ON oi.IDOrder = o.ID INNER JOIN coffee c ON oi.IDCoffee = c.ID WHERE o.IDStatus = 3 AND YEAR(o.OrderDate) = YEAR(CURRENT_DATE) GROUP BY c.ID ORDER BY total_sold DESC LIMIT 10"
  );

  return results({
    totalNumberProductSold: totalNumberProductSold[0].total_books_sold,
    revenueOfYear: revenueOfYear[0].total_revenue,
    potentialCustomer: potentialCustomer[0],
    topProduct: topProduct,
  });
};

module.exports = order;
