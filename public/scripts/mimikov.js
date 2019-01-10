// mimikov.js

const Timidity = require('timidity')
const player = new Timidity('scripts/')
window.onload = function() {
    document.getElementById('generate').addEventListener('click', generateMIDI)
    document.getElementById('playButton').addEventListener('click', playButton)
    document.getElementById('pauseButton').addEventListener('click', pauseButton)
    document.getElementById('stopButton').addEventListener('click', stopButton)
}

async function generateMIDI(event) {
    const midiResponse = await axios.post('/generate', { category: 'Pokemon' });
    console.log(midiResponse);
    const midiBuffer = hexToBuffer(midiResponse.data.hex)
    console.log(midiBuffer);
    player.load(midiBuffer);
    // player.load(midiResponse.data.path);
    // update the song title bar
    let titlebar = document.getElementById('songTitle')
    console.log(titlebar);
    titlebar.textContent = midiResponse.data.title;
    // update the download button path
    let downloadButton = document.getElementById('downloadButton');
    console.log(downloadButton);
    let downloadText = downloadButton.textContent;
    downloadButton.textContent = '';
    let downloadLink = document.createElement('a');
    let linkText = document.createTextNode(downloadText);
    downloadLink.appendChild(linkText);
    downloadLink.title = 'Download generated MIDI';
    downloadLink.href = midiResponse.data.path;
    downloadButton.appendChild(downloadLink);
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

function hexToBuffer(hexString) {
    return new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
}
