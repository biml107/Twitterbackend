const validator = require('validator');
const UserSchema = require('../Schemas/UserSchema');


let User = class{
    username;
    email;
    password;
    phoneNumber;
    name;
    profilePic;
    constructor({username,name,email,password,phoneNumber,profilePic}){
        this.username=username;
        this.name=name;
        this.email=email;
        this.password=password;
        this.phoneNumber=phoneNumber;
        this.profilePic=profilePic;
    }
 //in static function me jo v arguments honge we have pass it as parameter becoz object is not created for the class and cant access the class member variables
 //static functions can b called without object   
 static verifyUsernameAndEmailExists({username,email})
    {
        return new Promise(async (resolve,reject)=>
        {
            try{
                   const user = await UserSchema.findOne({$or: [{username},{email}]});//search for short hand object notation
                   // findone fn -if exist it return the object and if not exist it returns null

                   if(!user)
                   return resolve();
                if(user && user.email ===email){
                    return reject("User with this email already exists");
                }
                if(user && user.username===username){
                    return reject("User with this username already exists");
                }

                //we should not write everything inside if bcoz if all if are aclled and something assigned on useer it will not return any promise
                //promise ya to resolve ho ya reject we should write any default return
                //here default resolve
                return reject('Some unknown error occured');

            }
            catch(err){
                        return reject(err);
            }
        })
    }


    static verifyUserIdExists(userId){
        return new Promise(async(resolve,reject)=>{

            try{
                const dbUser=await UserSchema.findOne({_id:userId});
                if(!dbUser)
                {
                    return reject("User doesnt exist");
                }
                resolve(dbUser);

            }
            catch(err){
                    return reject(err);
            }

        })
    }
    //registration function
    registerUser(){
        
        return new Promise(async(resolve,reject)=>{
           

            const user= new UserSchema({

                username:this.username,
                email:this.email,
                password:this.password,
               phoneNumber: this.phoneNumber,
               profilePic:this.profilePic,
               name:this.name
            })
           
            try{
                 
                const dbUser= await user.save();
           
                return resolve(dbUser);
            }
            catch(err){
                
                    return reject(err);
            }

        })
    }


    //////////////////////////////////////////////////////////
    static findUserWithLoginId(loginId){

        return new Promise(async(resolve,reject)=>{

            let dbUser;
            try{
                if(validator.isEmail(loginId)){

                    dbUser = await UserSchema.findOne({email:loginId});
                }
                else{
                    dbUser = await UserSchema.findOne({username:loginId});
                }
            }
            catch(err)
            {
                return reject("Database Error");
            }
            
            if(!dbUser)
            {
                return reject("No User found");
            }
            resolve(dbUser);
        })
    }

}
module.exports = User;