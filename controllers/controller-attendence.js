const Attendence = require('../models/attendence');
const moment = require('moment');


 function locationMeasure(lat,lon){
 	//base coordinates
	const lat1 = 40.689202777778;
	const lon1 = -74.042219444444;

	let lat2 = lat;
	let lon2 = lon;

	const R = 6371e3; // metres
	const a1 = lat1 * Math.PI/180; // φ, λ in radians
	const a2 = lat2 * Math.PI/180;
	const l1 = (lat2-lat1) * Math.PI/180;
	const l2 = (lon2-lon1) * Math.PI/180;

	const a = Math.sin(l1/2) * Math.sin(l1/2) +
	          Math.cos(a1) * Math.cos(a2) *
	          Math.sin(l2/2) * Math.sin(l2/2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

	const d = R * c; // in metres
	console.log(`distance in meters ${d} meters.`);

	if(d>5000)
		return false;
	else
		return true;

 }


 function checkIn(req,res,next){

 	// check whether the employee is within 500m meters
 	let isPermitted = locationMeasure(req.body.lat,req.body.lon);

 	if(isPermitted){

 		//create a new employee attendence object
 		const newAttendence = new Attendence({
		empId:req.body.empId,
		inTime :req.body.inTime,
		outTime:req.body.outTime,
		lateInReason:req.body.lateInReason,
		lateInReason:req.body.lateInReason,
		EarlyOutReason:'',
		lateIn:false,
		earlyOut:false
	});

 	let today = newAttendence.inTime.toString();
	let todayTime = (today.split(' '));
	let currentTime = (todayTime[4]).split(':');
	
	// time = 10 am
	if(currentTime[0] >= 10){
		newAttendence.lateIn = true;
	}else{
		newAttendence.lateInReason = 'not late';
		newAttendence.lateIn = false;
	}

	// save the attendence object into the database
	newAttendence.save((err,data)=>{
		if(err){
			console.log('attendence not saved in the database');
			res.send(err);
		}
		else{
			res.send(data);
		}
	});

 	}else{
 		res.json({
 			'error':true,
 			'message':'user is not within the permitted limited of 500m range from the office location'
 		})
 	}
 }

//get the attendence details for the current day
function attendenceDetails(req,res,next){

		let today = moment().startOf('day');

		Attendence.find({
			empId:req.params.id,
			entryDate:{
				$gte : today.toDate(),
				$lte : moment(today).endOf('day').toDate()
			}
		}).then(results=>{
			res.status(200).send(results);
		}).catch(err=>{
			console.log('error',err);
			res.json(err);
		})	
}

// get the monthly details for an employee
async function monthlyAttendence(req,res,next){

		let begin,last;
		begin = moment().startOf('month').toDate(); // 1st date of the month
		last  = moment().endOf('month').toDate(); // last date of the month

		try{

			let report = await Attendence.find({
				empId:req.params.id,
				entryDate:{
					$gte: begin,
					$lte : last,
				}
			});


			res.send(report);

		}
		catch(err){
			console.log(err);
			res.send('error');
		}
}





async function checkOut(req,res,next){
	try{

		let today1 = moment().startOf('day');

			const filter = {
			empId:req.body.empId,
			entryDate:{
				$gte : today1.toDate(),
				$lte : moment(today1).endOf('day').toDate()
				}
			}


			const update = {
				outTime:req.body.outTime,
				EarlyOutReason:req.body.EarlyOutReason,
			}

			let today = update.outTime.toString();
			let todayTime = (today.split(' '));
			let currentTime = (todayTime[4]).split(':');
			
			// time = 6pm
			console.log(currentTime[0]);

			if(currentTime[0] <= 17){
				update.earlyOut=true;
			}else{
				update.EarlyOutReason = 'not early';
				update.earlyOut=false;
			}

			let doc = await Attendence.findOneAndUpdate(filter,update,{new:true});
			res.send(doc);

	}
	catch(err){
		console.log(err);
		res.send(err);
	}

}

 module.exports = {
 	checkIn,attendenceDetails,checkOut,monthlyAttendence
 }