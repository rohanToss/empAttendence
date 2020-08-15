const moment = require('moment');

const Location = require('../models/location');
const Attendence = require('../models/attendence');


async function isCheckedIn(empId){

	let today1 = moment().startOf('day');
	let result = await Attendence.findOne({
		empId:empId,
		entryDate:{
			$gte : today1.toDate(),
			$lte : moment(today1).endOf('day').toDate()
		}
	})

	return new Promise((resolve,reject)=>{
		if(result)
			resolve(true);
		else
			reject(false);
	})
}



async function saveCurrentLocation(req,res,next){

	try{
		if(!req.body.empId){
			return res.json({
				'error':true,
				'message':'empId not provided'
			})
		}
		else if(!req.body.lat || !req.body.lon ){
			return res.json({
				'error':true,
				'message':'latitude or longitude not provided'
			})
		}

		let isExist = await isCheckedIn(req.body.empId);
		console.log('user exist and has checked In');

		if(isExist){
			
			const currentLocation = new Location({
			empId:req.body.empId,
			lat:req.body.lat,
			lon:req.body.lon
			});

			const response = await currentLocation.save();
			if(response){
				res.json({
					'error':false,
					'data':response
				})
			}else{
				res.json({
					'error':true,
					'message':'something went wrong'
				})
			}

		}

	}catch(err){
			console.log(err);
			res.json({
				'error':true,
				'message':'location details not saved'
			})
	}	
}

async function getlocationDetails(req,res,next){
	
	let today1 = moment().startOf('day');

	try{
		let locations = await Location.find({
						empId:req.params.id,
						created_at:{

							$gte : today1.toDate(),
							$lte : moment(today1).endOf('day').toDate()
						}
		});
		if(locations.length>0){
			return res.json({
				'error':false,
				'data': locations
			})
		}else{
			return res.json({
				'error':true,
				'message':'location details not found for the day'
			})
		}

	}catch(err){
		res.json({
			'error':true,
			'message':'details not found'
		})
	}
	


}


module.exports ={
	saveCurrentLocation,
	getlocationDetails
}