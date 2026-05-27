const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({

  username: String,

  resource: String,

  accessLevel: String,

  status: String

});

module.exports = mongoose.model('Record', recordSchema);