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
    if (!navigator.geolocation) return console.log("Geolocation isn't supported");
    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
        socket.emit('sendLocation', {
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
            timestamp: position.timestamp
        }, () => {
            e.target.removeAttribute('disabled');
        })
    });
}

const messages = document.getElementById('messages');
const messageTemplate = document.getElementById('message-template').innerHTML;
const locationMessageTemplate = document.getElementById('location-message-template').innerHTML;

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.on('message', (data) => {
    console.log(data)
    const html = Mustache.render(messageTemplate, {
        author: data.author,
        message: data.message,
        createdAt: moment(data.createdAt).format('hh:mm a')
    })
    messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (data) => {
    const html = Mustache.render(locationMessageTemplate, {
        author: data.author,
        url: data.url,
        createdAt: moment(data.timestamp).format('hh:mm a')
    })
    messages.insertAdjacentHTML('beforeend', html)
})

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error);
        location.href = '/'
    }
})