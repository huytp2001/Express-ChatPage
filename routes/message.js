const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const Conversation = require("../models/conversation");

router.get("/:userId", auth, async (req, res) => {
    const userId = req.session.userId;
    const chatId = req.params.userId;
    const message = req.query.message;
    const message_obj = {
        sender: userId,
        recipient: chatId,
        message: message,
        created_at: new Date(),
    };
    try {
        let conversation = await Conversation.findOne({participant: { $all: [userId, chatId] }});
        if (!conversation) { // Means that there are no conversation before 
            const newConversation = new Conversation({
                participant: [userId, chatId],
                message: []
            });
            await newConversation.save();
            conversation = newConversation;
            console.log(`Create new conversation between ${userId} and ${chatId}`);
            conversation.messages.push(message_obj);
            await conversation.save();
            res.redirect(`/dashboard/show_chat/${req.session.current_user}`);
        } else {
            conversation.messages.push(message_obj);
            await conversation.save();
            res.redirect(`/dashboard/show_chat/${req.session.current_user}`);
        }
    } catch (err) {
        res.send(`Send message route get an error: ${err.stack}`);
    }
})

module.exports = router;








