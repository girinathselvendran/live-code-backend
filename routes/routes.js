const express = require("express");

const routes = express.Router();
const { createUser, loginUser } = require("../controllers/auth");

//signup signin
routes.post("/create-user", createUser);
routes.post("/login-user", loginUser);

module.exports = routes;
