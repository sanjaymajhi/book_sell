const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const book = new Schema({
  title: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "book_sell_auhtor" },
  description: { type: String, required: true },
  cover_image: { type: String, default: null }, // will used to store links to image by using cloudinary but not implementing it
  price: { type: Number, required: true },
});

module.exports = Mongoose.model("book_sell_book", book);
