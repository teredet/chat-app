const users = [];

export function addUser({ id, username, room }) {
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    if (!username || !room) return { error: 'Username and room are required!' }

    const existingUser = users.find((user) => {
        return user.username == username && user.room == room
    })
    if (existingUser) return { error: 'Username is in use!' }

    users.push({ id, username, room })
    return { user: { id, username, room } }
}

export function removeUser(id) {
    const index = users.findIndex((user) => user.id == id);
    if (index < 0) return { error: "User don't exist" }
    return users.splice(index, 1)[0]
}

export function getUser(id) {
    const user = users.find((user) => user.id == id);
    if (!user) return { error: "User don't exist" }
    return user;
}
export function getUsersInRoom(room) {
    const usersInRoom = users.filter((user) => user.room == room);
    return usersInRoom;
}
