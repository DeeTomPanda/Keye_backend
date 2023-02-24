import mongoose from 'mongoose';

const userSchema=mongoose.Schema({
	name:String,
	pass:String,
	DLno:String,
	AadharNo:Number,
	Print:String,
	addlUsers:[{
		name:String,
		DLno:String,
		AadharNo:Number,
		Print:String}]	
})

export default mongoose.model('userData',userSchema)
