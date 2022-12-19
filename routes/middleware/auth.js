const jwt=require("jsonwebtoken")
function auth(req,res,next){
    const token=req.header("x_auth_token")
    if(!token)res.status(401).send("not authorized...")
    try{
       const SecretKey="secretkey"
       const payload=jwt.verify(token,SecretKey)
       req.user=payload
       next()
    }
    catch(error)
    {
        res.status(400).send(error.message)
        console.log(error)
    }
    


}
module.exports=auth