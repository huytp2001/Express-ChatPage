const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const User = require('../models/user');
const Conversation = require("../models/conversation");

// Redirect from login page to dashboard
router.get('/', auth, async (req, res) => {
    const userId = req.session.userId;
    try {
        const user = await User.findById(userId);
        let friend_list = [];
        for (const id of user.friends) {
            const friend = await User.findById(id);
            friend_list.push(friend);
        }
        res.render("dashboard", {user: user, friend_list: friend_list});
    } catch (err) {
        res.send(`Error on fetch friend list route: ${err.stack}`);
    }
})

router.get('/show_chat/:userId', auth, async (req, res) => {
    const userId = req.session.userId;
    const chatId = req.params.userId;
    req.session.current_user = chatId;
    try {
        const user = await User.findById(userId);
        const chat = await User.findById(chatId);
        const conversation = await Conversation.findOne({participant: { $all: [userId, chatId] }});
        let friend_list = [];
        for (const id of user.friends) {
            const friend = await User.findById(id);
            friend_list.push(friend);
        }
        if (!conversation) {
            res.render("dashboard", {user: user, chat: chat, friend_list: friend_list});
            return;    
        } else  {
            const messages = conversation.messages;
            res.render("dashboard", {user: user, chat: chat, messages: messages, friend_list: friend_list});
        }
    } catch (err) {
        res.send(`Error on show chat route: ${err.stack}`);
    }
})

module.exports = router;