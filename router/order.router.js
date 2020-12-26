const express = require("express");
const router = express.Router();
const auth = require("../middleware/verifiedToken.middleware");
const orderController = require("../controller/order.controller");
router.post("/add", auth.verified, orderController.add); // all product =>  loai bo de test  // auth.verified
router.post("/update", orderController.update);
router.get("/myorder", auth.verified, orderController.checkorder);
router.get("/", orderController.index);
router.get("/detail/:id", orderController.orderDetail);
module.exports = router;
