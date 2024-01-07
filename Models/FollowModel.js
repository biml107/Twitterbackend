const FollowSchema = require('../Schemas/FollowSchema');


function followUser({followerUserId,followingUserId}){
    return new Promise(async(resolve,reject)=>{

        const follow= new FollowSchema({
            followerUserId,
            followingUserId
        })

        try{
               
            const dbFollow=follow.save();
            return resolve(dbFollow);
        }
        catch(err){
           
           return  reject(err);
        }
    })

}


function unfollowUser({followingUserId,followerUserId}){
    return new Promise(async (resolve,reject)=>{
                try{

                    const dbUnfollow = await FollowSchema.findOneAndDelete({followerUserId,followingUserId});
                    if(!dbUnfollow){
                        return reject("User doesnt exists"); 
                    }
                    return resolve(dbUnfollow);
                }
                catch(err){
                        return reject(err);
                }


    })
}

function verifyFollowExists({followingUserId,followerUserId}){

    return new Promise(async(resolve,reject)=>{
            try{
                const dbFollow=await FollowSchema.findOne({followerUserId,followingUserId});
                resolve(dbFollow);

            }catch(err){
                return reject(err);

            }


    })
}

function getFollowingList(followerUserId){
return new Promise(async(resolve,reject)=>
{
try{
      const dbFollow=await FollowSchema.find({followerUserId});
      resolve(dbFollow);
}
catch(err){
    console.log(err);
    return reject("DatabaseError while finding following list");


}

})
   
    
}

function getFollowerList(followingUserId){
    return new Promise(async(resolve,reject)=>
    {
    try{
          const dbFollow=await FollowSchema.find({followingUserId:followingUserId});
          resolve(dbFollow);
    }
    catch(err){
        console.log(err);
        return reject("DatabaseError while finding followers list");
    
    
    }
    
    })


}

//module.exports = { followUser, getFollowingList, getFollowerList, unfollowUser, verifyFollowExists}
module.exports = { followUser,verifyFollowExists, unfollowUser,getFollowingList,getFollowerList}