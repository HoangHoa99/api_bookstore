const Mongoose = require("mongoose");
const { Schema } = Mongoose;

const OrderItemSchema = new Schema({
	book: {
		type: Schema.Types.ObjectId,
		ref: "books",
	},
	quantity: Number,
	totalPrice: {
		type: Number,
	},
});

// Cart Schema
const OrderSchema = new Schema(
	{
		products: [OrderItemSchema],
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		address: String,
		phone: String,
		note: String,
		status: {
			type: Number,
			default: 0, //0 chua xu ly ,1 xac nhan don hang , 2 huy don hang
		},
		totalrice: Number,
	},
	{ timestamps: true }
);

module.exports = Mongoose.model("Order", OrderSchema);
