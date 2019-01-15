// mimikov.js

const Timidity = require('timidity')
const player = new Timidity('scripts/')

var downloadPath = ''

window.onload = function() {
    document.getElementById('generate').addEventListener('click', generateMIDI)
    document.getElementById('playButton').addEventListener('click', playButton)
    document.getElementById('pauseButton').addEventListener('click', pauseButton)
    document.getElementById('stopButton').addEventListener('click', stopButton)
    document.getElementById('downloadButton').addEventListener('click', downloadButton)

    document.getElementsByName('category').forEach(element => {
        element.addEventListener('click', selectCategory)
    })
    document.getElementsByName('order').forEach(element => {
        element.addEventListener('click', selectOrder)
    })
}

function selectCategory(event) {
    const selected = event.target.textContent;
    let sourceButton = document.getElementById('sourceButton');
    sourceButton.textContent = selected;
}

function selectOrder(event) {
    const selected = event.target.textContent;
    let orderButton = document.getElementById('orderButton');
    orderButton.textContent = selected;
}

async function generateMIDI(event) {
    const category = document.getElementById('sourceButton').textContent;
    const order = document.getElementById('orderButton').textContent;
    if (category == 'Music Source' || order == 'Markov Order') {
        return;
    }
    const midiResponse = await axios.post('/generate', { category: category, order: order });
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
    downloadPath = midiResponse.data.path;
    console.log(downloadPath);
}

function downloadButton(event) {
    window.open(downloadPath);
    console.log('Download me!');
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
