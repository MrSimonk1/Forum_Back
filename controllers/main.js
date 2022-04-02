const forumUserModel = require("../schemas/forumUserSchema");
const bcrypt = require("bcrypt");
const forumTopicModel = require("../schemas/forumTopicSchema");
const forumCommentModel = require("../schemas/forumCommentSchema");

module.exports = {
    register: async (req, res) => {
        const {username, passOne, image} = req.body;
        const hash = await bcrypt.hash(passOne, 10);

        const user = new forumUserModel();
        user.username = username;
        user.password = hash;
        user.dateRegistration = Date.now();
        if (image.length > 0) {
            user.image = image
        }

        user.save();

        res.send({success: true, message: "Succesfully registered"});
    },
    checkLoggedIn: async (req, res) => {
        const {username} = req.session;

        if (username) {
            return res.send({success: true, message: "You are logged in"});
        }
        if (!username) {
            res.send({success: false, message: "You are not logged in"});
        }
    },
    login: async (req, res) => {
        const {username, password} = req.body;
        const findUser = await forumUserModel.findOne({username});
        if (findUser) {
            const compared = await bcrypt.compare(password, findUser.password);
            if (compared) {
                req.session.username = username;
                const user = await forumUserModel.findOne({username}, {username: true});
                return res.send({success: true, message: "Logged in", user})
            }
        }
        res.send({success: false, message: "Username and/or password is incorrect"});
    },
    logout: async (req, res) => {
        req.session.destroy();
        res.send({success: true, message: "Logged out"});
    },
    userProfileInfo: async (req, res) => {
        const {username} = req.session;
        const user = await forumUserModel.findOne({username}, {image: true, username: true, dateRegistration: true, totalTopics: true, totalComments: true});
        res.send({success: true, user});
    },
    createTopic: async (req, res) => {
        const {title, comment} = req.body;
        const {username} = req.session;

        const topic = new forumTopicModel();
        topic.title = title;
        topic.createdBy = username;
        topic.latestCommentBy = username;
        topic.latestCommentDate = Date.now();

        let id;

        topic.save()
            .then((res) => {
                id = res._id
            });

        const user = await forumUserModel.findOne({username});
        await forumUserModel.findOneAndUpdate({username}, {$set: {totalTopics: user.totalTopics + 1}});

        res.send({success: true, message: "Topic was created", id});
    },
    getTopics: async (req, res) => {
        const topics = await forumTopicModel.find({}).limit(10).sort({createdDate: -1});
        res.send({success: true, topics});
    },
    initialComment: async (req, res) => {
        const {comment, topicId} = req.body;
        const {username} = req.session;
        const com = new forumCommentModel();
        com.topicCommented = topicId;
        com.commentBy = username;
        com.comment = comment;
        com.commentDate = Date.now();

        await com.save();

        res.send({success: true, message: "Created topic and the firs comment"});
    },
    comment: async (req, res) => {
        const {comment, topicId} = req.body;
        const {username} = req.session;

        const commentDate = Date.now();

        const com = new forumCommentModel();
        com.topicCommented = topicId;
        com.commentBy = username;
        com.comment = comment;
        com.commentDate = commentDate;

        await com.save();

        const findUser = await forumUserModel.findOne({username});
        await forumUserModel.findOneAndUpdate({username}, {$set: {totalComments: findUser.totalComments + 1}});

        const findTopic = await forumTopicModel.findOne({_id: topicId});
        await forumTopicModel.findOneAndUpdate({_id: topicId}, {$set: {commentsCount: findTopic.commentsCount + 1, latestCommentBy: username, latestCommentDate: commentDate}})

        res.send({success: true, message: "Comment created"});
    },
    getCommentsOfOneUser: async (req, res) => {
        const {username} = req.session;

        const comments = await forumCommentModel.find({commentBy: username});

        res.send({success: true, comments});
    },
    getOneTopic: async (req, res) => {
        const {id} = req.params;
        const topic = await forumTopicModel.findOne({_id: id});
        res.send({success: true, topic});
    },
    getAllTopicsOfOneUser: async (req, res) => {
        const {username} = req.session;

        const topics = await forumTopicModel.find({createdBy: username});

        res.send({success: true, topics});
    },
    getCommentsOfOneTopic: async (req, res) => {
        const {id} = req.params;
        const comments = await forumCommentModel.find({topicCommented: id});
        res.send({success: true, comments});
    },
    getCommenterInfo: async (req, res) => {
        const {username} = req.body;
        const user = await forumUserModel.findOne({username});
        res.send({success: true, user});
    }
}