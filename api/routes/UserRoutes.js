const express = require("express");
const { getUser, updateUser, getAllUsers, getUsernameByAuth0Id } = require("../controllers/UserController");

const router = express.Router();

router.get("/getUser/:auth0Id", getUser);
router.put("/updateUser/:auth0Id", updateUser);
router.get("/getAllUsers/:auth0Id", getAllUsers);
router.get("/getUsername/:auth0Id", getUsernameByAuth0Id);

module.exports = router;
