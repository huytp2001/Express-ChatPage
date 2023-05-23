const express = require('express');
const User = require('../models/user');
const router = express.Router();
const auth = require("../middleware/auth");

// Route to search for user
router.get('/', auth, async (req, res) => {
    const keyword = req.query.keyword;
    req.session.keyword = keyword;
    try {
        const users = await User.find({
            $or: [
                {username: { $regex: new RegExp(keyword, 'i')}},
            ],
        });
        const user = await User.findById(req.session.userId);
        res.render("search", {cr_user: user, users: users, keyword: keyword});
    } catch (err) {
        res.send(`Error in search route: ${err}`);
    }
})

// Route that handle add friend function
router.get('/add_friend/:userId', auth, async (req, res) => {
    const friend_id = req.params.userId;
    const user_id = req.session.userId;
    try {
        const friend = await User.findById(friend_id);
        if (friend == null) {
            res.send("Undefine userId");
            return;
        }
        friend.req_friends.addToSet(user_id);
        await friend.save();
        res.redirect(`/search?keyword=${req.session.keyword}`);
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
        if (friend == null) {
            res.send("Undefine userId");
            return;
        }
        friend.req_friends.pull(user_id);
        await friend.save();
        res.redirect(`/search?keyword=${req.session.keyword}`);
    } catch (err) {
        res.send(`Error on cancel add friend route: ${err}`);
    }
});

module.exports = router;