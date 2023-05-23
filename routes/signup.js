const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require("../models/user");

// Handle signup page
router.get('/', (req, res) => {
    res.render("signup");
})

// Create user
router.post('/', async (req, res) => {
    const data = req.body;
    const hash = await bcrypt.hash(data.password, 10);
    try {
        const newUser = new User({
            email: data.email,
            username: data.username,
            password: hash
        });
        await newUser.save();
        res.render("login", {message: 'Your account has been create'});
    } catch (err) {
        res.render("signup", {message: `Signup failed :${err}`});
    }
})

module.exports = router;