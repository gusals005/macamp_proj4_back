const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const Betting = require('../models/betting.js');

router.get('/', async (req, res) => {
    try {
        const output = await User.find();
        res.status(200).json(output);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

router.post('/login', async (req, res) => {
    try {
        console.log(req.body);
        let currentUser = await User.findOne({user_id: req.body.id, password: req.body.password});
        console.log(currentUser);
        if(currentUser === null)    res.status(404).send({"Message":"fail"});
        else    res.status(200).json(currentUser);
    } catch (error) {
        res.status(500).json({message: error});
    }
})

module.exports = router;