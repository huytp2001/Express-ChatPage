const express = require('express');
const User = require('../models/user');
const router = express.Router();
const auth = require("../middleware/auth");

// Handle users page
router.get('/page/:userId', auth, async (req, res) => {
    const userId = req.params.userId;
    req.session.last_url = `/user/page/${userId}`;
    try {
        const cr_user = await User.findById(req.session.userId);
        const user = await User.findById(userId);
        res.render("user", {req: req, user: user, cr_user: cr_user});
    } catch (err) {
        res.send(`Error on fecth user info: ${err}`);
    }
});

// Route that handle add friend function
router.get('/add_friend/:userId', auth, async (req, res) => {
    const friend_id = req.params.userId;
    const user_id = req.session.userId;
    try {
        const friend = await User.findById(friend_id);
        friend.req_friends.addToSet(user_id);
        await friend.save();
        res.redirect(req.session.last_url);
    } catch (err) {
        res.send(`Error on add friend route: ${err}`);
    }
});

// Route that handle cancel add friend request
router.get('/cancel_add/:userId', auth, async (req, res) => {
    const friend_id = req.params.userId;
    const user_id = req.session.userId;
    try {
        const friend = await User.findById(friend_id);
        friend.req_friends.pull(user_id);
        await friend.save();
        res.redirect(req.session.last_url);
    } catch (err) {
        res.send(`Error on cancel add friend route: ${err}`);
    }
});

// Handle fetch friend list of current user in session
router.get('/friend_list', auth, async (req, res) => {
    const userId = req.session.userId;
    let friend_list = [];
    try {
        const user = await User.findById(userId);
        for (const id of user.friends) {
            const friend = await User.findById(id);
            friend_list.push(friend);
        }
        res.render("user", {req: req, user: user, friend_list: friend_list});
    } catch (err) {
        res.send(`Error on fetch friend list route: ${err.stack}`);
    }
})

// Handle fetching add friend request list of current user 
router.get('/request_list', auth, async (req, res) => {
    const userId = req.session.userId;
    let request_list = [];
    try {
        const user = await User.findById(userId);
        for (const id of user.req_friends) {
            const friend = await User.findById(id);
            request_list.push(friend);
        }
        res.render("user", {req: req, user: user, request_list: request_list});
    } catch (err) {
        res.send(`Error on fetch request list route: ${err.stack}`);
    }
})

// Handle accept request when add friend
router.get('/accept_friend/:userId', auth, async (req, res) => {
    const userId = req.session.userId;
    const req_id = req.params.userId;
    try {
        const user = await User.findById(userId);
        const req_user = await User.findById(req_id);
        user.req_friends.pull(req_id);
        user.friends.addToSet(req_id);
        req_user.friends.addToSet(userId);
        await user.save();
        await req_user.save();
        res.redirect("/user/request_list");
    } catch (err) {
        res.send(`Error on accept friend request route: ${err.stack}`);
    }
});

// Handle reject request when add friend
router.get('/reject_friend/:userId', auth, async (req, res) => {
    const userId = req.session.userId;
    const req_id = req.params.userId;
    try {
        const user = await User.findById(userId);
        user.req_friends.pull(req_id);
        await user.save();
        res.redirect("/user/request_list");
    } catch (err) {
        res.send(`Error on reject friend request route: ${err.stack}`);
    }
});

// Handle unfriend request
router.get('/unfriend/:userId', auth, async (req, res) => {
    const userId = req.session.userId;
    const req_id = req.params.userId;
    try {
        const user = await User.findById(userId);
        const req_user = await User.findById(req_id);
        user.friends.pull(req_id);
        req_user.friends.pull(userId);
        await user.save();
        await req_user.save();
        res.redirect("/user/friend_list");
    } catch (err) {
        res.send(`Error on unfriend route: ${err.stack}`);
    }
});

module.exports = router;