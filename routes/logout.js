const express = require('express');
const router = express.Router();

// Remove session and logout route
router.get('/', (req, res) => {
    req.session.destroy((err)=>{
        if (err) throw err;
    })
    res.redirect("login");
})

module.exports = router;