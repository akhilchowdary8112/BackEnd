const { Model1 }  = require("../models/model1");
const auth=require("./middleware/auth")
const express = require("express");
const Joi=require("joi")
const router=express.Router();






router.get("/",auth,async(req,res) =>{
    try{
    const model1=await Model1.find()
    const filteredTodos=model1.filter((model1)=>model1.uid === req.user._id)
    res.send(filteredTodos) 
    }
    catch(error)
    {
        res.status(400).send(error.message)
        console.log(error)
    }
})





router.post("/",async (req,res) => {
    
    const schema=Joi.object({
        name:Joi.string().min(3).max(100).required(),
        author:Joi.string().min(3).max(20),
        uid:Joi.string(),
        isComplete:Joi.boolean(),
        date:Joi.date()
    })
    const {error}=schema.validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    const { name, author, isComplete, date, uid}=req.body;
    let model1=new Model1({ 
        name,
        author,
        isComplete,
        date,
        uid,
    }
    );
    try {
   model1= await model1.save()
   res.send(model1);
    }
    catch(error){
        res.status(500).send(error.message);

    }
});



router.put("/:id",auth,async(req,res) =>{
    const schema=Joi.object({
        name:Joi.string().min(3).max(100).required(),
        author:Joi.string().min(3).max(100),
        uid:Joi.string(),
        isComplete:Joi.boolean(),
        date:Joi.date()
    })
    const {error}=schema.validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    try{
    const model1=await Model1.findById(req.params.id)
    if(!model1){  res.status(400).send("not found given id")  
    }
    if(model1.uid !== req.user._id) return res.status(400).send("you cannot update this")
    const { name, author, isComplete, date, uid}=req.body;
    
    const umodel1=await Model1.findByIdAndUpdate(req.params.id,
        { 
        name,
         author, 
         isComplete, 
         date, 
         uid
    },
    {new: true})


res.send(umodel1)
}
catch(error){
    res.status(500).send(error.message);

}
})




router.delete("/:id",auth, async (req,res) => {
    try {
  const model1=await Model1.findByIdAndDelete(req.params.id)
  if(model1.uid !== req.user._id) return res.status(400).send("you cannot delete this")
  res.send(model1)
    
    }
    catch(error){
      res.status(500).send(error.message);
    }
})

router.patch("/:id",auth,async (req,res) =>{
    try{
    const model1=await Model1.findById(req.params.id)
    if(!model1){
        res.status(400).send("not found given id")
    }
        if(model1.uid !== req.user._id) return res.status(400).send("you cannot change this")
        const umodel1=await Model1.findByIdAndUpdate(req.params.id,{
            isComplete: !model1.isComplete,
            
        },{new :true})
        res.send(umodel1)
    }
    catch(error){
        res.status(500).send(error.message);
      }
})

module.exports = router