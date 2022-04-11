const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./router/Users");
const authRoute = require("./router/Auth");
const postRoute = require("./router/Posts");


const port = process.env.PORT || 8000;
dotenv.config();

mongoose.connect(process.env.DATABASE)
.then(()=>{
    console.log(`connected to database`);
}).catch((err)=>{
    console.log(err)
});

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));


// app.get("/", (req,res)=>{
//     res.send("home");
// })
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);

app.listen(port, () => {
  console.log(`server is running at port 8000`);
})