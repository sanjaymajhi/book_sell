const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const author = new Schema({
  pseudonym: { type: "String", required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
});

module.exports = Mongoose.model("book_sell_auhtor", author);
