const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./router/Users");
const authRoute = require("./router/Auth");
const postRoute = require("./router/Posts");
const conversationRoute = require("./router/Conversations");
const messageRoute = require("./router/Messages");
const notificationRoute = require("./router/Notifications");
const multer = require("multer");
const path = require("path");
// const MongoClient = require("mongodb").MongoClient;


const port = process.env.PORT || 8000;
dotenv.config();

mongoose.connect(process.env.DATABASE)
.then(()=>{
    console.log(`connected to database`);
}).catch((err)=>{
    console.log(err)
});

app.use("/images", express.static(path.join(__dirname, "public/images")));

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));


const storage = multer.diskStorage({
  destination: (req, file, cb)=>{
    cb(null, "public/images")
  },
  filename:(req, file, cb)=>{
    cb(null, req.body.name);    // jo file name client side se aa raha hai usko ye pulic/images folder me save kr dega with same name
  }
})

const upload = multer({storage:storage});
app.post("/api/upload", upload.single('file'), (req, res)=>{
  try{
    return res.status(200).json("File uploaded successfully...");
  }
  catch(err){
    console.log(err);
  }
})


app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/notifications", notificationRoute);


// get all the users from social collection name of database
// var database;

// app.get("/api/all", (req, res)=>{
//   database.collection("users").find({}).toArray((err, result)=>{
//     if(err) throw err
//     res.send(result)
//   })
// })

// MongoClient.connect(process.env.DATABASE, (err, db)=>{
//   if(err) throw err;
//   database = db.db("social");
//   console.log("connected...")
// })


app.listen(port, () => {
  console.log(`server is running at port 8000`);
})