const express = require("express");
const {register, login, userProfileInfo, createTopic, getTopics, initialComment, getOneTopic, getCommentsOfOneTopic, getCommenterInfo} = require("../controllers/main");
const {registerValidator, validateIsLoggedIn, validateComment, validateTopicTitle} = require("../middleware/main");
const router = express.Router();

router.post("/register", registerValidator, register);
router.post("/login", login);
router.get("/userProfileInfo", validateIsLoggedIn, userProfileInfo);
router.post("/commenterInfo", getCommenterInfo);
router.post("/create-topic", validateIsLoggedIn, validateTopicTitle, validateComment, createTopic);
router.post("/initial-comment", validateComment, initialComment);
router.get("/getTopics", getTopics);
router.get("/getOneTopic/:id", getOneTopic);
router.get("/getCommentsOfOneTopic/:id", getCommentsOfOneTopic);

module.exports = router;