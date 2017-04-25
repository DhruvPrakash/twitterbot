console.log('zoidberg');

var Twit = require('twit');
var fs = require('fs');
//authenticate with oauth
var config = require('./config');

var T = new Twit(config);

//get() -> search by hashtag, location, user -> give me all the tweets about pokemon
//post() -> tweeting
//stream() -> ??? continuous connection like a socket! anytime someone @mentions me on twitter this stream() triggers an event
// for example: every time trump tweets trigger an event make up an apology and post it :D



// var params = {
// 	q: 'attack on titan',
// 	count: 2,
// 	lang: 'en'
// };

// var tweet = {
// 	status: 'You thought this was an example.. but it was me DIO!!!!!!!'
// };

// var gotData = function(err, data, response) {
// 	var tweets = data.statuses;
// 	tweets.forEach(function(tweet){
// 		console.log(tweet.text);
// 	})
// };

// T.get('search/tweets', params, gotData);

// var tweeted = function(err,data,response){
// 	if(err) {
// 		console.log('something went wrong');
// 		console.log(err);
// 	} else {
// 		console.log('WRYYYYYY');
// 	}
// }

// T.post('statuses/update',tweet, tweeted);


var b64content = fs.readFileSync('./images/shitbag-josuke-idiot-okuyasu.png', {encoding: 'base64'});

//console.log(b64content);

T.post('media/upload', { media_data: b64content }, function (err, data, response) {
  // now we can assign alt text to the media, for use by screen readers and
  // other text-based presentations and interpreters
  var mediaIdStr = data.media_id_string;
  var altText = 'shitbag josuke and idiot okuyasu';
  var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } };

  if(err) {
  	console.log('error in the first post :/');
  	console.log(err);
  }

  T.post('media/metadata/create', meta_params, function (err, data, response) {
    if (!err) {
      // now we can reference the media and post a tweet (media will attach to the tweet)
      var params = { status: 'Rohan sensei\'s thoughts - #JOJO #diamond #oraoraora #heavensdoor', media_ids: [mediaIdStr] }

      T.post('statuses/update', params, function (err, data, response) {
        console.log(data)
      })
    } else {
    	console.log(err);
    }
  })
})



