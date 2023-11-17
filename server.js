const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const ACTIONS = require("./utilities/socketActions");
const routes = require("./routes/routes");

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());

app.use(cors());
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "https://live-code-three.vercel.app",
    method:["GET","POST"]
  },
});


const userSocketMap = {};
const getAllConnectedClients =(roomId)=> {
  // Map
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
}

io.on("connection", (socket) => {
  console.log("socket connected", socket.id);

  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, html, css, js }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { html, css, js });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ socketId, html, css, js }) => {
    console.log(html, css, js);

    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { html, css, js });
  });

  socket.on("disconnecting", () => {
    const rooms = Array.from(socket.rooms);
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
      socket.leave(roomId);
    });
    delete userSocketMap[socket.id];
  });

});

app.get("/", (req, res) => {
  res.json({ status: "node js running" });
});

app.use("/api", routes);

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));


// Mongoose connection
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
};

connectToMongoDB();
