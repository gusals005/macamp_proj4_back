const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const User = require('../../models/user')

exports.signup = async (req, res) => {
    try {
        console.log(req.body);
        const currentUser = await User.findOne({user_id: req.body.user_id});
        console.log(currentUser);
        if(currentUser === null){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);

            var newUser = new User({
                user_id: req.body.user_id,
                password: hashedPassword,
                name: req.body.name,
                coin: req.body.coin
            });

            newUser.save(function(err) {
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
}

exports.login = async (req, res) => {
    try {
        const secret = req.app.get('jwt-secret')
        const currentUser = await User.findOne({ user_id: req.body.user_id });
        if(currentUser === null)    return res.status(200).send({"message":"fail"});
        
        const isValid = await bcrypt.compare(req.body.password, currentUser.password);
        if(!isValid)    return res.status(200).send({"message":"fail"});

        const token = await jwt.sign({
                user_id: req.body.user_id,
                password: req.body.password
            },
            secret,
            {
                expiresIn: '1d',
                subject: 'userInfo'
            });

        res.status(200).send(token);
    } catch (error) {
        res.status(500).json({message: error});
    }
}

exports.check = (req, res) => {
    res.json({
        success: true,
        info: req.decoded
    })
}