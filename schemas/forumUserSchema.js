const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const forumUserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    },
    dateRegistration: {
        type: Number,
        required: true
    },
    totalTopics: {
        type: Number,
        default: 0
    },
    totalComments: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("ForumUserModels", forumUserSchema);