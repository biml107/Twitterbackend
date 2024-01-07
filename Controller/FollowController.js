const express = require('express');

const FollowModel = require('../Models/FollowModel');
const { checkAuth } = require('../middleware');
const { validateMongoDbIds }= require('../Utils/CommonUtil');
const UserModel=require('../Models/UserModel');

const follow = express.Router();
//////////////////////

follow.post('/follow-user',checkAuth,async(req,res)=>{

    const followingUserId = req.body.followingUserId;

    if(!followingUserId || !validateMongoDbIds([followingUserId])){
        return res.send({
            status:401,
            message:"Missing Parameters , Following user id should be valid"
        })
    }
    const followerUserId= req.session.user.userId;
    
//checking if following user himself

    if(followingUserId.toString()===followerUserId.toString())
    {
        return res.send({
            status:401,
            message:"Cant follow yourself"
        })
    }
//checking if user exist or not
    try{
         await UserModel.verifyUserIdExists(followingUserId);


    }catch(err){
            return res.send({
                status:400,
                message:"Internal Server Error while check userexistence",
                error:err
            })
    }

    //checking if already follwing
    try{
      const dbFollow=  await FollowModel.verifyFollowExists({followingUserId,followerUserId});
      if(dbFollow)
      {
        return res.send({
            status:400,
            message:"Database error while finding follow exist",
            data:dbFollow
        })
      }

    }
    catch(err)
    {
        return res.send({
            status:400,
            message:"database error while checking already following or not",
            error:err
        })
    }

    try{

        const dbFollow = await FollowModel.followUser({followerUserId,followingUserId});

        return res.send({
            status:200,
            message:"Follow Successfull",
            data:dbFollow
        })

    }catch(err){
        return res.send({
            status:400,
            message:"Internal Server ERROR . Please try again",
            error:err
        })

    }




})

follow.get('/followinglist/:id', async(req,res)=>{

    const followerUserId= req.params.id;
    if(!followerUserId || !validateMongoDbIds([followerUserId])){
        return res.send({
            status:401,
            message:"Missing Parameters , Follower user id should be valid"
        })
    }

    try{
        const followingList= await FollowModel.getFollowingList(followerUserId);

        return res.send({

            status:200,
            message:"Read Successfull for followingList",
            data:followingList
        })
    }catch(err){

        return res.send({
            status:400,
            message:"Internal server error while getting followingList",
            error:err
        })

    }


})
follow.get('/followerlist/:id',async(req,res)=>{

        const followingUserId= req.params.id;

        try{
            const followerList= await FollowModel.getFollowerList(followingUserId);
            return res.send({
                status:200,
                message:"Read successfull for getfollower",
                data:followerList
            })


        }
        catch(err){
                return res.send({
                status:400,
                message:"Internal server error getfollowerlist databasecall",
                error:err
            })
        }


})

follow.post('/unfollow-user',checkAuth,async(req,res)=>{

    const followerUserId = req.session.user.userId;
    const followingUserId = req.body.followingUserId;



    try{
        const dbFollow=  await FollowModel.verifyFollowExists({followingUserId,followerUserId});
        if(!dbFollow)
        {
          return res.send({
              status:401,
              message:"you didnt follw this user",
              data:dbFollow
          })
        }
  
      }
      catch(err)
      {
          return res.send({
              status:400,
              message:"database error while checking already following or not",
              error:err
          })
      }



    try{
               const dbUnfollow = await FollowModel.unfollowUser({followerUserId,followingUserId});

               return res.send({
                status:200,
                message:"Unfollowed succesfully",
                data:dbUnfollow
               })
    }
    catch(err){
        return res.send({
            status:400,
            message:"Internal server error while unfollowing",
            error:err
        })
    }
})

module.exports=  follow;