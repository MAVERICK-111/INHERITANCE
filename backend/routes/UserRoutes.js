const express = require("express");
const { getUser, updateUser, getAllUsers } = require("../controllers/UserController");

const router = express.Router();

router.get("/getUser/:auth0Id", getUser);
router.put("/updateUser/:auth0Id", updateUser);
router.get("/getAllUsers/:auth0Id", getAllUsers);

module.exports = router;
