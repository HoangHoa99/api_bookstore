const bcryptjs = require("bcryptjs");
const User = require("../models/user.model");
const sendMail = require("../middleware/sendMail.middleware");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const passport = require("passport");
const njwt = require("njwt");

const { text } = require("body-parser");

module.exports.index = async (req, res) => {
  try {
    let users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(404).json(`error ${error}`);
  }
};
module.exports.userDetail = async (req, res) => {
  const idUser = req.params.id;
  try {
    let users = await User.findById(idUser);
    return res.status(200).json(users);
  } catch (error) {
    return res.status(404).json(`error ${error}`);
  }
};
module.exports.create = async (req, res) => {
  const { email, username } = req.body;
  const userNameExist = await User.findOne({ username });
  if (userNameExist) {
    return res.status(202).json(" Tên tài khoản đã tồn tại");
  }
  const userEmailExist = await User.findOne({ email });
  if (userEmailExist) {
    return res.status(202).json("Gmail đăng kí đã tồn tại");
  }
  let hash = bcryptjs.hashSync(req.body.password);
  req.body.password = hash;
  try {
    await User.create(req.body);
    return res.status(201).json("create success");
  } catch (error) {
    return res.status(404).json(`create fail! ${error}`);
  }
};

module.exports.postLogin = async (req, res) => {
  const { username, password } = req.body;
  const UserExits = await User.findOne({ username });

  if (!UserExits) {
    return res.status(202).json({ msg: `Sai tài khoản hoặc mật khẩu !` });
  }
  if (UserExits.wrongLoginCount > 4) {
    // sai nhieu can gui mail kich hoat
    return res
      .status(202)
      .json({ msg: `Bạn đã nhập mật khẩu sai quá nhiều lần` });
  }
  console.log(UserExits);
  if (!bcryptjs.compareSync(password, UserExits.password)) {
    await User.updateOne(
      { username },
      {
        $inc: {
          wrongLoginCount: 1,
        },
      }
    );
    return res.status(202).json({ msg: `Sai tài khoản hoặc mật khẩu!` });
  }
  // if (UserExits.role !== 0) {
  //   return res.status(202).json({ msg: `Lỗi truy cập! bạn đang ở quyền user` });
  // }
  if (bcryptjs.compareSync(password, UserExits.password)) {
    const payload = {
      user: {
        id: UserExits._id,
        username: UserExits.username,
        role: UserExits.role,
      },
    };
    const { username, address } = UserExits;
    await User.updateOne(
      { username },
      {
        wrongLoginCount: 0,
      }
    );
    const accessToken = jwt.sign(payload, process.env.jwtkey, {
      //set up jwt
      expiresIn: "1h",
    });

    return res
      .status(202)
      .json({ username, address, accessToken: accessToken });
  }
};

//fortgetPassword

module.exports.forgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const emailUser = await User.findOne({ email: email });
    console.log(emailUser);
    if (!emailUser) {
      return res.status(400).json(`User with that email dont match!`);
    }
    const payload = {
      user: {
        id: emailUser._id,
      },
    };
    console.log(payload);
    const Token = jwt.sign(payload, process.env.jwtkey, {
      //set up jwt
      expiresIn: "10m",
    });
    sendMail.sendMail(email, Token, 1);
    return res.status(200).json(`email đã được gửi tới ${email}`);
  } catch (error) {
    return res.status(200).json(error);
  }
};

///rest pass
module.exports.resetPassword = async (req, res) => {
  const { newPassword, token } = req.body;
  let id = "";

  if (!newPassword) {
    return res.status(400).json("faill!");
  }
  if (token) {
    jwt.verify(token, process.env.jwtkey, (err, decoded) => {
      if (err) return res.status(403).json(`${err}`);
      id = decoded.user.id;
    });
  }
  try {
    let hash = bcryptjs.hashSync(newPassword);
    await User.findOneAndUpdate({ _id: id }, { password: hash });
    return res.status(200).json({ msg: "ban da doi mat khau thanh cong!" });
  } catch (error) {
    return res.status(400).json(error);
  }
};

module.exports.addtoCart = async (req, res) => {
  const productToCart = req.body;
  // 	console.log(productToCart);
  const userId = req.token.user.id;

  try {
    const userCart = await User.findOne({
      _id: userId,
    });
    const isItemAdd = userCart.cart.find(
      (item) => item.book == productToCart.book
    );
    console.log(isItemAdd);
    console.log(productToCart.book);

    if (isItemAdd) {
      await User.updateOne(
        {
          _id: userId,
          "cart.book": productToCart.book,
        },
        {
          $set: {
            "cart.$": {
              ...productToCart,
              amount: isItemAdd.amount + productToCart.amount,
            },
          },
        }
      );

      const cart = await User.findOne({
        _id: userId,
      });
      return res.status(200).json({ cart });
    }

    await User.findOneAndUpdate(
      { _id: userId },
      {
        $push: {
          cart: productToCart,
        },
      }
    );
    const cart = await User.findOne({
      _id: userId,
    });
    return res.status(200).json({ cart });
  } catch (error) {
    return res.status(400).json({
      msd: `your request could not be processed! +${error}`,
    });
  }
};

module.exports.addtoCart2 = async (req, res) => {
  const productToCart = req.body.product;

  const userId = req.token.user.id;
  const userCart = await User.findOne({
    _id: userId,
  });

  try {
    await Promise.all(
      // use promise.all in order to use async await in map
      productToCart.map(async (item) => {
        //	console.log(item);
        const isItemAdd = userCart.cart.find(
          (bookInCart) => bookInCart.book == item.book
        );
        if (isItemAdd) {
          await User.updateOne(
            {
              _id: userId,
              "cart.book": item.book,
            },
            {
              $set: {
                "cart.$": {
                  ...item,
                  amount: isItemAdd.amount + item.amount,
                },
              },
            }
          );
        } else {
          await User.findOneAndUpdate(
            { _id: userId },
            {
              $push: {
                cart: item,
              },
            }
          );
        }
      })
    );

    const cart = await User.findOne({
      _id: userId,
    });
    return res.status(200).json({ cart });
  } catch (error) {
    return res.status(400).json({
      msd: `your request could not be processed! +${error}`,
    });
  }
};
module.exports.deleteCart = async (req, res) => {
  try {
    const userId = req.token.user.id;

    await User.findOneAndUpdate({ _id: userId }, { cart: [] });
    return res.status(200).json({ msg: `delete success!` });
  } catch (error) {
    return res.status(400).json({ msg: `delete fail!`, error: `${error}` });
  }
};
module.exports.cartUser = async (req, res) => {
  try {
    const userId = req.token.user.id;

    const userCart = await User.findById(userId);
    const { cart } = userCart;

    return res.status(200).json({ msg: `success!`, data: cart });
  } catch (error) {
    return res.status(400).json({ msg: `delete fail!`, error: `${error}` });
  }
};
module.exports.deleteBook = async (req, res) => {
  //xoa book in cart
  const userId = req.token.user.id; //get user
  const { bookId } = req.params;
  const user = await User.findById(userId);
  console.log(user);
  try {
    await User.updateOne(
      { _id: userId },
      {
        $pull: {
          cart: { book: bookId }, //delete product in cart
        },
      }
    );

    return res.status(200).json("delete sussess!");
  } catch (error) {
    return res.status(400).json(`delete fail! ${error}`);
  }
};

//login with facebook
module.exports.loginWithFacebook = async (req, res) => {
  passport.authenticate("facebook", { scope: "email" });
};
module.exports.fbLoginSuccess = async (req, res) => {
  const claims = {
    user: {
      id: req.id,
      username: req.displayName,
      role: 0,
    },
  };
  const token = njwt.create(claims, "kkeeyy");
  token.setExpiration(new Date().getTime() + 60 * 1000);
  let obj = {
    username: req.user._json.name,
    address: "No biết",
    accessToken: token.compact(),
  };
  return res.json(obj);
};
module.exports.fbLoginFail = async (req, res) => {
  return res.json({
    msg: "login fail",
  });
};
