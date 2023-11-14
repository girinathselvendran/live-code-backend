const { User } = require("../models/user");

const createUser = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const findUser = await User.findOne({ emailId });

    if (findUser?.emailId === req?.body?.emailId) {
      return res.status(409).json({
        status: 409,
        data: "User Already Exist with same Email ID",
      });
    } else {
      const newUser = new User({ ...req.body });
      await newUser.save();

      return res.status(200).json({
        status: 200,
        data: "User Create Successful",
      });
    }
  } catch (error) {
    console.log("error", error.message);
    return res.status(200).json({
      status: 500,
      data: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const findUser = await User.findOne({ emailId: emailId });
    console.log("findUser", findUser);
    if (findUser) {
      if (findUser.password === password)
        return res.status(200).json({
          status: 200,
          data: "SignIn Successful",
          info: emailId,
        });
      else {
        return res.status(200).json({
          status: 200,
          data: "Wrong Password",
        });
      }
    } else {
      return res.status(400).json({
        status: 400,
        data: "No User Exist",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      data: error.message,
    });
  }
};

module.exports = { createUser, loginUser };
