#!/usr/bin/env node
'use strict';
const got = require('got');
const meow = require('meow');
const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');
const Conf = require('conf');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');
const spinner = ora('Loading ...');

// config file stored in /Users/{home}/Library/Preferences/{project-name}
const config = new Conf();

function auth() {
  return new Promise((resolve, reject) => {
    inquirer.prompt([
        {
          type: 'input',
          message: 'Enter your Spotify username',
          name: 'username'
        },
        {
          type: 'password',
          message: 'Enter your Spotify bearer token',
          name: 'bearer'
        }
    ]).then(function (answers) {
      var answer = JSON.stringify(answers);
      config.set(answers);
      resolve(true);
    }).catch(err => reject(err));
  });
}

const spotifork = async function spotifork(inputs, flags) {

	spinner.start();
	// playlist URI
	let PlaylistURI = inputs;
	// name of the playlist, optional parameter
	let playlistName = flags['n'];

	if (PlaylistURI === undefined){
			spinner.fail('Failed');
			console.log(chalk.red(`
	Oops! Remember to add the playlist URI!

	Example

		spotifork spotify:user:kabirvirji:playlist:23v4GpUwnvSENslciz2CkC
		`))
			return
	}
	let URI = inputs.split(":");
	const playlistID = URI[4];
	const playlistUser = URI[2];
	
	var getPlaylistOptions = {
	  json: true, 
	  headers: {
	    'Content-type': 'application/json',
	    'Authorization' : `Bearer ${config.get('bearer')}`
	  }
	};

	// get playlist
	got(`https://api.spotify.com/v1/users/${playlistUser}/playlists/${playlistID}`, getPlaylistOptions)
	  .then(response => {
	    const responseTracks = response.body.tracks.items
		let forkedFrom = response.body.name;
	    if (playlistName === undefined){
	    	playlistName = response.body.name;
	    }
	    // holds playlist tracks
		let tracks = responseTracks.map(responseTrack => responseTrack.track.uri)
		var createPlaylistOptions = {
		  json: true, 
		  headers: {
		    'Content-type': 'application/json',
		    'Authorization' : `Bearer ${config.get('bearer')}`,
		    'Accept' : 'application/json'
		  },
		  body: JSON.stringify({ description: `spotiforked from ${playlistUser}/${forkedFrom}`, name: `${playlistName}`, public : true})
		};
		// create playlist
		got.post(`https://api.spotify.com/v1/users/${config.get('username')}/playlists`, createPlaylistOptions)
		  .then(response => {
		  	// get playlist ID
		    const newPlaylistID = response.body.id;

				// function to add tracks to playlist
				function populatePlaylist (id, uris, name) {
					var url = `https://api.spotify.com/v1/users/${config.get('username')}/playlists/${id}/tracks?uris=${uris}`
					var options = {
					  json: true, 
					  headers: {
					    'Content-type': 'application/json',
					    'Authorization' : `Bearer ${config.get('bearer')}`,
					  }
					};
					got.post(url, options)
					  .then(response => {
					  	spinner.succeed('Success!');
					    console.log(chalk.green(`
	Your playlist is ready!
	It's called "${name}"`));
					  })
					  .catch(err => { 
					  	spinner.fail('Failed');
					  	// don't need to reset config since credentials are correct at this point
					  	console.log(chalk.red(`
	There was an error adding songs to the playlist. 

	However, a playlist was created. 

	Please try a different search.`)); 
					  });
				}
				populatePlaylist(newPlaylistID, tracks, playlistName);
		  })

	  .catch(async err => { 
	  	spinner.fail('Failed');
	  	config.clear();
	  	console.log(err)
	  	console.log(chalk.red(`
	ERROR: Incorrect username or bearer token

	You might need to update your bearer token

	Generate a new one at https://developer.spotify.com/web-api/console/post-playlists/

	Try again!
	  $ spotifork <playlist uri>`));

	  });
	})

	.catch(err => {
		spinner.fail('Failed');
		config.clear()
	  	console.log(chalk.red(`
	ERROR: Incorrect username, bearer token, or URI

	You might need to update your bearer token

	Generate a new one at https://developer.spotify.com/web-api/console/post-playlists/

	Remember to select the suggested scopes!

	Also, make sure you entered a valid Spotify URI!

	Try again!
	  $ spotifork <playlist uri>`));
	})

}

spinner.stop();

const cli = meow(chalk.cyan(`
    Usage
      $ spotifork <playlist URI>
      ? Enter your Spotify username <username>
      ? Enter your Spotify bearer token <bearer>
    Options
      --name [-n] "playlist name"
    Example
      $ spotifork spotify:user:kabirvirji:playlist:23v4GpUwnvSENslciz2CkC
      ? Enter your Spotify username kabirvirji
      ? Enter your Spotify bearer token ************************************************************
    For more information visit https://github.com/kabirvirji/spotifork
`), {
    alias: {
        n: 'name'
    }
}
);

// to notify users about updates
updateNotifier({pkg}).notify();

(async () => {

if (config.get('username') === undefined || config.get('bearer') === undefined) {
	let authorization = await auth();
}
spotifork(cli.input[0], cli.flags);

})()
