const express = require("express");
const {register, login, userProfileInfo, createTopic, getTopics, initialComment, getOneTopic, getCommentsOfOneTopic, getCommenterInfo, comment, checkLoggedIn, getAllTopicsOfOneUser, logout, getCommentsOfOneUser, getAllTopicsCount, getFavorites, getNotifications, notificationsSeen} = require("../controllers/main");
const {registerValidator, validateIsLoggedIn, validateComment, validateTopicTitle} = require("../middleware/main");
const router = express.Router();

router.post("/register", registerValidator, register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/check-logged-in", checkLoggedIn);
router.get("/userProfileInfo", validateIsLoggedIn, userProfileInfo);
router.post("/commenterInfo", getCommenterInfo);
router.post("/create-topic", validateIsLoggedIn, validateTopicTitle, validateComment, createTopic);
router.post("/initial-comment", validateComment, initialComment);
router.post("/write-comment", validateIsLoggedIn, validateComment, comment);
router.get("/getTopics/:page", getTopics);
router.get("/getTopicsOfOneUser/:page", validateIsLoggedIn, getAllTopicsOfOneUser);
router.get("/getCommentsOfOneUser/:page", validateIsLoggedIn, getCommentsOfOneUser);
router.get("/getOneTopic/:id", getOneTopic);
router.get("/getCommentsOfOneTopic/:id/:page", getCommentsOfOneTopic);
router.post("/getFavorites", getFavorites);
router.get("/getNotifications", validateIsLoggedIn, getNotifications);
router.get("/seenNotification", validateIsLoggedIn, notificationsSeen);

module.exports = router;