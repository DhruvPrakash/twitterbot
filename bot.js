console.log('zoidberg');
var Xray = require('x-ray');
var Twit = require('twit');
var fs = require('fs');
var request = require('request');
var config = require('./config');
var T = new Twit(config);

var xray = new Xray();


var stream = T.stream('user');


var seedTopics = ['anime', 'attack+on+titan', 'pokemon', 'konosuba', 'jojo', 'zero+kara', 'one+piece', '', 'fate+zero', 'naruto', 'cats', 'neko'];

stream.on('tweet', someOneTweeted);

function someOneTweeted(eventMsg) {
	var mentioned = eventMsg.in_reply_to_screen_name;
	var replyToName = eventMsg.user.screen_name;
	var jsonstuff = JSON.stringify(eventMsg, null, 2);
	fs.writeFile('tweet.json', jsonstuff);
	var replyToId = eventMsg.id_str;
	// var newTweet;
	if(mentioned === 'oraoraoraramuda') {
		//newTweet = '@' + from;
		tweetMeme(replyToId, replyToName);
	}
}


var download = function(uri, filename, callback){
  console.log('download called');
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

var tweetMeme = function(replyToId, replyToName) {
	var rand = Math.floor(Math.random() * seedTopics.length)
	var baseSeed = 'https://www.memecenter.com';
	var seedUrl = (seedTopics[rand] === '') ? baseSeed : baseSeed + '/search?query=' + seedTopics[rand];
	xray(seedUrl,'img.rrcont',
	  [{
	    src: '@src'
	  }])(function(err, dataArr) {

	  	console.log(dataArr);
	  	rand = Math.floor(Math.random() * dataArr.length);
	  	console.log(rand);
	  	console.log(dataArr[rand]['src'].indexOf('unsafe2.jpg'));
	  	while(dataArr[rand]['src'].indexOf('unsafe2.jpg') !== -1){
	  		rand = Math.floor(Math.random() * dataArr.length);
	  	}

	  	download(dataArr[rand]['src'], './images/funny.png', function(){
	  	  var b64content = fs.readFileSync('./images/funny.png', {encoding: 'base64'});

	  	  // // //console.log(b64content);

	  	  T.post('media/upload', { media_data: b64content }, function (err, data, response) {
	  	    // now we can assign alt text to the media, for use by screen readers and
	  	    // other text-based presentations and interpreters
	  	    var mediaIdStr = data.media_id_string;
	  	    var altText = 'here take this:';
	  	    var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } };

	  	    if(err) {
	  	    	console.log('error in the post :/');
	  	    	console.log(err);
	  	    }

	  	    T.post('media/metadata/create', meta_params, function (err, data, response) {
	  	      if (!err) {
	  	        // now we can reference the media and post a tweet (media will attach to the tweet)
	  	        var params = { status: 'Take this meme and be happy :) @' + replyToName, media_ids: [mediaIdStr], in_reply_to_status_id: replyToId }

	  	        T.post('statuses/update', params, function (err, data, response) {
	  	          console.log(data)
	  	        })
	  	      } else {
	  	      	console.log(err);
	  	      }
	  	    })
	  	  })

	  	  console.log('done');
	  	});

	  })
}


//authenticate with oauth
// //get() -> search by hashtag, location, user -> give me all the tweets about pokemon
// //post() -> tweeting
// //stream() -> ??? continuous connection like a socket! anytime someone @mentions me on twitter this stream() triggers an event
// // for example: every time trump tweets trigger an event make up an apology and post it :D







