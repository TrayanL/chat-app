const express = require('express');
const usersRouter = express.Router();
const User = require('../models/User');
const cors = require('cors')
const jwt = require('jsonwebtoken');
//VALIDATION
const {registerValidation} = require('../validation/validation');
const bcrypt = require('bcryptjs');
const verifyToken = require('../verifytoken');

usersRouter.options('*', cors())

//REGISTER ENDPOINT
usersRouter.post('/register', async function(req, res, next) {
    //Validate User
    console.log("register")
    const validation = registerValidation(req.body)
    console.log(req.body)
    if (validation.error) return res.status(400).send({error: validation.error.details[0].message});
    
    //Check if user is already in DB
    const userExists = await User.findOne({username: req.body.username});
    if(userExists) return res.status(403).send({error: 'User already exists'})
    
    //Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
      const user = new User({
        username: req.body.username,
        password: hashedPassword
      });
      try {
      await user.save()
      res.json("Success")
      }
      catch (error){
        res.json(error)
      }
    });

    //LOGIN ENDPOINT
    usersRouter.post('/login', async (req, res, next) => {

      const foundUser = await User.findOne({username: req.body.username})
      if (!foundUser) {
        return res.status(401).json({error: 'User not found'})
      }
      bcrypt.compare(req.body.password, foundUser.password, (error, data) => {
          if (error) {
            res.status(401).json({error: 'Wrong password'})
          } else {
            const token = jwt.sign({user: foundUser}, 'pineapple')
            return res.json({
              token: token,
              user: foundUser
            })
          }
    });
  })

    usersRouter.get('/all', verifyToken, async (req, res, next) => {
      
      console.log('getting users ')
      const allUsers = await User.find();
      console.log(allUsers)
      res.json({allUsers});
    })


    usersRouter.get('/user',(req, res, next) => {
      console.log(req.session)
      console.log(req.user)
      res.json({user: req.user});
    })

    module.exports = usersRouter;