const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require("../models/user");

// Handle login page
router.get('/', (req, res) => {
    res.render("login");
})

// Validate login
router.post('/', async (req, res) => {
    const data = req.body;
    try {
        let findUser = await User.findOne({username: data.username});
        if (findUser == null) {
            findUser = await User.findOne({email: data.username});
        }
        if (findUser == null) {
            res.render('login', {message: 'Username or password incorrect'});
            return;
        }
        const compare = await bcrypt.compare(data.password, findUser.password);
        if (findUser == null || !compare) {
            res.render('login', {message: 'Username or password incorrect'});
            return;
        }
        let friend_list = [];
        let req_friend_list = [];
        for (const id of findUser.friends) {
            const friend = await User.findById(id);
            friend_list.push(friend);
        }
        for (const id of findUser.req_friends) {
            const friend = await User.findById(id);
            req_friend_list.push(friend);
        }
        req.session.userId = findUser.id;
        res.render('dashboard', {user:findUser, friend_list: friend_list});
    } catch (err) {
        console.log(`login error: ${err} `);
    }
})

module.exports = router;