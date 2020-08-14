const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use('/',require('./routes/route-attendence'));


mongoose.connect(process.env.URL,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{
	console.log('connection successfull')
	app.listen(PORT,()=>{
	console.log(`server listening on http://localhost:${PORT}`);

})

})
.catch(err=>console.log('error occured',err));
