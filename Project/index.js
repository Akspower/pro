const express=require("express");
// const users =require("./MOCK_DATA.json")
const fs=require("fs")
const app=express();
const mongoose=require('mongoose');
const { type } = require("os");



 const PORT=3000;


app.use(express.urlencoded({extended:false}));


const userschema=new mongoose.Schema({
   firstname:{
      type:String,
      required:true,

   },
   lastname:{
      type:String,
      required:false,
   },
   email:{
      type:String,
      required:true,
      unique:true,
   },
   jobtitle:{
      type:String,
   },
   gender:{
      type:String
   }
});

mongoose.connect("mongodb://127.0.0.1:27017/data_collector")
.then(() => console.log("MongoDB connected"))
.catch((err)=> console.log("Mogodb error",err))
 
//model
const user = mongoose.model("user",userschema)


app.post("/api/users", async (req,res)  => {
   const body= req.body;
   if(!body || 
     ! body.firstname ||
     ! body.lastname ||
     ! body.email ||
     ! body.gender ||
     ! body.jobtitle
   ){
      return res.status(400).json({msg:"ALL Fields Required"});
   }
   const result=await user.create({
      firstname: body.firstname,
      lastname: body.lastname,
      email:body.email,
      gender:body.gender,
      jobtitle:body.jobtitle

   }
);

console.log("result",result);
return res.status(201).json({msg:"success"});
}
)







 app.get("/",(req,res)=>{
    res.send("hello sir ji ");
 });

 app.get("/usersall",(req,res)=>{
    res.json(users);
 });
 app.get("/users", async  (req,res)=>{
   const allDbusers= await user.find({});
    const name=   `
        <ul>
         ${allDbusers.map((user) => `<li>${user.firstname} - ${user.email}</li>`).join('')};
        
        </ul> `
    
    res.send(name);
 });

 app.get("/users/:id",(req,res)=>{
    const id=req.params.id
    const user=users.find((user)=> user.id==id);
    res.json(user);
 });

 app.post("/users/",(req,res)=>{
   const body=req.body;
   // console.log(body);
   users.push({...body,id:users.length+1});

   fs.writeFile('./Mock_DATA.json',JSON.stringify(users),(err,data)=>{
      res.json({status:"DONE"})
   })
 })
  
 app.listen(PORT,()=> console.log(`server run on ${PORT}`));