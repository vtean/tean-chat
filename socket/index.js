require("dotenv").config();
const { Server } = require("socket.io");

const PORT = process.env.SOCKET_PORT || 3500;
const CLIENT_URI = process.env.CLIENT_URI;

const io = new Server({
    cors: CLIENT_URI,
});

let onlineUsers = [];

io.on("connection", (socket) => {
    console.log("new connection: ", socket.id);

    // listen to a connection
    socket.on("addNewUser", (userId) => {
        userId &&
            !onlineUsers.some((user) => user.userId === userId) &&
            onlineUsers.push({
                userId,
                socketId: socket.id,
            });

        io.emit("getOnlineUsers", onlineUsers);
    });

    // add new message
    socket.on("sendMessage", (message) => {
        const user = onlineUsers?.find((user) => user.userId === message.recipientId);

        if (user) {
            io.to(user.socketId).emit("getMessage", message);
            if (message.senderId) {
                io.to(user.socketId).emit("getNotifications", {
                    senderId: message.senderId,
                    isRead: false,
                    date: new Date(),
                });
            }
        }
    });

    // update last messages
    socket.on("updateLastMessages", (response) => {
        const user = onlineUsers?.find((user) => user.userId === response.recipientId);

        if (user) io.to(user.socketId).emit("getLastMessages", response.messages);
    });

    socket.on("disconnect", () => {
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
        io.emit("getOnlineUsers", onlineUsers);
    });
});

io.listen(PORT);
