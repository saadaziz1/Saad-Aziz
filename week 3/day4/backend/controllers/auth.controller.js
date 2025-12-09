const User = require('../models/user.model')
const jwt = require('jsonwebtoken')

const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'1h'})
}

exports.register = async(req,res) =>{
    try {
        const {name,email,password} = req.body;
        
        const existing = await User.findOne({email});
        if(existing){
            return res.status(400).json({message:'Email already exists'});
        }

        const user = await User.create({name,email,password});

        return res.status(201).json({message: "User registered",token: generateToken(user._id)});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

exports.login =async(req,res) =>{
    try {
        const{email,password} =req.body;

        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message:'User not found'});

        const isMatch = await user.matchPassword(password)
        if(!isMatch) return res.status(400).json({message: "incorrect password"});

        return res.status(200).json({message: "User logged in", token: generateToken(user._id)});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}