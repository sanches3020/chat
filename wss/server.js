import { WebSocketServer } from 'ws'

const wss = new WebSocketServer({ port: 8080 })

function log(...args) {
    console.log(new Date().toISOString(), ...args)
}

const sockets = new Set()
wss.on('connection', (ws, req) => {
    const params = new URLSearchParams(req.url.split('?')[1])
    const name = params.get('name')

    if (!name) return ws.close()

    for (const s of sockets) {
        if (s.name === name) return ws.close()
    }

    ws.name = name
    sockets.add(ws)
    log('OPEN name:', name)

    ws.on('close', () => {
        sockets.delete(ws)
        log('CLOSED name:', name)
    })

    ws.on('message', (message) => {
        const msgStr = String(message)
        log('RECEIVED name:', ws.name, 'msg:', msgStr)

        try {
            const data = JSON.parse(msgStr)
            for (const socket of sockets) {
                if (socket.name === data.to) {
                    socket.send(JSON.stringify({
                        from: ws.name,
                        type: data.type,
                        message: data.message
                    }))
                }
            }
        } catch (err) {
            log('PARSE ERROR name:', ws.name, 'err:', err?.message)
        }
    })
})

const handleError = (err) => log('SYSTEM ERROR:', err?.stack || String(err))
process.on('unhandledRejection', handleError)
process.on('uncaughtException', handleError)
