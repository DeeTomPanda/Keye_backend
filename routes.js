import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userDataModel from './schema.js';

const router=express.Router()

//Adds a new secondary user
router.patch('/addreguser',async (req,res,next)=>{
		console.log("Request reached @reguser")
		const {Aadhar_no,DL_no,name}=req.body.data
		const {origDL_no}=req.body
		console.log(req.body)
		await userDataModel.findOneAndUpdate({DLno:origDL_no},
			{$push:{addlUsers:{
					name,
					AadharNo:Aadhar_no,
					DLno:DL_no}
				}
			}
		)
		res.status(201).send(req.body.data)}
)

//Sign in of a 'primary' user
router.post('/login',async (req,res)=>{
		console.log("At login")
		const {DL_no,password}=req.body
		const user=await userDataModel.findOne({DLno:DL_no})
		console.log(req.body.password)
		if(user){
			const{pass}=user
			console.log(password,pass)
			await bcrypt.compare(password,pass,(err,result)=>{
				
				if(err)
					throw err
				if(result)
					res.status(201).send(user)
				else
					res.status(401).send("Wrong credentials")
			})
		}
		else
			res.status(401).send("User does not exist!")
	})

//Register's new 'primary' user
router.post('/register',async (req,res)=>{
		console.log("Reached Registration")
		const {checked}=req.body			//checked is undefined in Register.js,
								//checked is defined/valid in Password.js
		if(!checked){
			//Checking if user exists before setting up a pass
			const {email,Aadhar_no,name,DL_no}=req.body
			const user=await userDataModel.findOne({DLno:DL_no})
			if(!user){
				res.status(201).send("User can be created")}
			else
				res.status(401).send("User exists")
		}
		else{	//Registering a user after setting a pass
			const {email,name,DL_no,Aadhar_no}=req.body.data
			let {pass}=req.body
			await bcrypt.hash(pass,10,async(err,hash)=>{
				if(err)
					throw err
			
				await userDataModel.create({
						email,
						name,
						DLno:DL_no,
						AadharNo:Aadhar_no,
						pass:hash})
			})
			res.status(201).send("User created!")}
	})


//Deletes a single secondary user
router.delete('/deleteuser',async(req,res)=>{
		console.log("At Delete,Deleting User")
		const {DL_no,Aadhar_no,DLno}=req.body
		console.log(DL_no,Aadhar_no,req.body)
		await userDataModel.findOneAndUpdate({DLno},
			{"$pull":{
				"addlUsers":{
					"AadharNo":Aadhar_no}
				}
			}
		)
		res.status(201).send("Deleted User "+req.body.username)}
)

//Edits a single secondary user
router.patch('/edituser',async (req,res)=>{
		const {Aadhar_no,DL_no,primeDL,name,orig_DL}=req.body
		await userDataModel.updateOne({
				"DLno":primeDL,'addlUsers.DLno':orig_DL},
			{$set:{
				'addlUsers.$.name':name,
				'addlUsers.$.DLno':DL_no,
				'addlUsers.$.Aadharno':Aadhar_no}
			}
		)
		res.status(201).send(req.body)}
)
export default router

