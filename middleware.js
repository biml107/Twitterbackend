const checkAuth = (req,res,next)=>{
    if(req.session.isAuth){
         return next();//if it returns next then the nexxt callbnack function will be called in tweetController
         
    }
    //
    return res.send({
        status:400,
        message:"Invalid session. please Loigin"
    })
    // while implementing we can render 
}

module.exports ={ checkAuth };