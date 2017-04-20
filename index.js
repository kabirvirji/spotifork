#!/usr/bin/env node

// spotifork spotify:user:moses_cc:playlist:23v4GpUwnvSENslciz2CkC
// ask for spotify username and password store in conf
// get things needed to read from that playlist -> store tracks
// create empty playlist, but use the same playlist name
// add stored tracks
// done

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

	// name of the playlist, optional parameter
	var playlistName = flags['n'];
	// playlist URI
	let PlaylistURI = inputs;
	const playlistID = inputs.slice(33);
	console.log(playlistID)

	if (PlaylistURI === undefined){
			spinner.fail('Failed');
			console.log(chalk.red(`
	Oops! Remember to add an artist name!

	Example

		spotifork spotify:user:kabirvirji:playlist:23v4GpUwnvSENslciz2CkC
		`))
			return
	}

	spinner.start();


	// create an empty public playlist
	var options = {
	  json: true, 
	  headers: {
	    'Content-type': 'application/json',
	    'Authorization' : `Bearer ${config.get('bearer')}`,
	    'Accept' : 'application/json'
	  },
	  body: JSON.stringify({ name: `${playlistName}`, public : true})
	};
	var options1 = {
	  json: true, 
	  headers: {
	    'Content-type': 'application/json',
	    'Authorization' : `Bearer ${config.get('bearer')}`
	  }
	};
	console.log(`https://api.spotify.com/v1/users/${config.get('username')}/playlists/${playlistID}/tracks`)
	got(`https://api.spotify.com/v1/users/${config.get('username')}/playlists/${playlistID}/tracks`, options1)
	  .then(response => {
	    console.log(response)
		spinner.stop();
	  })

	  .catch(async err => { 
	  	spinner.fail('Failed');
	  	config.clear();
	  	console.log(err);
	  	console.log(chalk.red(`
	ERROR: Incorrect username or bearer token

	You might need to update your bearer token

	Generate a new one at https://developer.spotify.com/web-api/console/post-playlists/

	Try again!
	  $ spotifork <playlist uri>`));

	  });

	// error checks after post requests indicate invalid bearer tokens

	// cause use webpage auth to regenerate tokens

	// get playlist tracks using username and uri
	// put those tracks in array
	// create an empty public playlist
	// write tracks in array to playlist
	// success


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


updateNotifier({pkg}).notify();

(async () => {

if (config.get('username') === undefined || config.get('bearer') === undefined) {
	let authorization = await auth();
}
spotifork(cli.input[0], cli.flags);

})()