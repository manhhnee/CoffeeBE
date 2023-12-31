const coffeeRoute = require("./coffee.router");
const accountRoute = require("./account.router");
const categoryRoute = require("./category.router");
const inforRoute = require("./infor.router");
const ratingRoute = require("./rating.router");
const supplierRoute = require("./supplier.router");
const materialsRoute = require("./materials.router");
const cartRoute = require("./cart.router");
const orderRoute = require("./order.router");

function route(app) {
  app.use("/api/v1/auth", accountRoute);
  app.use("/api/v1/coffee", coffeeRoute);
  app.use("/api/v1/category", categoryRoute);
  app.use("/api/v1/infor", inforRoute);
  app.use("/api/v1/rating", ratingRoute);
  app.use("/api/v1/supplier", supplierRoute);
  app.use("/api/v1/materials", materialsRoute);
  app.use("/api/v1/cart", cartRoute);
  app.use("/api/v1/order", orderRoute);
}

module.exports = route;
