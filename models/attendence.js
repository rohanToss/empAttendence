const mongoose = require('mongoose');

const AttendenceSchema = mongoose.Schema({
	empId:{
		type:String,
		required:true,
	},
	inTime :{
		type:Date,
		default:Date.now
	},
	outTime:{
		type:Date,
		default:Date.now
	},
	lateInReason:{
		type:String,
		default:'employee is late'
	},
	EarlyOutReason:{
		type:String
	},
	lateIn:{
		type:Boolean,
	},
	earlyOut:{
		type:Boolean,
	},
	entryDate:{
		type:Date,
		default:Date.now
	}
});

module.exports = mongoose.model('attendence',AttendenceSchema);
