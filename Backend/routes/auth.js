const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require('express-validator');

// creating the user POst : api/auth/createuser  no log in required 

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
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        });

        res.json(user)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured.");
    };
});

module.exports = router;