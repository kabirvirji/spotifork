// spotifork spotify:user:moses_cc:playlist:23v4GpUwnvSENslciz2CkC
// ask for spotify username and password store in conf
// get things needed to read from that playlist -> store tracks
// create empty playlist, but use the same playlist name
// add stored tracks
// done

#!/usr/bin/env node
'use strict';
const got = require('got');
const meow = require('meow');
const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');
const Conf = require('conf');
const updateNotifier = require('update-notifier');

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
	const PlaylistURI = inputs;

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