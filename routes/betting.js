const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const Match = require('../models/match.js');
const Betting = require('../models/betting.js');

//모든 Betting set 다 가져오기
//url : /betting/
router.get('/', async (req, res) => {
    try {
        const output = await Betting.find();
        res.status(200).json(output);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

//원하는 user_id가 배팅한 모든 정보 Get 하기.
//url : /betting/user/~~~
router.get('/user/:id', async (req, res) => {
    try {
        const output = await Betting.find({user_id:req.params.user_id});
        res.status(200).json(output);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

module.exports = router;