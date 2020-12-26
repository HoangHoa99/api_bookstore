module.exports.paginateResult = function paginateResult(model, refString) {
	//higer order function
	return async (req, res, next) => {
		const page = parseInt(req.query.page);
		const limit = parseInt(req.query.limit);
		const startIndex = (page - 1) * limit;
		const endIndex = page * limit;
		const resut = {};
		if (endIndex < model.length) {
			resut.next = {
				page: page + 1,
				limit: limit,
			};
		}

		if (startIndex > 0) {
			resut.previous = {
				page: page - 1,
				limit: limit,
			};
		}
		try {
			resut.result = await model
				.find({ isDelete: false })
				.populate(refString)
				.limit(limit)
				.skip(startIndex);
			res.paginateResult = resut;
			next();
		} catch (error) {
			res.status(401).json(`erorr${error} `);
		}
	};
};
