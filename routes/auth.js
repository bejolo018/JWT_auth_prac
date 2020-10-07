const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken')
const bcrpyt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../validation')

router.post('/register', async (req, res) => {
    //Validation
    const { error } = registerValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    // Check if user is already in database
    const emailExist = await User.findOne({email: req.body.email})
    if(emailExist) return res.status(400).send('Email already exists');

    //Hash password
    const salt = await bcrpyt.genSalt(10);
    const hashedPassword = await bcrpyt.hash(req.body.password, salt)

    // Create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    })
    try{
        const savedUser = await user.save()
        res.send({user: user._id})
    } catch(err){
        res.status(400).send(err)
    }
})

router.post('/login', async (req, res) => {
    //Validation
    const { error } = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // Check if email exists
    const user = await User.findOne({email: req.body.email})
    if(!user) return res.status(400).send("Email not found.");
    // Check is correct password
    const validPass = await bcrpyt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('invalid password')

    // Create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send(token)
})

module.exports = router;