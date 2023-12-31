const socket = io();

function sendMessage(e) {
    e.preventDefault();

    e.target.elements[1].setAttribute('disabled', 'disabled');
    socket.emit('sendMessage', e.target.message.value, (res) => {
        e.target.elements[1].removeAttribute('disabled');
        e.target.elements[0].value = '';
        e.target.elements[0].focus();
    })
}

function sendLocation(e) {
    e.target.setAttribute('disabled', 'disabled');
    if (!navigator.geolocation) return console.log("Geolocation isn't supported");
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
            timestamp: position.timestamp
        }, () => {
            e.target.removeAttribute('disabled');
        })
    });
}

function autoscroll() {
    const newMessage = messages.lastElementChild;
    const newMessageStyles = getComputedStyle(newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = newMessage.offsetHeight + newMessageMargin;

    const visibleHeight = messages.offsetHeight;
    const containerHeight = messages.scrollHeight;
    const scrollOffset = messages.scrollTop + visibleHeight;

    if ((containerHeight - newMessageHeight) <= scrollOffset) messages.scrollTop = messages.scrollHeight; 
}

const messages = document.getElementById('messages');
const messageTemplate = document.getElementById('message-template').innerHTML;
const locationMessageTemplate = document.getElementById('location-message-template').innerHTML;
const sidebarTemplate = document.getElementById('sidebar-template').innerHTML;

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.on('message', (data) => {
    const html = Mustache.render(messageTemplate, {
        author: data.author,
        message: data.message,
        createdAt: moment(data.createdAt).format('hh:mm a')
    })
    messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
})

socket.on('locationMessage', (data) => {
    const html = Mustache.render(locationMessageTemplate, {
        author: data.author,
        url: data.url,
        createdAt: moment(data.timestamp).format('hh:mm a')
    })
    messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
})

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error);
        location.href = '/'
    }
})

socket.on('roomData', (data) => {
    const html = Mustache.render(sidebarTemplate, data);
    document.getElementById('sidebar').innerHTML = html;
})