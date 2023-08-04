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

materials.show = async (results) => {};

module.exports = materials;
