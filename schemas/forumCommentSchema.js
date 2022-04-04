const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const forumCommentSchema = new Schema({
    commentBy: {
        type: String,
        required: true
    },
    topicCommented: {
        type: String,
        required: true
    },
    topicCommentedTitle: {
        type: String,
        required: true
    },
    commentDate: {
        type: Number,
        default: Date.now(),
    },
    comment: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("forumCommentModel", forumCommentSchema);