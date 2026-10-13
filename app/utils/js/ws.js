app.factory('ws', function () {
    let socket = null
    let listeners = []
    let messages = []
    let service = {
        connected: false,
        connect: function (name) {
            let url = location.origin.replace('http', 'ws').replace('app', 'chat')
            url += "?name=" + name
            if (socket) socket.close()
            socket = new WebSocket(url)
            socket.onopen = function () {
                service.connected = true
                listeners.forEach(i => i({ type: 'ws_opened' }))
                while (messages.length > 0) {
                    socket.send(JSON.stringify(messages.shift()))
                }
            }
            socket.onmessage = function (event) {
                try {
                    const data = JSON.parse(event.data)
                    listeners.forEach(i => i(data))
                } catch (e) {
                    listeners.forEach(i => i(event.data))
                }
            }
            socket.onclose = function () {
                service.connected = false
                listeners.forEach(i => i({ type: 'ws_closed' }))
            }
            socket.onerror = function (error) {
                listeners.forEach(i => i({ type: 'ws_error', error }))
            }
        },
        subscribe: function (scope, callback) {
            listeners.push(callback)
            if (scope && scope.$on) {
                scope.$on('$destroy', function () {
                    listeners = listeners.filter(cb => cb !== callback)
                })
            }
        },
        send: function (to, type, message) {
            let ws_message = { to, type, message }
            if (service.connected && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify(ws_message))
            } else {
                messages.push(ws_message)
            }
        }
    }
    return service
})
