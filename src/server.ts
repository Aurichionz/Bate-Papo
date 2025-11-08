import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
class App{
    private app: express.Application
    private http: http.Server
    private io: Server

    constructor(){
        this.app = express();
        this.http = http.createServer(this.app);
        this.io = new Server(this.http);
        this.listenSockets();
        this.setupRoutes();
    }
    listenServer(){
        this.http.listen(3000, () => console.log('Server is running on port 3000'))
    }
    listenSockets(){
        this.io.on('connection', (socket) => {
            console.log('user connected:', socket.id)

            socket.on('message', (msg) => {
                this.io.emit('message', msg)
                console.log("file:server.ts:16 ~ App ~ socket.on msg:", msg)
            })
        })
    }
    setupRoutes(){
        this.app.get('/', (req, res) => {
            res.sendFile(__dirname + '/index.html');
        });
    }
}

const app = new App();

app.listenServer();