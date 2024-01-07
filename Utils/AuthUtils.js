const validator= require('validator');

function cleanUpAndValidate({email,username,phoneNumber,password}){

    return new Promise((resolve,reject)=>{
        if(typeof(email)!=="string"){
            return reject("Email is not string");
        }
        if(!validator.isEmail(email)){
            return reject("invalid email");

        }
        if(username.length<3){
            return reject("Username is too short");

        }
        if(username.length>30){
            return reject("Username is too long");

        }
        if(phoneNumber && phoneNumber.length!==10)
        {
            return reject("phone number not valid");
        }
        if(password && password<6)
        {
            return reject("pasword too short");
        }
        //alphanumeric fn check if the password contains only alphabet and numbers if it contains any additional then return false
        if(password &&!validator.isAlphanumeric(password))
        {
            return reject("password must contains albhabet and numbers");
        }
        return resolve();

    });
}
module.exports={ cleanUpAndValidate };