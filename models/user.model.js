const mongoose = require("mongoose");
const CartItemSchema = new mongoose.Schema({
	book: {
		type: mongoose.Types.ObjectId,
		ref: "books",
	},
	amount: Number,
	totalPrice: {
		type: Number,
	},
});
var userSchema = new mongoose.Schema(
	{
		username: { type: String, required: true },
		password: { type: String, required: true },
		email: { type: String, required: true },
		phone: String,
		address: String,
		role: { type: Number, default: 0 },
		avatar: String,

		wrongLoginCount: { type: Number, default: 0 },
		status: { type: Number, default: 1 },
		wallet: { type: Number, default: 0 },
		cart: [CartItemSchema],
	},
	{ timestamps: true }
);
var User = mongoose.model("User", userSchema);
module.exports = User;
