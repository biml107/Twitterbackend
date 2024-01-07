const express = require('express');

const TweetModel = require('../Models/TweetModel');
const FollowModel = require('../Models/FollowModel');

const { checkAuth } = require('../middleware');
const TweetSchema = require('../Schemas/TweetSchema');

const tweet=express.Router();
//here if checkAuth middlewere return next then the (req,res )callback will be called otherwise eturn error
tweet.post('/create',checkAuth,async(req,res)=>{

      const { title, text}= req.body;
      const userId = req.session.user.userId;//here user id is mongodb id or user
      const creationDateTime = new Date();//use new Date() will return date time in format but Date.now will retrurn milliseconds which dosnt mak sense
      //new Date() 23-12-27T09:26:03.774Z
      //Date.now() 1703669163772
 
      //check for valid parameters
      if(!title||!text || typeof(title)!=="string"||typeof(text)!=="string")
      {
        
        return res.send({
            status:401,
            message:"Invalid request Parameter",
            error:"Missing title or body text"
        })
      }

      if(title.length>200)
      {
        return res.send({
            status:401,
            message:"title is too large. max charater 200"
        })
      }
      if(text.length>1000)
      {
        return res.send({
            status:401,
            message:"text is too large. max charater 1000"
        })
      }
      // let tweetCount;
      // //check number of tweets
      // try{
      //   tweetCount = await TweetModel.countTweetsOfUser(userId);
      // }
      // catch(err){

      //  return res.send({
      //       status:401,
      //       message:"Database Error while counting tweets",
      //       error:err
      //   })
      // }



      // if(tweetCount>=1000){
      //   return res.send({
      //       status:400,
      //       message:"You have created alresdy 1000 tweets try after deleting some tweets"
      //   })
      // }
//craeting Tweet class object of TweetModel.js
      const tweet = new TweetModel({
        userId,title,text,creationDateTime
      })

      try{
        const dbTweet= await tweet.createTweet();

        return res.send({
            status:200,
            message:"Tweet created successfully",
            data:{
                tweetId:dbTweet._id,
                title:dbTweet.title,
                text:dbTweet.text,
                creationDateTime:dbTweet.creationDateTime,
                userId:dbTweet.userId
            }
        })
      }catch(err){
 
        return res.send({
            status:401,
            message:"Database error while creating tweet"

        })
      }



})


tweet.post('/read', checkAuth, async (req, res) =>
{
  const userId = req.session.user.userId;
  const LIMIT = 5;
  const skip = req.query.skip || 0;

  console.log(userId);
  console.log(LIMIT);
  console.log(skip);
  let dbTweetArr = [];
  //Aggregate - doing multiple database operation simultaneously
  try {
    dbTweetArr = await TweetModel.findAllTweets(userId);
    //dbTweetArr = await TweetModel.findSomeTweets({ userId, LIMIT, skip });
    return res.send({
      status: 200,
      message: "Tweets Fetched Successfully",
      data:dbTweetArr
    })

  }
  catch (err) {
    console.log(err);
    return res.send({
      
      status:400,
      message:"Internal server error while getting Tweets",
      error:err
  })
    
  }

})

tweet.post('/update',checkAuth,async(req,res)=>{


    const { title, text, tweetId} = req.body;
    const userId= req.session.user.userId;
    //check for valid data
    if(!title&&!text )
    {
      return res.send({
          status:401,
          message:"Invalid request Parameter",
          error:"Missing title or body text"
      })
    }

    if(title && title.length>200)
    {
      return res.send({
          status:401,
          message:"title is too large. max charater 200"
      })
    }
    if(text && text.length>1000)
    {
      return res.send({
          status:401,
          message:"text is too large. max charater 1000"
      })
    }
    //Authorised to to update the tweet or not
    let dbTweet;
    try{
      dbTweet = await TweetModel.findTweetById(tweetId)
    }catch(err)
    {
        res.send({
            status:401,
            message:"Database error",
            error:err
        })

    }
//checkinhg tweet availability
    if(!dbTweet){
        return res.send({
            status:401,
            message:"No tweet available",

        })
    }
     if(userId.toString()!==dbTweet.userId){
        return res.send({
            status:401,
            message:"unauthorised request. Tweet belongs to othner user"
        })
     }
//update within 30 minutes
     const currentTime= Date.now();
     const creationDatetime=(new Date(dbTweet.creationDatetime)).getTime();

     const diff = (currentTime-creationDatetime)/(1000*60);
     if(diff > 30){
      return res.send({
        status:400,
        message:"update unsuccessfull",
        error:"Cannot update after 30 min of tweeting"
      })
     }
//update the tweet in db
try{
  const tweet=new TweetModel({
    tweetId,
    title,
    text
  })
    const dbTweet = await tweet.updateTweet();
    return res.send({
      status:200,
      message:"Updated successfully",
      data:dbTweet
  
    })
}
catch(err){
  return res.send({
    status:401,
    message:"database error",
    error:err
  })
}

})

tweet.post('/delete' ,checkAuth,async(req,res)=>{
          const {tweetId}=req.body;

          if(!tweetId){
            return res.send({
              status:400,
              message:"Invalid data"
            })
          }
          const userId= req.session.user.userId;//this returns id as an object to we need to convert tostring while comapring
          let dbTweet;
          try{
            dbTweet=await TweetModel.findTweetById(tweetId);

          }
          catch(err){
                    return res.send({
                      status:401,
                      message:"Database error",
                      error:err
                    })

          }
          if(!dbTweet){
            return res.send({
              status:400,
              message:"No tweet found for that id"
            })
          }

          if(userId.toString()!==dbTweet.userId){
            return res.send({
              status:403,
              message:"Unauthorised request",
              error:""
            })
          }

          //Deleting the tweet

          const tweet = new TweetModel({tweetId});

          try{
              const dbTweet= await tweet.deleteTweet();
              return res.send({
                status:200,
                message:"Tweet deleted successfully",
                data:dbTweet
              })
          }catch(err){
                 return res.send({
                  status:400,
                  message:"internal server error",
                 })
          }
    
})

tweet.post('/tweetfeed', checkAuth, async (req, res) => {
  
  const followerUserId = req.session.userId;
  const followingList = await FollowModel.getFollowingList(followerUserId);
  if (followingList.length)
  {
    //const tweetFeeds=
    
    }


})


// tweet.get('/:id',(req,res)=>{

// })
  //handeling random request which are not api url like localhost:3000/tweet/ejyrfgerf
  tweet.get('/*',(req,res)=>{
    res.send({
      status:404,
      message:"Page not found"
    });
  })

module.exports=tweet;