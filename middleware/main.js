const forumUserModel = require("../schemas/forumUserSchema");

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
    }
}