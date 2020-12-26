const express = require("express");
const router = express.Router();
const auth = require("../middleware/verifiedToken.middleware");
const billController = require("../controller/bill.controller");
// router.post("/add", auth.verified, billController.addtoCart);
// router.post("/addfromlg", auth.verified, billController.addtoCart2);
router.get("/add/:id", auth.verified, billController.add);

module.exports = router;
