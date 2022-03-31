const express = require("express");
const {register, login} = require("../controllers/main");
const {registerValidator} = require("../middleware/main");
const router = express.Router();

router.post("/register", registerValidator, register);
router.post("/login", login);

module.exports = router;