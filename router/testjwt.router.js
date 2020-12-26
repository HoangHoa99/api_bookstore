const express = require("express");
const router = express.Router();
const auth = require("../middleware/verifiedToken.middleware");

const userController = require("../controller/user.controller");
router.get("/", auth.verified, (req, res) => {
	return res.status(200).json({ msg: "success!" });
});

module.exports = router;
