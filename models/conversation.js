const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true
    },
    recipient: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

const conversationSchema = new mongoose.Schema({
    participant: {
        type: [String],
        required: true
    },
    messages: [messageSchema],
});

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;

