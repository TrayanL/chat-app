const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
    roomName: {
        type: String,
        required: true
    },
    users: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Users'}]
    }
});

module.exports = mongoose.model('Room', roomSchema);