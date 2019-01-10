// mimikov.js

const Timidity = require('timidity')
const player = new Timidity()
player.load('../midi/Legend of Zelda - Overworld.mid')
window.onload = function() {
    document.getElementById('playButton').addEventListener('click', playButton)
}

function playButton(event) {
    player.play()
    console.log('Play me!');
}
