const bcrypt = require('bcryptjs');
const User = require("../models/userModel");

exports.signUp = async (req, res) => {
  const {username, password} = req.body;
  try {
    const hashpassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      username,
      password: hashpassword
    });
    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  } catch (e) {
    res.status(400).json({
      status: "failed",
    });
  }
};

exports.login = async (req, res) => {
  const {username, password} = req.body;
  try {
    const user = await User.findOne({username});
    if (!user) {
      res.status(404).json({
        status: "failed",
        message: "user not found"
      });
    }

    const isAuthed = await bcrypt.compare(password, user.password);

    if (isAuthed) {
      res.status(200).json({
        status: "success",
      });
      return;
    }
    res.status(400).json({
      status: "failed",
      message: "incorrect username or password"
    });

  } catch (e) {
    res.status(400).json({
      status: "failed",
    });
  }
}