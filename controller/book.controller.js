const Book = require("../models/book.model");
const Order = require("../models/order.model");

require("dotenv").config();
var cloudinary = require("cloudinary").v2;
cloudinary.config({
	cloud_name: process.env.cloud_name,
	api_key: process.env.api_key,
	api_secret: process.env.api_secret,
});

module.exports.index = async (req, res) => {
	try {
		const newBook = await Book.find()
			.populate("category", "-_id -__v ")
			.sort({ createdAt: -1 })
			.limit(4);
		// const bookinorder =

		const hotBook = await Order.aggregate([
			{ $match: { status: { $ne: 2 } } },
			{ $unwind: "$products" },
			{ $group: { _id: "$products.book", sum: { $sum: 1 } } },
			{
				$lookup: {
					from: "books",
					localField: "_id",
					foreignField: "_id",

					as: "books_Product",
				},
			},
			{ $match: { "books_Product.isDeleted": { $ne: true } } },
			{
				$sort: { sum: -1 },
			},
			{
				$limit: 4,
			},
		]);

		// SELECT *, stockdata
		// FROM orders
		// WHERE stockdata IN ( SELECT warehouse, instock
		// 					 FROM warehouses
		// 					 WHERE stock_item = orders.item
		// 					 AND instock >= orders.ordered );
		const books = await Book.find({ isDeleted: false }).populate(
			"category",
			"-__v "
		);

		return res.status(201).json({
			hotBook,
			newBook,
			books,
		});
	} catch (error) {
		return res.status(404).json(`fail ${error}`);
	}
};

module.exports.categoryBook = async (req, res) => {
	try {
		const ngoaingu = await Book.find({
			category: "5f789d7d7c17be338c676efa",
			isDeleted: false,
		}).populate("category", "-__v ");
		const tamly = await Book.find({
			category: "5f789d757c17be338c676ef9",
			isDeleted: false,
		}).populate("category", "-__v ");
		const tieusuhoiky = await Book.find({
			category: "5f789d427c17be338c676ef8",
			isDeleted: false,
		}).populate("category", "-__v ");
		const vanhoc = await Book.find({
			category: "5f789d047c17be338c676ef5",
			isDeleted: false,
		}).populate("category", "-__v ");
		const kinhte = await Book.find({
			category: "5f789d1d7c17be338c676ef7",
			isDeleted: false,
		}).populate("category", "-__v ");
		const sachthieunhi = await Book.find({
			category: "5f789d147c17be338c676ef6",
			isDeleted: false,
		}).populate("category", "-__v ");
		return res.status(200).json({
			msd: "success!",
			data: { kinhte, sachthieunhi, tieusuhoiky, tamly, ngoaingu, vanhoc },
		});
	} catch (error) {
		return res.status(400).json(error);
	}
};
module.exports.getBookbycateId = async (req, res) => {
	console.log(req.params.id);
	try {
		const book = await Book.find({
			category: req.params.id,
			isDeleted: false,
		}).populate("category", "-__v ");
		return res.status(200).json({ msd: "success!", data: book });
	} catch (error) {
		res.status(400).json("fail cc!");
	}
};
module.exports.getBook = async (req, res) => {
	res.json(res.paginateResult);
};

module.exports.delete = async (req, res) => {
	try {
		await Book.updateOne({ _id: req.params.id }, { isDeleted: true });
		return res.status(201).json("delete success!");
	} catch (error) {
		res.status(400).json("delete fail!");
	}
};
module.exports.detail = async (req, res) => {
	console.log(req.params.id);
	try {
		const book = await Book.findOne({
			_id: req.params.id,
			isDeleted: false,
		}).populate("category");
		return res.status(200).json(book);
	} catch (error) {
		res.status(400).json("fail cc!");
	}
};
module.exports.postCreate = async (req, res) => {
	try {
		if (req.file) {
			await cloudinary.uploader.upload(req.file.path, (err, result) => {
				if (result) {
					req.body.images = result.url;
				}
				if (err) {
					return res.status(403).json("create image fail ");
				}
			});
		}

		const books = await Book.create(req.body);
		const booksResponse = await Book.findById(books._id).populate(
			"category",
			"-__v "
		);

		return res
			.status(201)
			.json({ msd: "create success!", data: booksResponse });
	} catch (error) {
		return res.status(404).json(`create fail ${error} !`);
	}
};

module.exports.postUpdate = async (req, res) => {
	if (req.file) {
		await cloudinary.uploader.upload(req.file.path, (err, result) => {
			if (result) {
				req.body.images = result.url;
			}
			if (err) {
				return res.status(404).json(`create fail ${error} !`);
			}
		});
	}
	const {
		title,
		category,
		author,
		description,
		price,
		status,
		quantity,
		images,
	} = req.body;
	console.log();
	try {
		await Book.updateOne(
			{ _id: req.body._id },
			{
				$set: {
					title,
					author,
					description,
					price,
					status,
					quantity,
					images,
					category,
				},
			}
		);

		const BookEditResponse = await Book.findById(req.body._id).populate(
			"category",
			"-__v "
		);
		return res
			.status(200)
			.json({ msd: `update success!`, data: BookEditResponse });
	} catch (error) {
		return res.status(400).json(`update fail!`);
	}
};
module.exports.searchBooks = async (req, res) => {
	try {
		const bookSearch = await Book.find({
			isDeleted: false, // kiem tra khong xoa
			$or: [
				// dung de tim kiem giua title or author
				{ title: { $regex: req.body.keyword, $options: "$i" } }, // tim kiem trong co so du lieu
				{ author: { $regex: req.body.keyword, $options: "$i" } },
			], // tim tat ca cac keywork khong phan biet chu hoa chu thuong
		}).populate("category", "-__v ");
		return res.status(200).json(bookSearch);
		//
	} catch (error) {
		return res.status(404).json(`search fail ${error}`);
	}
};
