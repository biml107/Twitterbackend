//package imports 

const express = require('express');
const session= require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);
const mongoose= require('mongoose');

//const privateConstants = require('./private-constants');

//Routes import
const AuthController = require('./Controller/AuthController');
const TweetController = require('./Controller/TweetController');
const FollowController = require('./Controller/FollowController');


//Files Imports

const app= express();
const bmlkumar2000Project0URI=process.env.bmlkumar2000Project0URI;
//connectDb
mongoose.connect(`${privateConstants.bmlkumar2000Project0URI}`,{
    //useNewUrlParser:true,
    //useUnifiedTopology:true
}).then(res=>{
    console.log('connected to database');
}).catch(err=>{
    console.log('Database connection failed',err);
});

// mongoose.connect('mongodb://localhost:27017',{
//     //useNewUrlParser:true,
//     //useUnifiedTopology:true
// }).then(res=>{
//     console.log('connected to database');
// }).catch(err=>{
//     console.log('Database connection failed',err);
// });
//Middileware import
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

//EJS VIW engine
app.set('view engine','ejs');
const store = new MongoDBSession({
    uri : `${privateConstants.bmlkumar2000Project0URI}`,
    collection : 'tb_session'
});

app.use(session({
    secret:privateConstants.SESSIONKEY,
    resave: false,
    saveUninitialized: false,
    store:store
}));


// app.get('/',(req,res)=>{
//     res.send('welcome to home page');
// });
// app.get('/',function(req,res)
// {
//     res.send("I am Foo");
// });

// app.get('/:id',function(req,res)
// {
//     res.send("I am Foo with id "+req.params.id);
// });
//Routers

app.use('/auth',AuthController);
app.use('/tweet',TweetController);
app.use('/follow',FollowController);

//about process.env.PORT
//The process object is a global that provides information about, and control over, the current Node.js process. As a global, it is always available to Node.js applications without using require().
app.listen(process.env.PORT||3000,()=>{
    console.log('Listening on port 3000');
})
