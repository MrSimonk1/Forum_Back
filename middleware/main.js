const forumUserModel = require("../schemas/forumUserSchema");
const forumTopicModel = require("../schemas/forumTopicSchema");

module.exports = {
    registerValidator: async (req, res, next) => {
        const {username, passOne, passTwo} = req.body;

        const findUser = await forumUserModel.findOne({username});
        if (findUser) {
            return res.send({success: false, message: "Username already exists."})
        }

        if (username.length < 3 || username.length > 15) {
            return res.send({success: false, message: "Username length should be 3-15 symbols."})
        }
        if (passOne.length <= 0 || passOne.length > 30) {
            return res.send({success: false, message: "Password length should be 3-30 symbols."})
        }
        if (passOne !== passTwo) {
            return res.send({success: false, message: "Passwords should match."})
        }
        next();
    },
    validateIsLoggedIn: async (req, res, next) => {
        const {username} = req.session;
        if (username) return next();
        res.send({success: false, message: "Please log in"})
    },
    validateTopicTitle: async (req, res, next) => {
        const {title, comment} = req.body;
        const findTopic = await forumTopicModel.findOne({title});
        if (findTopic) {
            return res.send({success: false, message: "Topic name already exists"});
        }
        if (title.length < 10 || title.length > 50) {
            return res.send({success: false, message: "Title length should be 10-50 symbols"});
        }
        next();
    },
    validateComment: async (req, res, next) => {
        const {comment} = req.body;
        if (comment.length < 1 || comment.length > 500) {
            return res.send({success: false, message: "Comment length should be 1-500 symbols"});
        }
        next(); 
    },
    validatePicture: async (req, res, next) => {
        const {picture} = req.body;

        if (picture.length === 0) {
            return next();
        }

        if (picture.length > 0) {
            if (picture.includes("jpeg") || picture.includes("jpg") || picture.includes("gif") || picture.includes("png")) {
                return next();
            }

            res.send({success: false, message: "Wrong picture format."})
        }

    }
}