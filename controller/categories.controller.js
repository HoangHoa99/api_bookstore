const Categories = require("../models/categories.model");
module.exports.index = async (req, res) => {
  try {
    var categories = await Categories.find();
    return res.status(201).json(categories);
  } catch (error) {
    return res.status(404).json("loi roi");
  }
};
module.exports.create = async (req, res) => {
  const name = req.body.name.trim();
  try {
    if (name !== " ") {
      await Categories.create({ name: name });
      return res.status(201).json(`create categories success!`);
    }
  } catch (error) {
    return res.status(404).json(`create categories fail! ${error}`);
  }
};

module.exports.delete = async (req, res) => {
  try {
    await Categories.deleteOne({ _id: req.params.id });
    return res.status(200).json("delete success!");
  } catch (error) {
    return res.status(400).json("delete fail!");
  }
};
module.exports.update = async (req, res) => {
  const { name, _id } = req.body;
  try {
    await Categories.updateOne(
      { _id },
      {
        $set: { name },
      }
    );
    return res.status(200).json("update success!");
  } catch (error) {
    return res.status(400).json("update fail!");
  }
};
