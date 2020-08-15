const mongoose = require('mongoose');

const LocationSchema = mongoose.Schema({
	empId:{
		type:String,
		required:true
	},
	lat:{
		type:String,
		required:true,
	},
	lon:{
		type:String,
		required:true,
	},
	created_at:{
		type:Date,
		default:Date.now
	}

});

module.exports = mongoose.model('location',LocationSchema);