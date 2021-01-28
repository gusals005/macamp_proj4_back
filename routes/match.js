const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const Match = require('../models/match.js');
const Betting = require('../models/betting.js');
const ObjectId = require('mongodb').ObjectId;

//모든 match 다 가져오기
router.get('/', async (req, res) => {
    try {
        const output = await Match.find();
        

        console.log("output",output);
        
        output.forEach(element => {
            
            /*베팅이 가능한 상태 & 경기가 끝나서 score 입력이 되었다면
             *이제 베팅한 돈을 딴 사람들에게 뿌려주면 됨
             *배당률 만큼 지급하면 됨.
             */
            let odds = 0.0;
            if(element.can_betting && element.home_score != 0){
                let bettings = [];
                let user_id = "";
                let user_coin = 0;

                //home 팀의 승리
                if(element.home_score > element.away_score){
                    odds = element.win_odds;
                    bettings = element.win_betting;

                    //이긴다에 건 사람들 모두에게 coin 지급
                    bettings.forEach(element1 => {
                        user_id = element1.user_id;
                        
                        //베팅한 유저정보 가져오기
                        User.findOne({user_id:user_id})
                        .then((result) => {
                            let cU = result;
                            
                            //해당 유저 coin 수 증가.
                            user_coin = (cU.coin + element1.amount *odds).toFixed(0);
                            User.update({user_id:user_id},{coin:user_coin})
                            .then((result1)=>{
                                let hi = result1;
                            });
                        });                        
                    })
                }
                //away 팀의 승리
                else{
                    odds = element.lose_odds;
                    bettings = element.lose_betting;

                    //진다에 건 사람들 모두에게 coin 지급
                    bettings.forEach(element1 => {
                        user_id = element1.user_id;

                        //베팅한 유저정보 가져오기
                        User.findOne({user_id:user_id})
                        .then((result) => {
                            let cU = result;

                            //해당 유저 coin 수 증가.
                            user_coin = (cU.coin + element1.amount *odds).toFixed(0);
                            User.update({user_id:user_id},{coin:user_coin})
                            .then((result1)=>{
                                let hi = result1;
                            });
                        });                        
                    })
                }

                //match 의 can_betting을 false로 바꾸어주기.
                const match_o_id = new ObjectId(element._id);
                Match.update({_id:match_o_id},{can_betting:false})
                .then((result)=>{ let hi = result; });
            }
        })
        
        res.status(200).json(output);

    } catch (error) {
        res.status(500).json({ message: error });
    }
});

//match_id에 해당하는 경기에 betting하기.
//user_id도 확인해서 그 사람의 coin 정보/betting정보도 업데이트 해주어야 함.
    //1. betting 정보를 만든다.
    //2. betting 정보를 betting db에 insert한다
    //3. 그 betting 정보를 match_id가 맞는 match 에다가 넣어준다.
    //4. 그 betting 정보를 해당 user 데이터 안에 넣어준다.
    //5. user 데이터 안에 coin을 베팅한 금액만큼 빼준다.
    //6. 배당률 계산을 새로 하기.

//response | user_id, match_id, amount, prediction(WinLose)
//request  | 배당률 다시 계산해서 알려주기.
//url: /match/betting
router.post('/betting', async (req, res) => {
    try {
        ///Request Debug///
        console.log(req.body);
        
        //1. betting 정보 만들어서 넣기
        let new_betting = new Betting(req.body);
        
        new_betting.save(function(err){
            if(err){
                console.err(err);
                res.status(200).json({message:"error"});
                return;
            }
        });

        const match_o_id = new ObjectId(req.body.match_id);
        let now_match = await Match.findOne({_id:match_o_id});
        console.log(now_match);
        let betting = [];

        //2.이 베팅정보를 match_id가 맞는 match에다가 넣어주기.
        switch(req.body.prediction){
            case "WIN" :
                betting = now_match.win_betting;
                betting.push(new_betting);
                await Match.update({_id:match_o_id}, {win_betting:betting});
                break;
            case "LOSE" :
                betting = now_match.lose_betting;
                betting.push(new_betting);
                await Match.update({_id:match_o_id}, {lose_betting:betting});
                break;
            default:
                break;
        }

        //3~4 | 그 betting 정보를 해당 user 데이터 안에 넣어준다.
        //    | user 데이터 안에 coin을 베팅한 금액만큼 빼준다.
        const user = await User.findOne({user_id:req.body.user_id});
        let user_betting = user.betting;
        let user_coin = user.coin;

        user_betting.push(new_betting);
        user_coin = user_coin - req.body.amount;

        await User.update({user_id:req.body.user_id}, {coin :user_coin ,betting:user_betting});

        
        //5. 배당률 계산을 새로 하기.
        let win_total_amount = 1000;
        let lose_total_amount = 1000;
        let win_odds = 0.0;
        let lose_odds = 0.0;
        now_match = await Match.findOne({_id:match_o_id});

        //win_total_amount
        now_match.win_betting.forEach(element =>{
            win_total_amount += element.amount;
        });
        
        console.log(win_total_amount);

        //lose_total_amount
        now_match.lose_betting.forEach(element => {
            lose_total_amount += element.amount;
        });
        console.log(lose_total_amount);
        
        //calculate odds
        win_odds = (win_total_amount + lose_total_amount * 0.88) / win_total_amount;
        lose_odds = (lose_total_amount + win_total_amount * 0.88) / lose_total_amount;
        console.log(win_odds,lose_odds);
        win_odds = win_odds.toFixed(2);
        lose_odds = lose_odds.toFixed(2);
        await Match.update({_id:match_o_id}, {win_odds:win_odds,lose_odds:lose_odds});

        res.status(200).json({win_odds:win_odds,lose_odds:lose_odds, betting:user_betting});
    } catch (error) {
        res.status(500).json({message: error});
    }
})

//해당 id?날짜?에 해당하는 match 만 가져오기?
router.get('/:id', async (req, res) => {
    try {
        const output = await Match.findOne({_id:req.params.id});
        res.status(200).json(output);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});
module.exports = router;