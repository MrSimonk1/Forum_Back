const forumUserModel = require("../schemas/forumUserSchema");
const bcrypt = require("bcrypt");
const forumTopicModel = require("../schemas/forumTopicSchema");
const forumCommentModel = require("../schemas/forumCommentSchema");
const forumNotificationModel = require("../schemas/forumNotificationSchema");

module.exports = {
    register: async (req, res) => {
        const {username, passOne, picture} = req.body;
        const hash = await bcrypt.hash(passOne, 10);

        const user = new forumUserModel();
        user.username = username;
        user.password = hash;
        user.dateRegistration = Date.now();
        if (picture.length > 0) {
            user.image = picture
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
        const {page} = req.params;

        if (page === String(1)) {
            const topics = await forumTopicModel.find({}).limit(10).sort({createdDate: -1});
            const count = await forumTopicModel.count();
            res.send({success: true, topics, count});
        }
        if (page !== String(1)) {
            const topics = await forumTopicModel.find({}).skip(Number(page) * 10 - 10).limit(10).sort({createdDate: -1});
            const count = await forumTopicModel.count();
            res.send({success: true, topics, count});
        }

    },
    getAllTopicsOfOneUser: async (req, res) => {
        const {page} = req.params;

        const {username} = req.session;

        if (page === String(1)) {
            const topics = await forumTopicModel.find({createdBy: username}).limit(10).sort({createdDate: -1});
            const count = await forumTopicModel.find({createdBy: username}).count();
            res.send({success: true, topics, count});
        }
        if (page !== String(1)) {
            const topics = await forumTopicModel.find({createdBy: username}).skip(Number(page) * 10 - 10).limit(10).sort({createdDate: -1});
            const count = await forumTopicModel.find({createdBy: username}).count();
            res.send({success: true, topics, count});
        }      
    },
    initialComment: async (req, res) => {
        const {comment, topicId, title} = req.body;
        const {username} = req.session;
        const com = new forumCommentModel();
        com.topicCommented = topicId;
        com.commentBy = username;
        com.comment = comment;
        com.topicCommentedTitle = title;
        com.commentDate = Date.now();

        await com.save();

        res.send({success: true, message: "Created topic and the firs comment"});
    },
    comment: async (req, res) => {
        const {comment, topicId} = req.body;
        const {username} = req.session;

        const commentDate = Date.now();

        const findTopic = await forumTopicModel.findOne({_id: topicId});
        await forumTopicModel.findOneAndUpdate({_id: topicId}, {$set: {commentsCount: findTopic.commentsCount + 1, latestCommentBy: username, latestCommentDate: commentDate}})

        const com = new forumCommentModel();
        com.topicCommentedTitle = findTopic.title;
        com.topicCommented = topicId;
        com.commentBy = username;
        com.comment = comment;
        com.commentDate = commentDate;

        await com.save();

        const findUser = await forumUserModel.findOne({username});
        await forumUserModel.findOneAndUpdate({username}, {$set: {totalComments: findUser.totalComments + 1}});

        if (findTopic.createdBy !== username) {
            const notification = new forumNotificationModel();
            notification.commentBy = username;
            notification.topicCommented = findTopic._id;
            notification.topicCreatedBy = findTopic.createdBy;
            notification.commentedDate = Date.now();
            notification.commentedTopicTitle = findTopic.title;

            notification.save();
        }

        res.send({success: true, message: "Comment created"});
    },
    getCommentsOfOneUser: async (req, res) => {
        const {username} = req.session;
        const {page} = req.params;
        console.log(page);

        if (page === String(1)) {
            const comments = await forumCommentModel.find({commentBy: username}).limit(10).sort({commentDate: -1});
            const count = await forumCommentModel.find({commentBy: username}).count();
            res.send({success: true, comments, count});
        }
        if (page !== String(1)) {
            const comments = await forumCommentModel.find({commentBy: username}).skip(Number(page) * 10 - 10).limit(10).sort({commentDate: -1});
            const count = await forumCommentModel.find({commentBy: username}).count();
            res.send({success: true, comments, count});
        }  
    },
    getOneTopic: async (req, res) => {
        const {id} = req.params;
        const topic = await forumTopicModel.findOne({_id: id});
        res.send({success: true, topic});
    },
    getCommentsOfOneTopic: async (req, res) => {
        const {id} = req.params;
        const {page} = req.params;

        if (page === String(1)) {
            const comments = await forumCommentModel.find({topicCommented: id}).limit(10);
            const count = await forumCommentModel.find({topicCommented: id}).count();
            res.send({success: true, comments, count});
        }
        if (page !== String(1)) {
            const comments = await forumCommentModel.find({topicCommented: id}).skip(Number(page) * 10 - 10).limit(10);
            const count = await forumCommentModel.find({topicCommented: id}).count();
            res.send({success: true, comments, count});
        }          
    },
    getCommenterInfo: async (req, res) => {
        const {username} = req.body;
        const user = await forumUserModel.findOne({username});
        res.send({success: true, user});
    },
    getFavorites: async (req, res) => {
        const {array, page} = req.body;

        if (page === String(1)) {
            const topics = await forumTopicModel.find({_id: array}).limit(10).sort({createdDate: -1});
            const count = await forumTopicModel.find({_id: array}).count();
            res.send({success: true, topics, count});
        }
        if (page !== String(1)) {
            const topics = await forumTopicModel.find({_id: array}).skip(Number(page) * 10 - 10).limit(10).sort({createdDate: -1});
            const count = await forumTopicModel.find({_id: array}).count();
            res.send({success: true, topics, count}); 
        }
    },
    getNotifications: async (req, res) => {
        const {username} = req.session;

        const notifications = await forumNotificationModel.find({topicCreatedBy: username}).sort({commentedDate: -1});
        const notSeenCount = await forumNotificationModel.find({topicCreatedBy: username, isSeen: false}).count();

        res.send({success: true, notifications, notSeenCount});
    },
    notificationsSeen: async (req, res) => {
        const {username} = req.session;

        await forumNotificationModel.updateMany({topicCreatedBy: username, isSeen: false}, {$set: {isSeen: true}});
        
        res.send({success: true, message: "All seen"});
    },
    changePicture: async (req, res) => {
        const {username} = req.session;
        const {picture} = req.body;

        if (picture.length !== 0) {
            await forumUserModel.findOneAndUpdate({username}, {$set: {image: picture}})
        }

        res.send({success: true, message: "Picture updated"});
    }
}