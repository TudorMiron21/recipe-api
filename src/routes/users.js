import  express  from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserModel } from "../models/Users.js";

const router = express.Router();

router.post("/register", async(req, res)=>{ //register api
    const {username ,password,email,phoneNumber} =req.body;
    const user = await UserModel.findOne({username: username});

    if(user){
        return res.json({message:"This user allready exists!"});
    }
    const hashedPassword = await bcrypt.hash(password,10);
               
    const newUser = new UserModel({username, password: hashedPassword,email:email,phoneNumber:phoneNumber});

    await newUser.save();
    res.json({message:"User registered succesfully"});

    res.json(user);
});

router.post("/login", async(req,res)=>{ //login api
    const {username ,password} =req.body;
    const user = await UserModel.findOne({username: username});

    if(!user){
        return res.json({message:"This user does not exist"});
    }
    
    const isPasswordValid = await bcrypt.compare(password,user.password);

    if(!isPasswordValid)
    {
        return res.json({message:"Username or password is incorrect!"});
    }

    const token = jwt.sign({id:user._id},"secret");//the secret of a token is used for verifing if th etoken is still valid it is like a hash for the token
    res.json({token, userId:user._id});
});

router.get("/register/:userID", async(req,res) => {

    try{
        const user = await UserModel.findById(req.params.userID);
        res.json(user);
    }catch(err){
        res.json(err);
    }
});

export {router as userRouter};

// middleware for tokens
export const verifyToken = (req,res,next) =>{
    const token = req.headers.authorizations;

    if(token )
    {
        jwt.verify(token,"secret",(err) =>{
            if(err) return res.sendStatus(403);
            next();
        });
    }
    else{
        res.sendStatus(401);
    }
}