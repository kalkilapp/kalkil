function calculate(){

let spotifyStreams = document.getElementById("spotify").value;
let youtubeViews = document.getElementById("youtube").value;

let spotifyRevenue = spotifyStreams * 0.003;
let youtubeRevenue = (youtubeViews / 1000) * 3;

document.getElementById("spotifyResult").innerText =
"$" + spotifyRevenue.toFixed(2);

document.getElementById("youtubeResult").innerText =
"$" + youtubeRevenue.toFixed(2);

document.getElementById("totalResult").innerText =
"$" + (spotifyRevenue + youtubeRevenue).toFixed(2);

}