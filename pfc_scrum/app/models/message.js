/**
 * Created by J. Ricardo de Juan Cajide on 8/20/14.
 */
var mongoose = require('mongoose');

//Schema
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
    name: String,
    subject: String
});

//Model
var Message = mongoose.model('messages', MessageSchema);

module.exports = Message;