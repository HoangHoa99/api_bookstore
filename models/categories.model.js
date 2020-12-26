const mongoose = require("mongoose");
var bookSchema = new mongoose.Schema({
  name: String,
});
var Categories = mongoose.model("categories", bookSchema);
module.exports = Categories;
