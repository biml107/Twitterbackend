const express= require('express');
const { cleanUpAndValidate } = require('../Utils/AuthUtils');
const UserModel = require('../Models/UserModel');
const { checkAuth } = require('../middleware');

const auth= express.Router();

auth.get('/',(req,res)=>{
 console.log('Default Auth');
})


auth.post('/register',async(req,res)=>{
    const { email, username, password, name, phoneNumber, profilePic } = req.body;

     
    //validate data calling function of Auth utils
    cleanUpAndValidate({email, username,phoneNumber,password}).then(async()=>{

        //if user is already registered
        try{
            //database call so calling static function of userModel
             await UserModel.verifyUsernameAndEmailExists({username,email});
        }
        catch(err){
            return res.send({
                status:401,
                message:"Error Occured",
                error:err
            })
        }

        //save the data in db
        const user = new UserModel({ email, username, password, name, phoneNumber, profilePic });

        try{
            
            const dbUser= await user.registerUser();

            return res.send({
                status:200,
                message:"Registration Successfull",
                data:{
                    name:dbUser.name,
                    userId:dbUser._id,
                    email:dbUser.emil,
                    username:dbUser.username
                }
            })
        }
        catch(err){
            return res.send({
                status:401,
                message:"Internal Error on saving data",
                error:err
            })
        }

    }).catch((err)=>{

        return res.send({
            status:400,
            message:"Invalid Data",
            error:err
        })
    })
})

auth.get('/login', (req, res) => {
    res.render('login');
})

auth.post('/login', async (req, res) => {
    
    //
     const { loginId,password } = req.body;
     if(!loginId||!password){
        console.log(loginId,password);
        return res.send({
            status:401,
            message:"invalid credentials "
        })
     }

     try{
        const dbUser= await UserModel.findUserWithLoginId(loginId);
        
        const isMatch=password===dbUser.password?true:false;
        if(!isMatch)
        {
            return res.send({
                status:401,
                message:"Invalid Password"
            })
        }
        //session based auth
        req.session.isAuth=true;
        req.session.user = {
            userId:dbUser._id,
            username:dbUser.username,
            name:dbUser.name
        }
        return res.send({
            status:200,
            message:"login successfull",
            data:{
                name:dbUser.name,
                userId:dbUser._id,
                email:dbUser.emil,
                username:dbUser.username
            }
         })
          



     }catch(err){
            return res.send({
                status:401,
                message:"Error Occured",
                error:err
            })
     }
})

auth.get('/dashboard', checkAuth,(req, res) => {
    res.render('dashboard');
})
auth.post('/dashboard', checkAuth, (req, res) => {
    

})
auth.post('/logout',(req,res)=>{
    req.session.destroy((err)=>{
        if(err) throw err;

       return res.send('Logged out Successfully');
    })
})
auth.get('/*',(req,res)=>{
    res.send("Not Found");
  })

module.exports = auth;