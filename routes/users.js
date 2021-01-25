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
        console.log(req.body.id);
        console.log(req.body.password);
        let currentUser = await User.findOne({user_id: req.body.id, password: req.body.password});
        console.log(currentUser);
        if(currentUser === null)    res.status(200).send({"message":"fail"});
        else    res.status(200).json(currentUser);
    } catch (error) {
        res.status(500).json({message: error});
    }
})

router.post('/signup', async (req, res) => {
    try {
        ///Request Debug///
        console.log(req.body);
        
        ///id 겹치는지 확인
        let currentUser = await User.findOne({user_id: req.body.id});
        console.log(currentUser);
        //겹치는 id가 없으면.
        if(currentUser === null){
            var newUser = new User(req.body);
            //server에 저장하기.
            newUser.save(function(err){
                if(err){
                    console.error(err);
                    res.status(200).json({message:"error"});
                    return;
                }
                res.status(200).json({message:"success"});
            });
        }    
        else{
            res.status(200).send({"Message":"already exist.(id)"});
        }    
    } catch (error) {
        res.status(500).json({message: error});
    }
})

module.exports = router;