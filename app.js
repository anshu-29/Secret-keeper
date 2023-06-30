require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")


const app = express();


app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended : true
}));

mongoose.connect("mongodb://127.0.0.1:27017/usersDB",{useNewUrlParser:true});


const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]})



const User = new mongoose.model("User",userSchema)




app.get("/",function (req,res) {
    res.render("home")

})
app.get("/login",function (req,res) {
    res.render("login")

})
app.get("/register",function (req,res) {
    res.render("register")

})

app.post("/register",function (req,res) {
const newUser = new User({
    email : req.body.username,
    password:req.body.password
})
    newUser.save().then(r =>{
        res.render("secrets")
    });
});

app.post('/login',function(req,res){
async function findByUser(){
    try{
        const username = req.body.username;
        const password = req.body.password;
        const foundUser = await User.findOne({email:username})
        if(foundUser){
            if(foundUser.password === password){
                res.render("secrets")
            }
        }
    }catch (err) {
        console.log(err)
    }
}
    findByUser().then()
})
app.listen(3000,function () {
    console.log("Server Started on port 3000")

});