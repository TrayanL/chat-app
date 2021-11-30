const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    // user: {
    //     type: mongoose.Types.ObjectId, ref: 'User'
    // },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Message', messageSchema);