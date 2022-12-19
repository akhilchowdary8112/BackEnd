const joi=require("joi")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")

const { User }=require("../models/user")
const express=require("express")
const router=express.Router()
router.post("/",async(req,res)=>{
    const schema=joi.object({
        email:joi.string().min(3).max(200).email().required(),
        password:joi.string().min(6).max(200).required()

    })
    const {error}=schema.validate(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    try{
        let user=await User.findOne({email:req.body.email})
        if(!user)res.status(400).send("email not exists please login")
        const validpassword=await bcrypt.compare(req.body.password,user.password)
        if(!validpassword)res.status(400).send("entered details are incorrect")
        const SecretKey="secretkey"
        const token=jwt.sign({_id:user._id,name:user.name,email:user.email} ,SecretKey);
        res.send(token);

    }
    catch(error){
        res.status(500).send(error.message)
        console.log(error.message)
    }

})
module.exports=router