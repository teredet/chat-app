export function generateMessage(text, name) {
    return {
        message: text,
        author: name,
        createdAt: new Date().getTime()
    }
}