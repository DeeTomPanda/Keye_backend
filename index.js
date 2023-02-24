import express from 'express'
import Cors from 'cors'
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import userDataModel from './schema.js';
import router from './routes.js';

const port = process.env.PORT || 8080
const app=express()

//Middleware

app.use(Cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(router)

//DB Config
const dbURL='mongodb+srv://Divakar:DivakarS@cluster0.zqcpn82.mongodb.net/?retryWrites=true&w=majority'

mongoose.connect(dbURL,{ 
			useNewUrlParser: true,
    			useUnifiedTopology: true
})

app.get('/',(req,res)=>{
	res.status(200).send("Success!@/")}
)

app.listen(port,()=>console.log("Listening"))


