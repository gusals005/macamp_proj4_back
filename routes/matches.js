const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const Match = require('../models/match.js');
const Betting = require('../models/betting.js');

//모든 match 다 가져오기
router.get('/', async (req, res) => {
    try {
        const output = await Match.find();
        res.status(200).json(output);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

//해당 id?날짜?에 해당하는 match 만 가져오기?
router.get('/:id', async (req, res) => {
    try {
        const output = await Match.findOne({_id:req.params.id});
        res.status(200).json(output);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

//베팅할 때 post-> 누가 얼마를 얼마나 걸었다.
//데이터 받으면 배당률 다시 계산해서 알려주기.
router.post('/betting', async (req, res) => {
    try {
        ///Request Debug///
        console.log(req.body);
        
        ///id 겹치는지 확인
        let currentUser = await User.findOne({user_id: req.body.user_id});
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