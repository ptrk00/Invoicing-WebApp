const User = require('../models/user');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken')

exports.register = async (req,res) => {

    let psswd;
    try {
        psswd = await CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_SECRET).toString();
    } catch (err) {
        console.log(err);
    }
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: psswd
    });

    try {
        const saved = await user.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json(err);
    }

}

exports.login = async (req,res) => {

    try {
        const user = await User.findOne({username: req.body.username});

        if(!user) {
            res.status(401).send('user not found!');
        }

        else {
            const usrPsswdInDB = CryptoJS.AES.decrypt(user.password, process.env.PASSWORD_SECRET).toString(CryptoJS.enc.Utf8);
            usrPsswdInDB !== req.body.password && res.status(401).json("Wrong password!");

            const token = jwt.sign({id: user._id}, process.env.TOKEN_SECRET, {expiresIn: '1800s'});

            const {password, ...others} = user._doc;
            res.status(200).json({...others, token});
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};