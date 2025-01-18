const express = require("express");
const { welcomeMessage } = require("../controllers/authController");

const router = express.Router();

router.get("/", welcomeMessage);

module.exports = router;
