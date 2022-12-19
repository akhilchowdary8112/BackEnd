const model=require("./models/model1")
const routes=require("./routes/routes1")
const signup=require("./routes/signup")
const signin=require("./routes/signin")
const express =require("express")
const mongoose=require("mongoose")
const cors=require("cors")
require("dotenv").config()
const app=express()
app.use(cors())
app.use(express.json())
app.use("/api/routes",routes)
app.use("/api/signup",signup)
app.use("/api/signin",signin)


app.get("/",(req,res) => {
    res.send("Welcome to our todos api...")
})
const connection_string=process.env.CONNECTION_STRING
const port=process.env.PORT||5000



app.listen(port,()=> {
    console.log(` Server running on 5000 ${port}... `)
})
mongoose.connect(connection_string)

.then(() => console.log("connection established"))
.catch((error) => console.error("connection error ",error.message))
