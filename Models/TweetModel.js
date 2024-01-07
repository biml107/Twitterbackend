const TweetSchema = require('../Schemas/TweetSchema');

const Tweet = class{
    tweetId;//here tweet id is to use during updation of tweet >
    title;
    text;
    creationDateTime;
    userId;

    constructor ({title, text, creationDateTime, userId, tweetId}){
        this.title=title;
        this.text=text;
        this.creationDateTime=creationDateTime;
        this.userId=userId;
        this.tweetId=tweetId;//if we do not pass tweet id then its value will be undefined and doesnt effect any other function of that class
    }

    static countTweetsOfUser(userId){
        return new Promise(async(resolve,reject)=>{

            try{
                const count = await TweetSchema.count({userId});
                return resolve(count);
            }
            catch(err){
                console.log("error on count fn",err);
             return reject(err);

            }
        })
    }

    static findAllTweets(userId)
    {
        console.log("findalltweets");
        return new Promise(async (resolve, reject) => {
            
            try {
                const dbTweetArr = await TweetSchema.find({ userId: userId },{title:1,text:1,creationDateTime:1,_id:1});
                console.log(dbTweetArr);
                return resolve(dbTweetArr);
            }
            catch (err) {
                console.log(err);
                return reject("Database error while getting tweets");
            }
        })
    }

    static findSomeTweets({ userId, LIMIT, skip })
    {
        return new Promise(async (resolve, reject) => {
   
            
            try {
                console.log("user id " + userId);
                //const dbTweetArr = await TweetSchema.find({ userId: userId },{title:1,text:1,creationDateTime:1,_id:1});
                const dbTweetArr = await TweetSchema.aggregate([
                    { $match: { userId: userId } },
                  //  {$sort:{creationDateTime:1}},
                   // {$skip:skip},
                    {$limit:LIMIT}

                ]
                    
                )
                console.log(dbTweetArr);
                return resolve(dbTweetArr);
            }
            catch (err) {
                return reject("Database error while getting limit tweets"+err);
            }
        })
    }

    static findTweetById(tweetId){
        return new Promise(async(resolve,reject)=>{

            try{
                const dbTweet= await TweetSchema.findOne({_id:tweetId});
                return resolve(dbTweet);
            }catch(err){
                return reject(err);
            }
        })
    }


    createTweet(){
         
        return new Promise(async(resolve,reject)=>{

            const tweet= new TweetSchema({
                title:this.title,
                text:this.text,
                creationDateTime:this.creationDateTime,
                userId:this.userId
            })

            try{
               
                const dbTweet=tweet.save();
                return resolve(dbTweet);
            }
            catch(err){
               
               return  reject(err);
            }

        })
    }

    updateTweet(){
        return new Promise(async(resolve,reject)=>{
            const newTweetData={};

            if(this.title){
                newTweetData.title=this.title;
            }
            if(this.text){
                newTweetData.text=this.text;
            }
            try{
            const dbTweet = await TweetSchema.findOneAndUpdate({_id: this.tweetId},newTweetData);
             return resolve(dbTweet);
            }catch(err){
              return reject(err); 
            }

        })
    }

    deleteTweet(){

        return new Promise(async(resolve,reject)=>{
            try{
            const dbTweet= await TweetSchema.findOneAndDelete({_id:this.tweetId});
            return resolve(dbTweet);
            }
            catch(err){
                return reject(err);
            }
        })
    }

}

module.exports = Tweet;