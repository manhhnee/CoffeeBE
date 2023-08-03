const coffeeRoute = require("./coffee.router");
const accountRoute = require("./account.router");
const categoryRoute = require("./category.router");
const inforRoute = require("./infor.router");

function route(app) {
  app.use("/api/v1/auth", accountRoute);
  app.use("/api/v1/coffee", coffeeRoute);
  app.use("/api/v1/category", categoryRoute);
  app.use("/api/v1/infor", inforRoute);
}

module.exports = route;
