const socket = io();

function sendMessage(e) {
    e.preventDefault()
    console.log(e.target.message.value)
    socket.emit('sendMessage', e.target.message.value)
}


const messageP = document.getElementById('message');

socket.on('message', (message) => {
    messageP.innerText = message;
})