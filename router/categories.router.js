const express = require("express");
const router = express.Router();

const CategoriController = require("../controller/categories.controller");
router.get("/", CategoriController.index);
router.post("/create", CategoriController.create);
router.post("/update", CategoriController.update);
router.get("/delete/:id", CategoriController.delete);
module.exports = router;
