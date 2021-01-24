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

router.post('/', async (req, res) => {
    console.log(req.body);
    try{
        let newUser = new User(req.body);
        output = await newUser.save();
        res.status(200).json(output);
    } catch (error) {
        res.status(500).json({message: error});
    }
})

module.exports = router;