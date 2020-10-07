const router = require('express').Router();
const User = require('../models/User');
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

module.exports = router;