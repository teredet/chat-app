const socket = io();

function sendMessage(e) {
    e.preventDefault()
    console.log(e.target.message.value)
    socket.emit('sendMessage', e.target.message.value)
}

function sendLocation() {
    if(!navigator.geolocation) return console.log("Geolocation isn't supported");
    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position);
        socket.emit('sendLocation', {
            longitude: position.coords.longitude,
            latitude: position.coords.latitude
        })
    });
}

const messageP = document.getElementById('message');

socket.on('message', (message) => {
    messageP.innerText = message;
})