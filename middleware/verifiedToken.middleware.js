const jwt = require("jsonwebtoken");

module.exports.verified = (req, res, next) => {
	const token = req.headers["x-access-token"];
	if (token) {
		jwt.verify(token, process.env.jwtkey, (err, decoded) => {
			if (err) return res.status(403).json(`${err}`);
			req.token = decoded;
			//  console.log(decoded);
			next();
		});
	} else {
		return res.status(401).json("No accessToken found");
	}
};
