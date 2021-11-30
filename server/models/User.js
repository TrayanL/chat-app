const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    messages: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Message'}]
    }
});

module.exports = mongoose.model('Users', UserSchema);