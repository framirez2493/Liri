require("dotenv").config();

//import keyfile
var apikeys = require('./keys.js');
//requets spotify app
var Spotify = require("node-spotify-api");
var spotify = new Spotify(apikeys.spotify);
//request/fs
var request = require("request");
var fs = require("fs");
//creating momment for concert search
var moment = require('moment');

var date = moment.utc().format('YYYY-MM-DD');

var localTime = moment.utc(date).toDate();

localTime = moment(localTime).format('YYYY-MM-DD');

//console.log("moment: " + localTime);
//importing chalck
const chalk = require('chalk');

//console.log(chalk.blue('Hello world!'));

//passing arguments
var nodeArgs = process.argv;
var command = nodeArgs[2];
var input = nodeArgs.slice(3).join(' ')

switch (command) {
  case "concert":
    concert()

    break;
  case "spotify-this-song":
    song();
    break;
  case "movie-this":
    movie();
    break;
  case "do-what-it-says":
    doIt();

    break;
  default:
    console.log('')
}


function song() {
  var divider = "\n------------------------------------------------------------\n\n";


  //We will read the existing bank file
  spotify.search({ type: 'track', query: input, limit: 20 }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    var songInfo = data.tracks.items



    console.log(chalk.green('\n--------------------------------------------\nSong Name: ' + input + '\nArtists: ' + songInfo[0].artists[0].name + '\nalbum:' +
      songInfo[0].album.name + '\nPreview URL: ' + songInfo[0].preview_url));

    //appending info log into txt file
    fs.appendFile("log.txt", '\n--------------------------------------------\nSong Name: ' + input + '\nArtists: ' + songInfo[0].artists[0].name + '\nalbum:' +
      songInfo[0].album.name + '\nPreview URL: ' + songInfo[0].preview_url + divider, function (err) {
        if (err) throw err;
        console.log(' object succesfully recorded!');
      });

  });

}
function movie() {
  var divider = "\n------------------------------------------------------------\n\n";


  // We will read the existing bank file
  request("http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy", function (error, response, body) {

    if (!error && response.statusCode === 200) {
      movieInfo = JSON.parse(body)
      //console.log(movieInfo);
      console.log(chalk.cyan("\n Movie Name: " + movieInfo.Title +
        "\n Rating: " + movieInfo.Ratings[1].Source + ' ' + movieInfo.Ratings[1].Value + '\n Actors:' + movieInfo.Actors + '\n Language' + movieInfo.Language +
        '\n Country' + movieInfo.Country + '\n metaRating:' + movieInfo.Metascore + '\n Plot:' + movieInfo.Plot))


      //appending info log into txt file
      fs.appendFile("log.txt", "\n Movie Name: " + movieInfo.Title +
        "\n Rating: " + movieInfo.Ratings[1].Source + ' ' + movieInfo.Ratings[1].Value + '\n Actors:' + movieInfo.Actors + '\n Language' + movieInfo.Language +
        '\n Country' + movieInfo.Country + '\n metaRating:' + movieInfo.Metascore + '\n Plot:' + movieInfo.Plot + divider, function (err) {
          if (err) throw err;
          console.log(' object succesfully recorded!');
        });


    }
  });
}


function concert() {
  var divider = "\n------------------------------------------------------------\n\n";

  // We will read the existing bank file
  request("https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp&date=" + localTime + "%2C2019-12-31", function (error, response, body) {

    if (!error && response.statusCode === 200) {
      concertInfo = JSON.parse(body)
      parsedConcertInfo = concertInfo[0];
      console.log(chalk.red("\nArtist Name: " + parsedConcertInfo.lineup))
      console.log(chalk.blue("\nVenue Name: " + parsedConcertInfo.venue.name))
      console.log(chalk.green("\nLocation: " + parsedConcertInfo.venue.city))
      console.log(chalk.gray("\nState: " + parsedConcertInfo.venue.region))
      console.log(chalk.cyan("\nTime: " + parsedConcertInfo.datetime))

      fs.appendFile("log.txt", "\nArtist Name: " + parsedConcertInfo.lineup + "\nVenue Name: " + parsedConcertInfo.venue.name +
        "\nLocation: " + parsedConcertInfo.venue.city + "\nState: " + parsedConcertInfo.venue.region +
        "\nTime: " + parsedConcertInfo.datetime + divider, function (err) {
          if (err) throw err;
          console.log(' object succesfully recorded!');
        });



    }
  });
}


function doIt() {
  fs.readFile("random.txt", "utf8", function (error, data) {

    // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log(error);
    }


    // Then split it by commas (to make it more readable)
    var dataArr = data.split(",");
    dataArr.forEach(element => {
      console.log(chalk.blue(element));

    });


  });
}







