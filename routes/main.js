const express = require("express");
const {register, login, userProfileInfo} = require("../controllers/main");
const {registerValidator, validateIsLoggedIn} = require("../middleware/main");
const router = express.Router();

router.post("/register", registerValidator, register);
router.post("/login", login);
router.get("/userProfileInfo", validateIsLoggedIn, userProfileInfo);

module.exports = router;