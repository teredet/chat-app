const socket = io();

function sendMessage(e) {
    e.preventDefault();

    e.target.elements[1].setAttribute('disabled', 'disabled');
    socket.emit('sendMessage', e.target.message.value, (res) => {
        e.target.elements[1].removeAttribute('disabled');
        e.target.elements[0].value = '';
        e.target.elements[0].focus();
        console.log(res);
    })
}

function sendLocation(e) {
    e.target.setAttribute('disabled', 'disabled');
    if(!navigator.geolocation) return console.log("Geolocation isn't supported");
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            longitude: position.coords.longitude,
            latitude: position.coords.latitude
        }, () => {
            e.target.removeAttribute('disabled');
        })        
    });
}

const messageP = document.getElementById('message');

socket.on('message', (message) => {
    messageP.innerText = message;
})