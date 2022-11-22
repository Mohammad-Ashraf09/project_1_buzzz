import {Server} from "socket.io";

const io = new Server({
    cors:{
        origin: "http://localhost:3000",
    },
});

// for notification
let users1 = [];
const addUser1 = (userId, socketId)=>{
    !users1.some(user=>user.userId === userId) && users1.push({userId, socketId});
}
const removeUser1 = (socketId)=>{
    users1 = users1.filter((user) => user.socketId !== socketId);
}
const getUser1 = (userId)=>{
    return users1.find((user)=> user.userId === userId);
}
const getUser = ()=>{
    return users1;
}


//for messanger
let users2 = [];
const addUser2 = (userId, socketId)=>{
    !users2.some(user=>user.userId === userId) && users2.push({userId, socketId});
}
const removeUser2 = (socketId)=>{
    users2 = users2.filter((user) => user.socketId !== socketId);
}
const getUser2 = (userId)=>{
    return users2.find((user)=> user.userId === userId);
}


io.on("connection", (socket)=>{
    // when a user login/comming to home page
    socket.on("addUser1", (userId)=>{
        addUser1(userId, socket.id);
        io.emit("getUsers1", users1);
        console.log(userId + ", " + socket.id + " - Home");
    });

    // get all users
    socket.on("sendUser", (id)=>{
        const x = getUser1(id)
        const user = getUser();
        io.to(x?.socketId).emit("getUser", user);
    });

    // notification
    socket.on("sendNotification", ({senderId, name, avatar, receiverId, type})=>{
        const user = getUser1(receiverId);
        io.to(user?.socketId).emit("getNotification", {
            senderId,
            name,
            avatar,
            type,
        });
    });

    // when a user comming messenger page or connect
    socket.on("addUser2", userId=>{
        addUser2(userId, socket.id);
        io.emit("getUsers2", users2);
        console.log(userId + ", " + socket.id + " - Messenger");
    });
    
    // send message/receive message
    socket.on("sendMessage", ({senderId, receiverId, text})=>{
        const user2 = getUser2(receiverId);
        io.to(user2.socketId).emit("getMessage", {
            senderId,
            text,
        });
    });

    socket.on("disconnect", ()=>{
        removeUser1(socket.id);
        console.log("disconnected...", socket.id);
    });
});

io.listen(8100);
