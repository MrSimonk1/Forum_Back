const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const forumNotificationSchema = new Schema({
    commentBy: {
        type: String,
        required: true
    },
    topicCommented: {
        type: String,
        required: true 
    },
    topicCreatedBy: {
        type: String,
        required: true,
    },
    commentedDate: {
        type: Number,
        required: true
    },
    isSeen: {
        type: Boolean,
        default: false
    },
    commentedTopicTitle: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("forumNotificationModel", forumNotificationSchema);