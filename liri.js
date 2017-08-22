var exportKeys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require("request");
var nodeArgs = process.argv;
var action = process.argv[2];
var params = {screen_name: 'LIRI_HW'};
var fs = require('fs');

var client = new Twitter({
    consumer_key: exportKeys.twitterKeys.consumer_key,
    consumer_secret: exportKeys.twitterKeys.consumer_secret,
    access_token_key: exportKeys.twitterKeys.access_token_key,
    access_token_secret: exportKeys.twitterKeys.access_token_secret
  });

var spotify = new Spotify({
    id: "c7012aa702754462812b1ec179239b59",
    secret: "98c04853921a41efa6fd9a06e31e9b9e"
});

var input = "";
for (var i = 3; i < nodeArgs.length; i++) {
  if (i > 3 && i < nodeArgs.length && action === "movie-this") {
    input = input + "+" + nodeArgs[i];
  }
  else if(i > 3 && i < nodeArgs.length && action === "spotify-this-song") {
    input = input + " " + nodeArgs[i];
  }else{
    input += nodeArgs[i];
  }
}


liriCommand(action, input);

function liriCommand(action, input){
    if(action === 'my-tweets'){
        var logString = "TWITTER DATA\n";
        client.get('statuses/user_timeline/', params, function(error, tweets, response) {
            if (!error) {
                for(var i = 0; i < tweets.length; i++){
                    logString += tweets[i].text + "\n";
                    console.log(tweets[i].text);
                }
            }
            fs.appendFile('log.txt' , logString , function(err){
                if(err) throw err;
                console.log('File Saved to log.txt!');
            })
        });
    }
    
    if(action === 'spotify-this-song'){
        if(input === ""){
            input = "The Sign";
        }
        spotify.search({ type: 'track', query: input, limit: 1 }, function(err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            var retData = (JSON.stringify(data));
            var artist = "Artist: " + JSON.parse(retData).tracks.items[0].album.artists[0].name;
            var song = "Song Name: " + JSON.parse(retData).tracks.items[0].name;
            var preview = "Preview Link: " + JSON.parse(retData).tracks.items[0].preview_url;
            var album = "Album:" + JSON.parse(retData).tracks.items[0].album.name
            var logString = "SONG DATA\n" + artist + "\n" + song + "\n" + preview + "\n" + album + "\n";
            console.log(artist);
            console.log(song);
            console.log(preview);
            console.log(album);

            fs.appendFile('log.txt' , logString, function(err){
                if(err) throw err;
                console.log('File Saved to log.txt!');
            });
        });
}
    
    if(action === 'movie-this'){
        if(input === ""){
            input = "Mr.+Nobody"
        }
        var queryUrl = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=40e9cece";
        request(queryUrl, function(error, response, body) {
            // If the request is successful
            if (!error && response.statusCode === 200) {
                var title = "Title: "+JSON.parse(body).Title;
                var year = "Year Released: "+JSON.parse(body).Year;
                var imdbRate = JSON.parse(body).Ratings[0].Source +" Score: " + JSON.parse(body).Ratings[0].Value;
                var tomatoeRate = JSON.parse(body).Ratings[1].Source +" Score:" + JSON.parse(body).Ratings[1].Value;
                var countries = "Countries where film was produced: " + JSON.parse(body).Country;
                var language = "Languages: "+JSON.parse(body).Language;
                var plot = "Movie Plot: "+JSON.parse(body).Plot;
                var actors = "Actors in Film: "+JSON.parse(body).Actors;
                var noMovieText = "If you haven't watched Mr. Nobody, then you should: http://www.imdb.com/title/tt0485947/. It's on Netflix! \n"
                var logString = "MOVIE DATA\n"+ title + "\n" + year + "\n" + imdbRate + "\n" + tomatoeRate + "\n" + countries + "\n" + language + "\n" + plot + "\n" + actors + "\n";
                console.log(title);
                console.log(year);
                console.log(imdbRate);
                console.log(tomatoeRate);
                console.log(countries);
                console.log(language);
                console.log(plot);
                console.log(actors);
                if(input === "Mr.+Nobody"){
                    logString += noMovieText;
                    console.log(noMovieText);
                }
            }
            fs.appendFile('log.txt' , logString, function(err){
                if(err) throw err;
                console.log('File Saved to log.txt!');
            });
        });
    }
    
    if(action === "do-what-it-says"){
        fs.readFile('random.txt', 'utf8', (err, data) => {
            if(err) throw err;
            var itemArray = data.split(',');
            liriCommand(itemArray[0], itemArray[1]);
        })
    }
}
