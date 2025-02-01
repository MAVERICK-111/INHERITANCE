const express = require("express");
const { sendMessage, getMessages } = require("../controllers/MessageController");

const router = express.Router();

router.post("/send", sendMessage);
router.get("/get/:user1/:user2", getMessages);

module.exports = router;