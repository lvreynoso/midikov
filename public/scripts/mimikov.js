// mimikov.js

const Timidity = require('timidity')
const player = new Timidity('scripts/')
player.load('../midi/Legend of Zelda - Overworld.mid')
window.onload = function() {
    document.getElementById('playButton').addEventListener('click', playButton)
    document.getElementById('pauseButton').addEventListener('click', pauseButton)
    document.getElementById('stopButton').addEventListener('click', stopButton)
}

function playButton(event) {
    player.play()
    console.log('Play me!');
}

function pauseButton(event) {
    player.pause()
    console.log('Pause me!');
}

function stopButton(event) {
    player.pause()
    player.seek(0)
    console.log('Stop me!');
}
