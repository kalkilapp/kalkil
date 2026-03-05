function calculate(){

let streams = document.getElementById("spotifyStreams").value;
let views = document.getElementById("youtubeViews").value;
let cpm = document.getElementById("youtubeCPM").value;

let spotifyIncome = streams * 0.0035;
let youtubeIncome = (views / 1000) * cpm;

let total = spotifyIncome + youtubeIncome;

document.getElementById("result").innerText =
"Spotify: $" + spotifyIncome.toFixed(2) +
" | YouTube: $" + youtubeIncome.toFixed(2) +
" | Total: $" + total.toFixed(2);

}