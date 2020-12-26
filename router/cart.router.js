const express = require("express");
const router = express.Router();
const auth = require("../middleware/verifiedToken.middleware");
const userController = require("../controller/user.controller");

router.get("/", auth.verified, userController.cartUser);
router.post("/add", auth.verified, userController.addtoCart);
router.post("/addfromlg", auth.verified, userController.addtoCart2);
router.get("/delete", auth.verified, userController.deleteCart);
router.get("/delete/:bookId", auth.verified, userController.deleteBook);
module.exports = router;
