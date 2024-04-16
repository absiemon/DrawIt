"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const http = require("http");
const socket_io_1 = require("socket.io");
const app = express();
const cors = require("cors");
const parser = require("socket.io-msgpack-parser");
const CLIENT_URL = process.env.CLIENT_URL;
const PORT = process.env.PORT || 8080;
app.use(cors({
    origin: [CLIENT_URL],
}));
const server = http.createServer(app);
const io = new socket_io_1.Server(server, {
    parser,
    cors: {
        origin: [CLIENT_URL],
    },
});
io.on("connection", (socket) => {
    console.log("Socket connection established with a client!");
    socket.on("join", (room) => {
        console.log("client requested to join the room!", room);
        socket.join(room);
    });
    socket.on("leave", (room) => {
        console.log("client left the room!", room);
        socket.leave(room);
    });
    socket.on("getElements", ({ elements, room }) => {
        socket.to(room).emit("setElements", elements);
    });
});
app.get("/", (req, res) => {
    res.send(`Server is running donn't worry!`);
});
server.listen(PORT, () => {
    console.log("Listen in port : " + PORT);
});
//# sourceMappingURL=app.js.map