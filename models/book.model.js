const mongoose = require("mongoose");
var bookSchema = new mongoose.Schema(
	{
		title: String,
		author: String,
		description: String,
		price: Number,
		status: Number,
		quantity: Number,
		isDeleted: {
			// view product
			type: Boolean,
			default: false,
		},
		//seller: { type: mongoose.Schema.Types.ObjectId }, //, ref: "User"
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "categories",
		},
		images: String,
	},
	{ timestamps: true }
);
var Book = mongoose.model("books", bookSchema);
module.exports = Book;
