import { tweetsData } from "./data.js"
import { v4 as uuidv4 } from 'https://jspm.dev/uuid'

// Function to generate the HTML for the tweets
function generateTweetHTML(tweets) {
  let tweetHTML = ''

  // Loop through each tweet to generate its HTML
  tweets.forEach(function(tweet) {
    let likeIconClass = ''
    let retweetIconClass = ''
    let repliesHTML = ''

    if (tweet.isLiked) {
      likeIconClass = 'liked'
    }
    if (tweet.isRetweeted) {
      retweetIconClass = 'retweeted'
    }

    // Generate the replies section HTML if the tweet has replies
    if (tweet.replies) {
      tweet.replies.forEach(function(reply) {
        repliesHTML +=
          `<article class="tweet-reply">
            <img src="${reply.profilePic}" class="tweet-reply-pic profile-pic">
            <p class="tweet-handle">${reply.handle}</p>
            <p class="tweet-text">${reply.tweetText}</p>
          </article>`
      })
    }

    // Generate the main tweet's HTML
    tweetHTML += 
    `<article class="tweet" arial-label="Tweet by ${tweet.handle}">
      <img src="${tweet.profilePic}" alt="${tweet.handle}." class="tweet-profile-pic profile-pic">
      <p class="tweet-handle">${tweet.handle}</p>
      <p class="tweet-text">${tweet.tweetText}</p>
      <div class="tweet-btns">
        <button type="button" class="tweet-btn" aria-label="Comment on ${tweet.handle}'s tweet" title="Comment" data-reply="${tweet.uuid}">
          <i class="fa-regular fa-comment-dots"></i>
          ${tweet.replies.length}
        </button>
        <button type="button" class="tweet-btn ${likeIconClass}" aria-label="Like ${tweet.handle}'s tweet" title="Like" data-like="${tweet.uuid}">
          <i class="fa-solid fa-heart"></i>
          ${tweet.likes}
        </button>
        <button type="button" class="tweet-btn ${retweetIconClass}" aria-label="Retweet ${tweet.handle}'s tweet" title="Retweet" data-retweet="${tweet.uuid}">
          <i class="fa-solid fa-retweet"></i>
          ${tweet.retweets}
        </button>
      </div>

      <section class="tweet-reply-section hidden" id="replies-${tweet.uuid}">
        ${repliesHTML}
      </section>
      </article>`
      
  })

  return tweetHTML
}

// Function to render the tweets on the page
function renderTweets(tweets) {
  const tweetFeedSection = document.getElementById('tweet-feed')
  const tweetHTML = generateTweetHTML(tweets)
  tweetFeedSection.innerHTML = ''
  tweetFeedSection.insertAdjacentHTML('beforeend', tweetHTML)
}

// Function to handle when the like button is clicked
function handleLikeClick(tweetId) {
  const targetTweetObj = tweetsData.filter(function(tweet) {
    return tweet.uuid === tweetId
  })[0]

  if (targetTweetObj.isLiked) {
    targetTweetObj.likes--
  } else {
    targetTweetObj.likes++
  }

  targetTweetObj.isLiked = !targetTweetObj.isLiked

  renderTweets(tweetsData)
}

// Function to handle when the retweet button is clicked
function handleRetweetClick(tweetId) {
  const targetTweetObj = tweetsData.filter(function(tweet) {
    return tweet.uuid === tweetId
  })[0]

  if (targetTweetObj.isRetweeted) {
    targetTweetObj.retweets--
  } else {
    targetTweetObj.retweets++
  }

  targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted

  renderTweets(tweetsData)
}

// Function to handle when the reply button is clicked
function handleReplyClick(tweetId) {
  document.getElementById(`replies-${tweetId}`).classList.toggle('hidden')
}

// Function to handle the tweet form submission
function handleFormBtnClick(e) {
  e.preventDefault()

  const tweetInput = document.getElementById('form-input')
  const newTweet = {
    handle: `@Scrimba 💜`,
    profilePic: `./assets/images/scrimbalogo.avif`,
    likes: 0,
    retweets: 0,
    tweetText: `${tweetInput.value.trim()}`,
    replies: [],
    isLiked: false,
    isRetweeted: false,
    uuid: uuidv4()
  }

  if (tweetInput.value.trim()) {
    tweetsData.unshift(newTweet)
    renderTweets(tweetsData)
  }
  tweetInput.value = ''
}

// Event listener to handle button clicks
document.addEventListener('click', function(e) {
  const button = e.target.closest('button')

  if (!button) {
    return
  }

  // Handle different button actions (reply, like, retweet, or form submission)
  if (button.dataset.reply) {
    handleReplyClick(button.dataset.reply)
  } else if (button.dataset.like) {
    handleLikeClick(button.dataset.like)
  } else if (button.dataset.retweet) {
    handleRetweetClick(button.dataset.retweet)
  } else if (button.id === 'form-btn') {
    handleFormBtnClick(e)
  }
})

// Initial render of the tweets
renderTweets(tweetsData)