const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fatchuser = require('../middleware/fatchuser');



const jWT_SECRATE = "thisismynamerajkansagara";


//Route 1 :- creating the user Post : api/auth/createuser ==> no log in required 

router.post('/createuser', [
    // Validate name, email and password fields 
    body('email', "enter tha valid email Address").isEmail(),
    body('password', "password must be atleast 5 charactor").isLength({ min: 5 }),
    body('name', "invalid name").isLength({ min: 3 }),
], async (req, res) => {
    //if there are error, then return the bad request or error.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        let user = await User.findOne({ email: req.body.email });
        // console.log(user)
        if (user) {
            return res.status(400).json({ error: "this User is already exist" });   //conflict status code for already exist user
        }

        const salt = await bcrypt.genSalt(10);
        const sequrefunction = await bcrypt.hashSync(req.body.password, salt);

        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: sequrefunction
        });

        const data = {
            user: {
                id: user.id
            }
        }
        const AuthToken = jwt.sign(data, jWT_SECRATE);
        // console.log(AuthToken);

        // res.json(user)
        res.json({ AuthToken })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured.");
    };
});
// _________________________________________________________________________________________________________________________________________________________
// Route 2 :-  authentication of the user : api/auth/login ==> no log in required 

router.post('/login', [
    // Validate name, email and password fields 
    body('email', "enter tha valid email Address").isEmail(),
    body('password', "password cannot be empty").exists(),
], async (req, res) => {
    //if there are error, then return the bad request or error.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }


    const {email , password} = req.body;

    try {
        //get user from the data base and compare with the given email
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message : "invalid email"})
        }

        //get user from the data base and compare with the given password
        const passwordcompare = await bcrypt.compare(password, user.password);
        if(!passwordcompare){
            return res.status(400).json({ message : "Invalid Password"})
        }

        const data = {
            user : {
                id : user.id
            }
        }

        const AuthToken = jwt.sign(data, jWT_SECRATE);
        res.json({AuthToken})

    } catch (error) {
        console.error(error.message)
        res.status(500).send("something error occured in the backend")
    }
});
module.exports = router;
// _______________________________________________________________________________________________
//Route 3 :-  authentication of the user : api/auth/getuser ==> no log in required 
router.post('/getuser',fatchuser, async (req, res) => {
try {
    let userid = req.user.id;
    const user = await User.findById(userid).select("-password");
    res.send(user)
} catch (error) {
    console.error(error.message);
    res.status(500).send("something error occured in the backend");
}

})







