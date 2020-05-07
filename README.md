# spotifork 🍴

> Fork a Spotify playlist

![](spotifork-demo.gif)
<!-- need new gif with name parameter -->

> **NOTE:** Since I began this project Spotify's API has changed (for one, see the difference in URIs now). However, I have implemented a quick fix to get spotifork working again

<br>
Spotifork creates an identical playlist from another user's playlist under your name. Just like forking on GitHub! You can then add/remove songs as you please.
<br>

## Install
`$ npm install -g spotifork` <br><br>
**Note:** Node version 7.7.1+ required. `$ node -v` to check which version you have installed. The latest version can be downloaded [here](https://nodejs.org/en/)

## Usage
`$ spotifork <playlist URI>`

The program will then prompt you for your Spotify username and bearer token. <br>

You can get the playlist URI by going to **share** on whichever Spotify platform you're on. <br>

You can get the bearer token here: https://developer.spotify.com/web-api/console/post-playlists/ <br>
Click **GET OAUTH TOKEN** and make sure to check *playlist-modify-public* 

## Optional Parameters

`-n` to specify the new forked playlist name

<br>

`$ spotifork --help`

```
Usage
      $ spotifork "<playlist URI>"
      ? Enter your Spotify username <username>
      ? Enter your Spotify bearer token <bearer>

    Options
      --name [-n] "playlist name"

    Example
      $ spotifork spotify:user:kabirvirji:playlist:57wpYVzySANpWQpiBetoMi -n "My awesome playlist!"
      ? Enter your Spotify username kabirvirji
      ? Enter your Spotify bearer token ************************************************************

    For more information visit https://github.com/kabirvirji/spotifork
```

![](spotifork-playlist.png)
