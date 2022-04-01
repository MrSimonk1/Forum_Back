const express = require("express");
const {register, login, userProfileInfo, createTopic, getTopics, initialComment} = require("../controllers/main");
const {registerValidator, validateIsLoggedIn, validateComment, validateTopicTitle} = require("../middleware/main");
const router = express.Router();

router.post("/register", registerValidator, register);
router.post("/login", login);
router.get("/userProfileInfo", validateIsLoggedIn, userProfileInfo);
router.post("/create-topic", validateIsLoggedIn, validateTopicTitle, validateComment, createTopic);
router.post("/initial-comment", validateComment, initialComment);
router.get("/getTopics", getTopics);

module.exports = router;