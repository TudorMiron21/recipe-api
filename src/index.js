import express from "express"; // the e in mern.important for seting up the api
import cors from 'cors';// used for communication between the sever and the client
import mongoose from 'mongoose';// db management system 
import {userRouter} from './routes/users.js';
import {recipesRouter} from './routes/recipes.js';
// require('dotenv').config();

const app = express();

app.use(express.json());//data form fornt end in a .json format
app.use(cors());

app.use("/auth",userRouter);//connect endpoint with model cretaed in the user.js file
app.use("/recipes",recipesRouter);//connect endpoint with model cretaed in the recipes.js file


mongoose.connect("mongodb+srv://Tudor:Parola21@recipes.ezuvusw.mongodb.net/recipes?retryWrites=true&w=majority");

app.listen(process.env.PORT ||3001,()=>console.log("server started!"));





