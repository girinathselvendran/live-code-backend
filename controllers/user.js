const { User } = require("../models/user");

// let items = require("../Items");

const { connectDb } = require("../Utilities/database/mongodbConnector");

//while creating additem fn
// const { v4: uuid } = require("uuid");

const getItems = async (req, reply) => {
  await connectDb();
  let usersData = await User.find();

  const newRecord = await new User({
    Name: "Girinath",
    Password: "girinath",
    isActive: true,
  });
  await newRecord.save();

  reply.send("Success");
};

const getItem = (req, reply) => {
  const { id } = req.params;
  //   const item = items.find((item) => item.id === Number(id));
  reply.send("item");
};

module.exports = {
  getItem,
  getItems,
};
