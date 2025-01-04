const userModel=require('../models/user.model');
const jwt=require('jsonwebtoken');
require('dotenv').config();

const secretKey=process.env.JWT_SECRET;

exports.registerUser= async(req,res)=>{
    const {firstName,lastName,username,password}=req.body;
    try{
        const duplicate=await userModel.findOne({username});
        if(duplicate&&duplicate>0){
            return res.status(400).send({message:'user already registered with this user name!'});
        }
        let user=new userModel({firstName,lastName,username,password});
        const result=await user.save();
        console.log(result);
        res.status(201).send({message:"user registered successfully!",registeredUser:result})
    }
    catch(err){
        console.log(err);
        res.status(400).send(err);
    }
}


exports.loginUser=async(req,res)=>{
    try{
        const {username,password}=req.body;
        const user=await userModel.findOne({username});
        if(!user){
            return res.status(404).send({error:"Authentication Failed!"});
        }
        const isPasswordValid=await user.comparePassword(password);
        if(!isPasswordValid){
            return res.status(404).send({error:"wrong password"})
        }
        let token=jwt.sign({userId:user?._id},secretKey,{expiresIn:'1h'});
        let finalData={
            userId:user?._id,
            username:user?.username,
            firstName:user?.firstName,
            lastName:user?.lastName,
            token
        }
        res.send(finalData);
    }catch(err){
        console.log(err);
        res.status(400).send(err);
    }
}