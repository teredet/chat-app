export function generateMessage(text) {
    return {
        message: text,
        createdAt: new Date().getTime()
    }
}