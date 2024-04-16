import * as dotenv from "dotenv";
dotenv.config();
import * as express from "express";
import * as http from "http";
import { Server, Socket } from "socket.io";
const app = express();
import * as cors from 'cors'
import * as parser from 'socket.io-msgpack-parser'

const CLIENT_URL = process.env.CLIENT_URL as string;
const PORT = process.env.PORT || 8080;

app.use(
  cors({
    origin: [CLIENT_URL],
  })
);

const server = http.createServer(app);

const io = new Server(server, {
  parser,
  cors: {
    origin: [CLIENT_URL],
  },
});


io.on("connection", (socket: Socket) => {
    console.log("Socket connection established with a client!")
  socket.on("join", (room) => {
    console.log("client requested to join the room!", room)
    socket.join(room);
  });

  socket.on("leave", (room) => {
    console.log("client left the room!", room)
    socket.leave(room);
  });

  socket.on("getElements", ({ elements, room }) => {
    socket.to(room).emit("setElements", elements);
  });
});

app.get("/", (req, res) => {
  res.send(
    `Server is running donn't worry!`
  );
});

server.listen(PORT, () => {
  console.log("Listen in port : " + PORT);
});
