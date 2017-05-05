console.log('zoidberg');
var Xray = require('x-ray');
var Twit = require('twit');
var fs = require('fs');
var request = require('request');
var config = require('./config');
var T = new Twit(config);

var xray = new Xray();

var download = function(uri, filename, callback){
  console.log('download called');
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

xray('https://www.memecenter.com/search?query=anime','img.rrcont',
  [{
    src: '@src'
  }])(function(err, dataArr) {
  	var rand = Math.floor(Math.random() * dataArr.length);
  	console.log(dataArr[rand]);

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
  	        var params = { status: 'Take this meme and be happy :)', media_ids: [mediaIdStr] }

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

//authenticate with oauth
// //get() -> search by hashtag, location, user -> give me all the tweets about pokemon
// //post() -> tweeting
// //stream() -> ??? continuous connection like a socket! anytime someone @mentions me on twitter this stream() triggers an event
// // for example: every time trump tweets trigger an event make up an apology and post it :D







