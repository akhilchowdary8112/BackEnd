const joi=require("joi")
const bcrypt=require("bcrypt")
const express=require("express")
const jwt=require("jsonwebtoken")
const { User }=require("../models/user")
const router=express.Router()
router.post("/",async(req,res)=>{
    const schema=joi.object({
        name:joi.string().min(3).max(30).required(),
        email:joi.string().min(3).max(200).email().required(),
        password:joi.string().min(6).max(200).required()

    })
    const {error}=schema.validate(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    try{
    let user=await User.findOne({email:req.body.email})
    if(user)res.status(400).send("email already exists")
    const {name,email,password}=req.body
    user=new User({
        name,email,password
    })
    const salt=await bcrypt.genSalt(10)
    user.password=await bcrypt.hash(user.password,salt)
    await user.save()
    const SecretKey="secretkey"
        const token=jwt.sign({_id:user._id,name:user.name,email:user.email} ,SecretKey)
        res.send(token)

    }
    catch(error){
        res.status(500).send(error.message)
        console.log(error.message)

    }

})
module.exports=router