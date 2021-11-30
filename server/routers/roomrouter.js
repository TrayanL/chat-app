const express = require('express');
// const cors = require('cors');
// const jwt = require('jsonwebtoken');
//VALIDATION
const verifyToken = require('../verifytoken');
const roomRouter = express.Router();
const Room = require('../models/Room')


roomRouter.post('/room', verifyToken, async(req, res, next) => {
    const newRoomObj = req.body
    try {
        const newRoom = await Room.create(newRoomObj)
        await newRoom.save();
        res.status(200).json('Success!')
        
    } catch(error) {
        console.log(error)
        res.status(400)
    }

})
roomRouter.get('/room', verifyToken, async(req, res, next) => {
    try {
        const allRooms = await Room.find()
        res.status(200).json(allRooms)
        
    } catch(error) {
        console.log(error)
        res.status(400)
    }

}) 


module.exports = roomRouter;