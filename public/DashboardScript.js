const config = {
    headers: {
        'content-type': 'application/json'
    }
}

window.onload = getAllTweets();

 

    function getAllTweets() {
    
    axios.post('/tweet/read', JSON.stringify({}), config).then(res => {
        if (res.data.status != 200)
        {
            alert('failed to read tweets . Please try again');
            return;
        }
        const dbTweetArr = res.data.data;
        console.log(dbTweetArr);
        document.getElementById('tweet-list-box').insertAdjacentHTML('beforeend', dbTweetArr.map(tweet => {
            return ` 
            <div>
            </br>
            <div class=${tweet._id}><span>Title : ${tweet.title}</span>
                      <div ><span>Text : ${tweet.text}</span></div>
            </div> 
             
            <button class=${tweet._id} onclick="editTweet(event)">Edit</button>
            <button  class=${tweet._id} onclick="deleteTweet(event)">x</button>
            </br>
            </div>
            `
        }).join(' '))

    }).catch (err=> {
        console.log(err);
    })
}
function editTweet(event) {
    
}
function createTweet() {
    const tweet = {
         title:document.getElementById('title').value,
         text:document.getElementById('text').value
    }

    axios.post('/tweet/create', JSON.stringify(tweet), config).then(res => {
        
        if (res.data.status === 200)
        {
            console.log(res.data.data);
            document.getElementById('tweet-list-box').insertAdjacentHTML('beforeend',
                `<div>
                 </br>
            <div class=${res.data.data.tweetId}><span>Title : ${res.data.data.title}</span>
            <div ><span>Text : ${res.data.data.text}</span></div>
            </div> 
   
           <button class=${res.data.data.tweetId} onclick="editTweet(event)">Edit</button>
          <button  class=${res.data.data.tweetId} onclick="deleteTweet(event)">x</button>
          </br>
  </div>
  `
            
            )
            return;
        }
        
        else {
            alert(res.message);
            return;
        }


    }).catch(err => {
        alert("Couldn't create tweet . please try again");
        return;
        
    })
    
}
function deleteTweet(event) {
     
    const tweetId = event.target.getAttribute('class');
    
    console.log(tweetId);

    axios.post('/tweet/delete', JSON.stringify({ tweetId }), config).then(res => {
        
        if (res.data.status === 200)
        {
            console.log(res.data);
            console.log(res.data.status);
            alert(res.data.message);
            event.target.parentNode.remove();
            return;

        }

    }).catch(err => {
        alert("some error occured while deleting");
        return;
    })
   


    
}
function sortTweet() {
    
}

function getTweetFeed() {

    axios.post('/tweet/tweetfeed', JSON.stringify({}), config).then(res => {
        
        
    })


}