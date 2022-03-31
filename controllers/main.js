const forumUserModel = require("../schemas/forumUserSchema");
const bcrypt = require("bcrypt");

module.exports = {
    register: async (req, res) => {
        const {username, passOne, image} = req.body;
        const hash = await bcrypt.hash(passOne, 10);

        const user = new forumUserModel();
        user.username = username;
        user.password = hash;
        if (image.length > 0) {
            user.image = image
        }

        user.save();

        res.send({success: true, message: "Succesfully registered"});
    },
    login: async (req, res) => {
        const {username, password} = req.body;
        const findUser = await forumUserModel.findOne({username});
        if (findUser) {
            const compared = await bcrypt.compare(password, findUser.password);
            if (compared) {
                return res.send({success: true, message: "Logged in"})
            }
        }
        res.send({success: false, message: "Username and/or password is incorrect"});
    }
}