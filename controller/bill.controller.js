const Order = require("../models/order.model");
const Product = require("../models/book.model");
const Bill = require("../models/bill.model");

module.exports.add = async (req, res) => {
	const OrderId = req.params.id;

	try {
		await Order.findOneAndUpdate({ _id: OrderId }, { status: 1 });
		const orderComplete = await Order.findById(OrderId);

		await Bill.create({ Order: OrderId });
		//	console.log(orderComplete);
		const { products } = orderComplete;
		console.log(products);
		decreaseQuantity(products);
		return res.status(200).json({ msg: ` success!`, orderComplete });
	} catch (error) {
		return res.status(400).json({ msg: ` fail!`, error: `${error}` });
	}
};

//chu xu ly xong  bill xoa ???

//fix loii 404 ???

module.exports.deleteOrder = async (req, res) => {
	const OrderId = req.params.id;

	try {
		const OrderDeltete = await Order.findOne({ _id: OrderId });
		const { products } = OrderDeltete;
		await Bill.deleteOne({ Order: OrderId });
		IncQuantity(products);
		return res.status(200).json("delete success!");
	} catch (error) {
		return res.status(400).json(`delete fail! +${error}`);
	}
};

const decreaseQuantity = (products) => {
	let bulkOptions = products.map((item) => {
		// truyen vao mot mảng pro duct
		return {
			updateOne: {
				filter: { _id: item.book }, // lay ra id
				update: { $inc: { quantity: -item.quantity } }, // how update??
			},
		};
	});

	Product.bulkWrite(bulkOptions); // goi product truyen bulkWrite
};
const IncQuantity = (products) => {
	let bulkOptions = products.map((item) => {
		return {
			updateOne: {
				filter: { _id: item.product },
				update: { $inc: { quantity: +item.quantity } },
			},
		};
	});
	Product.bulkWrite(bulkOptions);
};
