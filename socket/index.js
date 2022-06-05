import {Server} from "socket.io";

const io = new Server({
    cors:{
        origin: "http://localhost:3000",
    },
});

let users = [];
const addUser = (userId, socketId)=>{
    !users.some(user=>user.userId === userId) && users.push({userId, socketId});
}
const removeUser = (socketId)=>{
    users = users.filter((user) => user.socketId !== socketId);
}
const getUser = (userId)=>{
    return users.find((user)=> user.userId === userId);
}


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
    // when a user comming messenger page or connect
    socket.on("addUser", userId=>{
        addUser(userId, socket.id);
        io.emit("getUsers", users);
        console.log("someone has connected...");
    });
    

    // send message / receive message
    socket.on("sendMessage", ({senderId, receiverId, text})=>{
        const user = getUser(receiverId);
        io.to(user.socketId).emit("getMessage", {
            senderId,
            text,
        });
    });


    socket.on("addUser2", (userId)=>{
        addUser2(userId, socket.id);
        console.log(userId);
        console.log(socket.id);
        // io.emit("getUsers2", users2);
        // console.log("someone has connected...");
    });

    // notification
    socket.on("sendNotification", ({senderId, name, avatar, receiverId, type})=>{
        // console.log(senderId);
        // console.log(receiverId);
        // console.log(type);
        const user = getUser2(receiverId);
        console.log(user)
        io.to(user?.socketId).emit("getNotification", {
            senderId,
            name,
            avatar,
            type,
        });
    });

    socket.on("disconnect", ()=>{
        removeUser2(socket.id);
    });
});

io.listen(8100);
