import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import path from 'path'

class App {
  private app: express.Application
  private http: http.Server
  private io: Server

  constructor() {
    this.app = express()
    this.http = http.createServer(this.app)
    this.io = new Server(this.http)
    this.listenSockets()
    this.setupRoutes()
  }

  listenServer() {
    this.http.listen(3000, () => console.log('Server running on port 3000'))
  }

  listenSockets(){
    this.io.on('connection', (socket) => {
        console.log('user connected:', socket.id);

        socket.on('joinRoom', ({ user, room }) => {
            socket.join(room);
            console.log(`${user} entrou na ${room}`);
        });

        socket.on('message', (msg) => {
            if (msg.room) {
                this.io.to(msg.room).emit('message', msg);
            } else {
                this.io.emit('message', msg);
            }
            console.log("Mensagem recebida:", msg);
        });
    });
}

  setupRoutes() {
    this.app.get('/', (_, res) => {
      res.sendFile(path.join(__dirname, 'entrada.html'))
    })

    this.app.get('/chat', (_, res) => {
      res.sendFile(path.join(__dirname, 'index.html'))
    })
  }
}

const app = new App()
app.listenServer()
