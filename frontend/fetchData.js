const showLoggeduserName =() => {
    const userNameElement = document.getElementById("logged-username");
    //find username from localstorage

    let user = localStorage.getItem("loggedInUser");
    if(user){
        user = JSON.parse(user);
    }
 // show username in the webpage
  userNameElement.innerText = user.userName;
};

const checkLoggedInUser = () => {
    let user = localStorage.getItem("loggedInUser");
   if(user){
    user = JSON.parse(user);

   }
    else{
        window.location.href = "/index.html";
    }
};

const logOut =() => {
    //clearing the localstorage
    localStorage.clear();
    checkLoggedInUser();
}

const fetchAllPosts = async () => {
    let data;

    try{
         const res = await fetch("http://localhost:5000/getAllPosts");
         data = await res.json();
         console.log(data); 
         showAllPosts(data); 
         }
    catch(err){
        console.log("Error fetching data from server", err);
    }
    
};
const showAllPosts =(allPosts) => {
    console.log("inside showallposts:", allPosts);
    const postContainer = document.getElementById("post-container");
    postContainer.innerHTML ="";

    allPosts.forEach (async  (post) => {
      const postDiv = document.createElement("div");
      postDiv.classList.add("post");
      postDiv.innerHTML = `
       <div class="post-header">
            <div class="post-user-image">
              <img src=${post.postedUserImage}
              />
  
            </div>
            <div class="post-username-time">
              <p class="post-username">${post.postedUserName}</p>
              <div class="posted-time">
                <span>${timeDifference(`${post.postedTime}`)}</span>
                
                <span>ago</span>
              </div>
  
            </div>
  
          </div>
          <div class="post-text">
            <p class="post-text-content">
              ${post.postedText}
            </p>
          </div>
          <div class="post-image">
            <img src=${post.postImageUrl}
             />
  
          </div>
      `;

      postContainer.appendChild(postDiv);

      // comments under a post 
     
      let postComments = await fetchAllCommentsOfAPost(post.postsid);
      console.log("postComments:", postComments);

      postComments.forEach((comment) => {
       const commentsHolderDiv = document.createElement("div");
       commentsHolderDiv.classList.add("comments-holder");

       commentsHolderDiv.innerHTML = `
       <div class="comment">
              <div class="comment-user-image">
                <img src=${comment.commentedUserImage}
                 />
  
              </div>
              <div class="comment-text-container">
                 <h4>${comment.commentedUserName}</h4>
                 <p class="comment-text">${comment.commentText}</p>
              </div>
            </div>
            `;

            postDiv.appendChild(commentsHolderDiv);
     });


     // adding a new comment to the post

     const addNewCommentDiv = document.createElement("div");
     addNewCommentDiv.classList.add("postComment-holder");

     addNewCommentDiv.innerHTML =`
     <div class="post-comment-input-field-holder">
              <input type="text" placeholder="Post your comment" class="postComment-input-field"  id="postComment-input-for-postId-${post.postsid}"
              />
             </div>
            <div class="comment-btn-holder">
             <button onClick=handlePostComment(${post.postsid}) id="comment-btn" class="postComment-btn">
              Comment
             </button>
            </div> 
            `;

            postDiv.appendChild(addNewCommentDiv);

    });
         
};

const handlePostComment =async (postsid) => {
    // collecting logged in user ID from localstorage
    let user = localStorage.getItem("loggedInUser");
    if(user){
        user = JSON.parse(user);
    }

    const commentedUserId =user.userId;

    // getting comment text from input

    const commentTextElement = document.getElementById(`postComment-input-for-postId-${postsid}`);
    const commentText = commentTextElement.value;

    // current time of the comment

    let now = new Date();

    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

    let timeOfComment = now.toISOString();
    const commentObject ={
        commentOfPostId : postsid,
        commentedUserId : commentedUserId,
        commentText : commentText,
        commentTime : timeOfComment,
    };

    try{
      const res = await fetch("http://localhost:5000/postsComment", {
         method:"POST",
         headers: {
           "content-type":"application/json",
         },
         body: JSON.stringify(commentObject),
      });
      const data =await res.json();
      
    }
    catch(err){
      console.log("Error while sending data to the server:", err);
    }
    finally{
        location.reload();
    }
};

const fetchAllCommentsOfAPost = async (postsid) => {
    console.log(postsid);
  let commentsOfPost = [];
  try{
     const res = await fetch(`http://localhost:5000/getAllComments/${postsid}`);
     commentsOfPost = await res.json();
  }
  catch(err){
    console.log("Error fetching comments from the server:", err);
  }
  finally{
    return commentsOfPost;
  }
};

const handleAddNewPost = async() => {
    // getting user id from localstorage
    let user = localStorage.getItem("loggedInUser");
    if(user){
        user = JSON.parse(user);
    }

    const postedUserId =user.userId;

    // current time of the post

    let now = new Date();

    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

    let timeOfPost = now.toISOString();

    //post text

    const postTextElement = document.getElementById("newPost-text");
    const postText = postTextElement.value;

    //post image

    const postImageElement = document.getElementById("newPost-image");
        const postImageUrl = postImageElement.value;

    // creating a post object

    

    const postObject = {
        postedUserId : postedUserId,
        postedTime : timeOfPost ,
        postedText : postText ,
        postImageUrl : postImageUrl,
    };

    try{
        const res = await fetch("http://localhost:5000/addNewPost", {
           method:"POST",
           headers: {
             "content-type":"application/json",
           },
           body: JSON.stringify(postObject),
        });
        const data =await res.json();
        
      }
      catch(err){
        console.log("Error while sending data to the server:", err);
      }
      finally{
          location.reload();
      }
    

};

//this function automatically runs

fetchAllPosts();


